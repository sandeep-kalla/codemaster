import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment variables loaded successfully")
except Exception:
    print("Error loading environment variables")
    print("Using default values instead")

# Import the FastAPI app
from app.main import app

# This file is needed for Vercel serverless deployment
# It exports the FastAPI app to be used by Vercel

# Export the app for Vercel
app = app
