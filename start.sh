
#!/bin/bash

# Set console color variables
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}${BOLD}"
echo "========================================"
echo "         ZenoScale Admin Panel          "
echo "========================================"
echo -e "${NC}"

# Build the project for production
echo -e "${YELLOW}Building project for production...${NC}"
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo -e "\n${RED}Build failed! Please check the errors above.${NC}"
    exit 1
fi

# Set the environment to production
export NODE_ENV=production

# Start the server
echo -e "\n${GREEN}Starting server in production mode...${NC}"
echo -e "${BOLD}Press Ctrl+C to stop the server${NC}\n"
node server/server.js

# The script will continue to run until the server is stopped
