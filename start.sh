
#!/bin/bash

# Build the project for production
echo "Building project for production..."
npm run build

# Set the environment to production
export NODE_ENV=production

# Start the server
echo "Starting server in production mode..."
node server/server.js
