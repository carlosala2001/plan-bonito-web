
#!/bin/bash

# Exit on error
set -e

# Set console color variables
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Installation banner
echo -e "${BLUE}${BOLD}"
echo "========================================"
echo "    ZenoScale Admin Panel Installer     "
echo "========================================"
echo -e "${NC}"

# Check if running as root (not recommended for npm)
if [ "$(id -u)" = "0" ]; then
    echo -e "${YELLOW}Warning: Running as root is not recommended for npm installations.${NC}"
    echo "Consider running this script as a regular user with sudo privileges."
    read -p "Continue anyway? (y/N): " choice
    if [ "$choice" != "y" ] && [ "$choice" != "Y" ]; then
        echo "Installation aborted."
        exit 1
    fi
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${GREEN}Installing frontend dependencies...${NC}"
npm install

# Install server dependencies
echo -e "${GREEN}Installing server dependencies...${NC}"
cd server && npm install && cd ..

# Build the project for production
echo -e "${GREEN}Building project for production...${NC}"
npm run build

# Database configuration
echo -e "${BLUE}${BOLD}Database Configuration${NC}"
echo "Please enter your MySQL database credentials:"

# Get user input for database
read -p "Database Host: " DB_HOST
read -p "Database Port (3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}
read -p "Database Name: " DB_NAME
read -p "Database User: " DB_USER
read -s -p "Database Password: " DB_PASSWORD
echo

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# Ask for HetrixTools API Key
echo -e "\n${BLUE}${BOLD}HetrixTools API Configuration${NC}"
read -p "HetrixTools API Key (or leave empty to configure later): " HETRIX_API_KEY

# Create .env file in project root
echo -e "${GREEN}Creating .env file...${NC}"
cat > .env << EOF
PORT=3001
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
HETRIX_API_KEY=${HETRIX_API_KEY}
EOF

# Also create a copy in the server directory to ensure it's available there
echo -e "${GREEN}Creating .env file in server directory...${NC}"
cat > server/.env << EOF
PORT=3001
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
HETRIX_API_KEY=${HETRIX_API_KEY}
EOF

echo -e "${GREEN}.env files created successfully!${NC}"

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"

# Create database if not exists and test connection
node -e "
    const mysql = require('./server/node_modules/mysql2/promise');
    
    async function testConnection() {
        try {
            console.log('Connecting to MySQL server...');
            const connection = await mysql.createConnection({
                host: '${DB_HOST}',
                port: ${DB_PORT},
                user: '${DB_USER}',
                password: '${DB_PASSWORD}'
            });
            
            console.log('Connection successful, creating database if not exists...');
            await connection.query('CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`');
            
            console.log('Switching to database...');
            await connection.query('USE \`${DB_NAME}\`');
            
            console.log('Setting up tables...');
            
            // Create users table
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            \`);
            
            // Create api_keys table
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS api_keys (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    key_value VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            \`);
            
            // Create nodes table
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS nodes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    location VARCHAR(100) NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL,
                    status VARCHAR(20) DEFAULT 'unknown',
                    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            \`);

            // Create hetrixtools_settings table
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS hetrixtools_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    api_key VARCHAR(255) NOT NULL,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                )
            \`);
            
            // If HetrixTools API key was provided, save it
            if ('${HETRIX_API_KEY}'.trim() !== '') {
                await connection.query(\`
                    INSERT INTO hetrixtools_settings (api_key) 
                    VALUES (?) 
                    ON DUPLICATE KEY UPDATE api_key = VALUES(api_key), last_updated = CURRENT_TIMESTAMP
                \`, ['${HETRIX_API_KEY}']);
            }
            
            console.log('Database setup completed successfully');
            connection.end();
            process.exit(0);
        } catch (error) {
            console.error('Error setting up database:', error.message);
            process.exit(1);
        }
    }
    
    testConnection();
" || {
    echo -e "${RED}Database setup failed. Please check your credentials and try again.${NC}"
    exit 1
}

# Ask if user wants to create initial admin
echo
echo -e "${BLUE}${BOLD}Initial Admin User Setup${NC}"
read -p "Would you like to create an initial admin user now? (y/N): " CREATE_ADMIN

if [ "$CREATE_ADMIN" = "y" ] || [ "$CREATE_ADMIN" = "Y" ]; then
    read -p "Admin Username: " ADMIN_USERNAME
    read -p "Admin Email: " ADMIN_EMAIL
    read -s -p "Admin Password: " ADMIN_PASSWORD
    echo
    
    # Use node to create admin user
    echo -e "${YELLOW}Creating admin user...${NC}"
    node -e "
        const bcrypt = require('./server/node_modules/bcrypt');
        const mysql = require('./server/node_modules/mysql2/promise');
        
        async function createUser() {
            try {
                const hashedPassword = await bcrypt.hash('${ADMIN_PASSWORD}', 10);
                
                const connection = await mysql.createConnection({
                    host: '${DB_HOST}',
                    port: ${DB_PORT},
                    user: '${DB_USER}',
                    password: '${DB_PASSWORD}',
                    database: '${DB_NAME}'
                });
                
                // Insert admin user
                await connection.execute(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    ['${ADMIN_USERNAME}', '${ADMIN_EMAIL}', hashedPassword]
                );
                
                console.log('Admin user created successfully!');
                connection.end();
            } catch (error) {
                console.error('Error creating admin user:', error.message);
                process.exit(1);
            }
        }
        
        createUser();
    " || {
        echo -e "${RED}Failed to create admin user.${NC}"
    }
fi

# Make start script executable
echo -e "${GREEN}Making start script executable...${NC}"
chmod +x start.sh

# Setup complete
echo
echo -e "${BLUE}${BOLD}"
echo "========================================"
echo "Installation completed successfully!"
echo
echo "To start the application in production mode, run:"
echo "./start.sh"
echo
echo "The admin panel will be available at:"
echo "http://localhost:3001"
echo
if [ "$CREATE_ADMIN" != "y" ] && [ "$CREATE_ADMIN" != "Y" ]; then
    echo "On first run, you'll be prompted to create an admin user."
fi
echo "========================================"
echo -e "${NC}"

