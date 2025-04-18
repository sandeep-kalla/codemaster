from fastapi import APIRouter, Depends, HTTPException, Request, Header
from typing import Dict, Any, Optional

from app.services.auth_service import AuthService
from app.models.leetcode_models import AuthCheckResponse, HeadersModel

router = APIRouter()

@router.get("/auth-check", response_model=AuthCheckResponse, summary="Check LeetCode authentication status")
async def check_authentication(
    request: Request,
    user_agent: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
    csrf_token: Optional[str] = Header(None, alias="x-csrftoken"),
    origin: Optional[str] = Header(None),
    referer: Optional[str] = Header(None)
):
    """Check if the user is authenticated with LeetCode"""
    try:
        # Create headers model from request headers
        headers = HeadersModel(
            cookie=cookie,
            csrfToken=csrf_token,
            userAgent=user_agent,
            origin=origin,
            referer=referer
        )
        
        auth_status = await AuthService.check_authentication(headers)
        return auth_status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check authentication: {str(e)}")

@router.get("/fetch-cookies", summary="Fetch cookies from LeetCode")
async def fetch_cookies_from_leetcode():
    """Endpoint to help users fetch cookies from LeetCode"""
    return {
        "message": "This endpoint is for documentation purposes only. In the browser version, this would help fetch cookies from LeetCode.",
        "instructions": "To authenticate with LeetCode, you need to provide your LeetCode cookies in the request headers."
    }