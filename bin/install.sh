
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

# Ask for CtrlPanel API Key and URL
echo -e "\n${BLUE}${BOLD}CtrlPanel API Configuration${NC}"
read -p "CtrlPanel API URL (or leave empty to configure later): " CTRLPANEL_API_URL
read -p "CtrlPanel API Key (or leave empty to configure later): " CTRLPANEL_API_KEY

# Ask for Zoho Mail SMTP Configuration
echo -e "\n${BLUE}${BOLD}Zoho Mail SMTP Configuration${NC}"
read -p "Zoho Mail SMTP Host (or leave empty to configure later): " ZOHO_SMTP_HOST
read -p "Zoho Mail SMTP Port (default: 587): " ZOHO_SMTP_PORT
ZOHO_SMTP_PORT=${ZOHO_SMTP_PORT:-587}
read -p "Zoho Mail Username (or leave empty to configure later): " ZOHO_SMTP_USER
read -s -p "Zoho Mail Password (or leave empty to configure later): " ZOHO_SMTP_PASSWORD
echo

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
CTRLPANEL_API_URL=${CTRLPANEL_API_URL}
CTRLPANEL_API_KEY=${CTRLPANEL_API_KEY}
ZOHO_SMTP_HOST=${ZOHO_SMTP_HOST}
ZOHO_SMTP_PORT=${ZOHO_SMTP_PORT}
ZOHO_SMTP_USER=${ZOHO_SMTP_USER}
ZOHO_SMTP_PASSWORD=${ZOHO_SMTP_PASSWORD}
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
CTRLPANEL_API_URL=${CTRLPANEL_API_URL}
CTRLPANEL_API_KEY=${CTRLPANEL_API_KEY}
ZOHO_SMTP_HOST=${ZOHO_SMTP_HOST}
ZOHO_SMTP_PORT=${ZOHO_SMTP_PORT}
ZOHO_SMTP_USER=${ZOHO_SMTP_USER}
ZOHO_SMTP_PASSWORD=${ZOHO_SMTP_PASSWORD}
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

            // Create hetrixtools_settings table if not exists
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS hetrixtools_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    api_key VARCHAR(255) NOT NULL,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                )
            \`);
            
            // Create ctrlpanel_settings table if not exists
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS ctrlpanel_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    api_url VARCHAR(255) NOT NULL,
                    api_key VARCHAR(255) NOT NULL,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                )
            \`);
            
            // Create email_settings table if not exists
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS email_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    smtp_host VARCHAR(255) NOT NULL,
                    smtp_port INT NOT NULL,
                    smtp_user VARCHAR(255) NOT NULL,
                    smtp_password VARCHAR(255) NOT NULL,
                    from_email VARCHAR(255) NOT NULL,
                    from_name VARCHAR(255) NOT NULL,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                )
            \`);
            
            // Create plans table if not exists
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS plans (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    type ENUM('standard', 'premium', 'metalscale', 'zenovps') NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    currency VARCHAR(10) DEFAULT 'EUR',
                    billing_cycle ENUM('monthly', 'quarterly', 'semiannual', 'annual') DEFAULT 'monthly',
                    cpu_value INT NOT NULL,
                    cpu_unit VARCHAR(50) NOT NULL,
                    ram_value INT NOT NULL,
                    ram_unit VARCHAR(10) NOT NULL,
                    disk_value INT NOT NULL,
                    disk_unit VARCHAR(10) NOT NULL,
                    backups INT NOT NULL,
                    databases INT NOT NULL,
                    ports INT NOT NULL,
                    description_ideal_for VARCHAR(255) NOT NULL,
                    description_perfect_for VARCHAR(255) NOT NULL,
                    highlight BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            \`);
            
            // Create subscribers table for newsletter
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS subscribers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    name VARCHAR(100),
                    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    unsubscribed BOOLEAN DEFAULT FALSE,
                    unsubscribed_at TIMESTAMP NULL,
                    token VARCHAR(255) UNIQUE NOT NULL
                )
            \`);
            
            // Create games table for supported games
            await connection.query(\`
                CREATE TABLE IF NOT EXISTS games (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    logo_url VARCHAR(255) NOT NULL,
                    description VARCHAR(255) NOT NULL,
                    active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
            
            // If CtrlPanel API info was provided, save it
            if ('${CTRLPANEL_API_URL}'.trim() !== '' && '${CTRLPANEL_API_KEY}'.trim() !== '') {
                await connection.query(\`
                    INSERT INTO ctrlpanel_settings (api_url, api_key) 
                    VALUES (?, ?) 
                    ON DUPLICATE KEY UPDATE api_url = VALUES(api_url), api_key = VALUES(api_key), last_updated = CURRENT_TIMESTAMP
                \`, ['${CTRLPANEL_API_URL}', '${CTRLPANEL_API_KEY}']);
            }
            
            // If Zoho SMTP info was provided, save it
            if ('${ZOHO_SMTP_HOST}'.trim() !== '' && '${ZOHO_SMTP_USER}'.trim() !== '' && '${ZOHO_SMTP_PASSWORD}'.trim() !== '') {
                await connection.query(\`
                    INSERT INTO email_settings (smtp_host, smtp_port, smtp_user, smtp_password, from_email, from_name) 
                    VALUES (?, ?, ?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE smtp_host = VALUES(smtp_host), smtp_port = VALUES(smtp_port), 
                    smtp_user = VALUES(smtp_user), smtp_password = VALUES(smtp_password), 
                    last_updated = CURRENT_TIMESTAMP
                \`, [
                    '${ZOHO_SMTP_HOST}', 
                    ${ZOHO_SMTP_PORT}, 
                    '${ZOHO_SMTP_USER}', 
                    '${ZOHO_SMTP_PASSWORD}',
                    '${ZOHO_SMTP_USER}',
                    'ZenoScale'
                ]);
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

# ... keep existing code (admin user setup, making start script executable, and final messages)
