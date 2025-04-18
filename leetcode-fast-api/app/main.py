from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

# Try to load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment variables loaded successfully")
except Exception:
    print("Error loading environment variables")
    print("Using default values instead")

# Import routers
from app.routers import leetcode_router, auth_router, problem_router, submission_router, questions_router

# Create FastAPI app
app = FastAPI(
    title="LeetCode FastAPI",
    description="A FastAPI implementation of the LeetCode API for accessing daily challenges, submitting solutions, and browsing problems.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
allow_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://codemaster-app.vercel.app",  # Add your Vercel frontend domain
    "https://codemaster-app-*.vercel.app"  # For preview deployments
]

# Allow all origins in development mode
if os.environ.get("VERCEL_ENV") == "development":
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],  # Allows all headers
    expose_headers=["set-cookie", "Content-Type", "Authorization"],
)

# Include routers
app.include_router(leetcode_router.router, prefix="/api/leetcode", tags=["leetcode"])
app.include_router(auth_router.router, prefix="/api/leetcode", tags=["auth"])
app.include_router(problem_router.router, prefix="/api/leetcode", tags=["problems"])
app.include_router(submission_router.router, prefix="/api/leetcode", tags=["submissions"])
app.include_router(questions_router.router, prefix="/api/leetcode", tags=["questions"])

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the exception but don't expose details to the client
    print(f"Global exception handler caught: {type(exc).__name__}")

    # Return a generic error message without exposing sensitive details
    return JSONResponse(
        status_code=500,
        content={"error": "Something went wrong!", "detail": "An internal server error occurred"}
    )

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to LeetCode FastAPI"}

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)