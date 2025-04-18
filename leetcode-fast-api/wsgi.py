from app.main import app

# This file is needed for Vercel serverless deployment
# It exports the FastAPI app to be used by Vercel

# Export the app for Vercel
application = app
