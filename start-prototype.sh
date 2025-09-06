#!/bin/bash

# HARMONI Prototype Startup Script

echo "====================================="
echo "  HARMONI Music Platform Prototype   "
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run the prototype."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm to run the prototype."
    exit 1
fi

# Install dependencies if needed
echo "Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

echo "Dependencies installed successfully."
echo ""

# Start the servers
echo "Starting HARMONI prototype servers..."
echo ""
echo "The prototype will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the servers."
echo ""

# Use npm script to start both servers
npm run dev