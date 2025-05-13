
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

# Check if .env file exists
ENV_FILE="../.env"
SERVER_ENV_FILE="./.env"

# Database setup
echo -e "${YELLOW}Setting up database configuration...${NC}"
read -p "Database Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database Port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Database Name [zenoscale_admin]: " DB_NAME
DB_NAME=${DB_NAME:-zenoscale_admin}

read -p "Database User [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -p "Database Password: " DB_PASSWORD

# CtrlPanel API setup
echo -e "${YELLOW}Setting up CtrlPanel API configuration...${NC}"
read -p "CtrlPanel API Key [leave blank to skip]: " CTRLPANEL_API_KEY
read -p "CtrlPanel API URL [leave blank to skip]: " CTRLPANEL_API_URL

# Zoho Mail setup
echo -e "${YELLOW}Setting up Zoho Mail configuration...${NC}"
read -p "Zoho Mail Host [leave blank to skip]: " ZOHO_MAIL_HOST
read -p "Zoho Mail Port [587]: " ZOHO_MAIL_PORT
ZOHO_MAIL_PORT=${ZOHO_MAIL_PORT:-587}
read -p "Zoho Mail Username [leave blank to skip]: " ZOHO_MAIL_USERNAME
read -p "Zoho Mail Password [leave blank to skip]: " ZOHO_MAIL_PASSWORD
read -p "Zoho Mail From Email [leave blank to skip]: " ZOHO_MAIL_FROM_EMAIL
read -p "Zoho Mail From Name [leave blank to skip]: " ZOHO_MAIL_FROM_NAME

# App URL for unsubscribe links
read -p "App URL (e.g. https://zenoscale.com) [leave blank for localhost]: " APP_URL
APP_URL=${APP_URL:-http://localhost:3001}

# JWT Secret for authentication
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file in project root
echo "Creating .env file in project root directory..."
echo "DB_HOST=$DB_HOST" > $ENV_FILE
echo "DB_PORT=$DB_PORT" >> $ENV_FILE
echo "DB_NAME=$DB_NAME" >> $ENV_FILE
echo "DB_USER=$DB_USER" >> $ENV_FILE
echo "DB_PASSWORD=$DB_PASSWORD" >> $ENV_FILE
echo "JWT_SECRET=$JWT_SECRET" >> $ENV_FILE
echo "APP_URL=$APP_URL" >> $ENV_FILE

# Add CtrlPanel API configuration if provided
if [ ! -z "$CTRLPANEL_API_KEY" ]; then
  echo "CTRLPANEL_API_KEY=$CTRLPANEL_API_KEY" >> $ENV_FILE
fi

if [ ! -z "$CTRLPANEL_API_URL" ]; then
  echo "CTRLPANEL_API_URL=$CTRLPANEL_API_URL" >> $ENV_FILE
fi

# Add Zoho Mail configuration if provided
if [ ! -z "$ZOHO_MAIL_HOST" ]; then
  echo "ZOHO_MAIL_HOST=$ZOHO_MAIL_HOST" >> $ENV_FILE
  echo "ZOHO_MAIL_PORT=$ZOHO_MAIL_PORT" >> $ENV_FILE
  
  if [ ! -z "$ZOHO_MAIL_USERNAME" ]; then
    echo "ZOHO_MAIL_USERNAME=$ZOHO_MAIL_USERNAME" >> $ENV_FILE
  fi
  
  if [ ! -z "$ZOHO_MAIL_PASSWORD" ]; then
    echo "ZOHO_MAIL_PASSWORD=$ZOHO_MAIL_PASSWORD" >> $ENV_FILE
  fi
  
  if [ ! -z "$ZOHO_MAIL_FROM_EMAIL" ]; then
    echo "ZOHO_MAIL_FROM_EMAIL=$ZOHO_MAIL_FROM_EMAIL" >> $ENV_FILE
  fi
  
  if [ ! -z "$ZOHO_MAIL_FROM_NAME" ]; then
    echo "ZOHO_MAIL_FROM_NAME=$ZOHO_MAIL_FROM_NAME" >> $ENV_FILE
  fi
fi

# Create .env file in server directory
echo "Creating .env file in server directory..."
mkdir -p server
echo "DB_HOST=$DB_HOST" > $SERVER_ENV_FILE
echo "DB_PORT=$DB_PORT" >> $SERVER_ENV_FILE
echo "DB_NAME=$DB_NAME" >> $SERVER_ENV_FILE
echo "DB_USER=$DB_USER" >> $SERVER_ENV_FILE
echo "DB_PASSWORD=$DB_PASSWORD" >> $SERVER_ENV_FILE
echo "JWT_SECRET=$JWT_SECRET" >> $SERVER_ENV_FILE
echo "APP_URL=$APP_URL" >> $SERVER_ENV_FILE

# Add CtrlPanel API configuration if provided
if [ ! -z "$CTRLPANEL_API_KEY" ]; then
  echo "CTRLPANEL_API_KEY=$CTRLPANEL_API_KEY" >> $SERVER_ENV_FILE
fi

if [ ! -z "$CTRLPANEL_API_URL" ]; then
  echo "CTRLPANEL_API_URL=$CTRLPANEL_API_URL" >> $SERVER_ENV_FILE
fi

# Add Zoho Mail configuration if provided
if [ ! -z "$ZOHO_MAIL_HOST" ]; then
  echo "ZOHO_MAIL_HOST=$ZOHO_MAIL_HOST" >> $SERVER_ENV_FILE
  echo "ZOHO_MAIL_PORT=$ZOHO_MAIL_PORT" >> $SERVER_ENV_FILE
  
  if [ ! -z "$ZOHO_MAIL_USERNAME" ]; then
    echo "ZOHO_MAIL_USERNAME=$ZOHO_MAIL_USERNAME" >> $SERVER_ENV_FILE
  fi
  
  if [ ! -z "$ZOHO_MAIL_PASSWORD" ]; then
    echo "ZOHO_MAIL_PASSWORD=$ZOHO_MAIL_PASSWORD" >> $SERVER_ENV_FILE
  fi
  
  if [ ! -z "$ZOHO_MAIL_FROM_EMAIL" ]; then
    echo "ZOHO_MAIL_FROM_EMAIL=$ZOHO_MAIL_FROM_EMAIL" >> $SERVER_ENV_FILE
  fi
  
  if [ ! -z "$ZOHO_MAIL_FROM_NAME" ]; then
    echo "ZOHO_MAIL_FROM_NAME=$ZOHO_MAIL_FROM_NAME" >> $SERVER_ENV_FILE
  fi
fi

echo -e "${GREEN}Configuration files created successfully!${NC}"
echo -e "${BLUE}You can now start the server with npm run dev or npm run start.${NC}"

