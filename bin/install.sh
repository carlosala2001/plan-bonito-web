
#!/bin/bash

# Exit on error
set -e

# Installation banner
echo "========================================"
echo "    ZenoScale Admin Panel Installer     "
echo "========================================"
echo

# Check if running as root (not recommended for npm)
if [ "$(id -u)" = "0" ]; then
    echo "Warning: Running as root is not recommended for npm installations."
    echo "Consider running this script as a regular user with sudo privileges."
    read -p "Continue anyway? (y/N): " choice
    if [ "$choice" != "y" ] && [ "$choice" != "Y" ]; then
        echo "Installation aborted."
        exit 1
    fi
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

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
JWT_SECRET=$(openssl rand -base64 32)
EOF
  echo ".env file created successfully!"
fi

# Make start script executable
echo "Making start script executable..."
chmod +x start.sh

# Check if mysql is installed
if command -v mysql &> /dev/null; then
    # Check if MySQL server is running
    if mysqladmin ping -h localhost -u root --silent 2> /dev/null; then
        echo "Setting up database..."
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS zenoscale_admin;"
        echo "Database setup completed!"
    else
        echo "MySQL server is not running. Please start it before running this script."
        echo "Then, manually create the database with: mysql -u root -e \"CREATE DATABASE IF NOT EXISTS zenoscale_admin;\""
    fi
else
    echo "MySQL client is not installed. Please install MySQL or MariaDB."
    echo "After installation, manually create the database with: mysql -u root -e \"CREATE DATABASE IF NOT EXISTS zenoscale_admin;\""
fi

# Setup complete
echo
echo "========================================"
echo "Installation completed successfully!"
echo
echo "To start the application in production mode, run:"
echo "./start.sh"
echo
echo "The admin panel will be available at:"
echo "http://localhost:3001"
echo
echo "On first run, you'll be prompted to create an admin user."
echo "========================================"
