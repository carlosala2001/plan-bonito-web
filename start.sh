
#!/bin/bash

# Set console color variables
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}${BOLD}"
echo "========================================"
echo "         ZenoScale Admin Panel          "
echo "========================================"
echo -e "${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found.${NC}"
    echo -e "Please run ${BOLD}./bin/install.sh${NC} first to set up the application."
    exit 1
fi

# Test database connection before starting
echo -e "${YELLOW}Testing database connection...${NC}"
node -e "
    const mysql = require('./server/node_modules/mysql2/promise');
    const dotenv = require('./server/node_modules/dotenv');
    
    dotenv.config();
    
    async function testConnection() {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            
            console.log('Database connection successful!');
            connection.end();
            process.exit(0);
        } catch (error) {
            console.error('Database connection failed:', error.message);
            process.exit(1);
        }
    }
    
    testConnection();
" || {
    echo -e "${RED}Failed to connect to database. Please check your .env file and database settings.${NC}"
    echo -e "You may need to run ${BOLD}./bin/install.sh${NC} again to reconfigure your database settings."
    exit 1
}

# Set the environment to production
export NODE_ENV=production

# Start the server
echo -e "\n${GREEN}Starting server in production mode...${NC}"
echo -e "${BOLD}Press Ctrl+C to stop the server${NC}\n"
cd server && node server.js

# The script will continue to run until the server is stopped
