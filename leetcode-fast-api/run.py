import uvicorn
import os

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

# Get configuration from environment variables
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', '8000'))

# This is needed for Vercel serverless deployment
# The app object will be used by the Vercel serverless function

if __name__ == "__main__":
    print(f"✅ Starting server on {HOST}:{PORT}")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)