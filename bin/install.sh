
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

# Set default values
DEFAULT_DB_HOST="localhost"
DEFAULT_DB_PORT="3306"
DEFAULT_DB_NAME="zenoscale_admin"

# Get user input with defaults
read -p "Database Host [$DEFAULT_DB_HOST]: " DB_HOST
read -p "Database Port [$DEFAULT_DB_PORT]: " DB_PORT
read -p "Database Name [$DEFAULT_DB_NAME]: " DB_NAME
read -p "Database User: " DB_USER
read -s -p "Database Password: " DB_PASSWORD
echo

# Use default values if empty
DB_HOST=${DB_HOST:-$DEFAULT_DB_HOST}
DB_PORT=${DB_PORT:-$DEFAULT_DB_PORT}
DB_NAME=${DB_NAME:-$DEFAULT_DB_NAME}

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file
echo -e "${GREEN}Creating .env file...${NC}"
cat > .env << EOF
PORT=3001
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
EOF

echo -e "${GREEN}.env file created successfully!${NC}"

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"

# Check if mysql client is installed
if command -v mysql &> /dev/null; then
    # Create database if not exists and test connection
    if mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" --password="${DB_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};" 2>/dev/null; then
        echo -e "${GREEN}Database connection successful and database '${DB_NAME}' created!${NC}"
        
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
                const bcrypt = require('${PWD}/server/node_modules/bcrypt');
                const mysql = require('${PWD}/server/node_modules/mysql2/promise');
                
                async function createUser() {
                    try {
                        const hashedPassword = await bcrypt.hash('${ADMIN_PASSWORD}', 10);
                        
                        const connection = await mysql.createConnection({
                            host: '${DB_HOST}',
                            port: '${DB_PORT}',
                            user: '${DB_USER}',
                            password: '${DB_PASSWORD}',
                            database: '${DB_NAME}'
                        });
                        
                        // Create users table if not exists
                        await connection.execute(\`
                            CREATE TABLE IF NOT EXISTS users (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                username VARCHAR(100) NOT NULL,
                                email VARCHAR(100) UNIQUE NOT NULL,
                                password VARCHAR(255) NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            )
                        \`);
                        
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
            "
        fi
    else
        echo -e "${RED}Database connection failed. Please check your credentials and try again.${NC}"
        echo "You'll need to manually create the database and update .env file."
    fi
else
    echo -e "${YELLOW}MySQL client not installed. Skipping database connection test.${NC}"
    echo "Please ensure your database is properly configured before running the application."
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
