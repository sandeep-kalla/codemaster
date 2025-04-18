#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Create necessary directories if they don't exist
mkdir -p app/static

# Create __init__.py files to ensure Python can import modules correctly
touch app/__init__.py
touch api/__init__.py

# Any other build steps can go here
echo "Build completed successfully!"
