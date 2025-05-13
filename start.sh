
#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}         ZenoScale Admin Panel${NC}"
echo -e "${BLUE}========================================${NC}"

# Load environment variables from .env files
if [ -f .env ]; then
  source .env
fi

if [ -f server/.env ]; then
  source server/.env
fi

# Testing database connection
echo -e "${YELLOW}Testing database connection...${NC}"
mysql -h${DB_HOST:-localhost} -P${DB_PORT:-3306} -u${DB_USER:-root} -p${DB_PASSWORD} ${DB_NAME:-zenoscale_admin} -e "SELECT 'Database connection successful!' as Message;" 2>/dev/null

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Database connection successful!${NC}"
else
  echo -e "${RED}Failed to connect to database. Please check your credentials in .env file.${NC}"
  echo -e "${YELLOW}You might need to re-run ./bin/install.sh to update your database settings.${NC}"
  exit 1
fi

# Check for package.json and install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
fi

if [ ! -d "server/node_modules" ]; then
  echo -e "${YELLOW}Installing server dependencies...${NC}"
  cd server && npm install && cd ..
fi

# Start the server in production mode
echo -e "${YELLOW}Starting server in production mode...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo
cd server && node server.js

