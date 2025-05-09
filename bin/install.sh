
#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOF
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=zenoscale_admin
JWT_SECRET=zenoscale_secret_key_change_this_in_production
EOF
  echo ".env file created successfully!"
fi

# Make start script executable
echo "Making start script executable..."
chmod +x start.sh

# Setup database
echo "Setting up database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS zenoscale_admin;"

echo "Installation completed successfully!"
echo ""
echo "To start the application in production mode, run:"
echo "./start.sh"
