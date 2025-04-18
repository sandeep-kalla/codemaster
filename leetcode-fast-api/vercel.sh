#!/bin/bash

# This script helps deploy the FastAPI backend to Vercel

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel if not already logged in
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel..."
    vercel login
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
