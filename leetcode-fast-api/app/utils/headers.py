from typing import Dict, Any, Optional
from fastapi import Request, Header
from app.models.leetcode_models import HeadersModel


def extract_csrf_token_from_cookie(cookie: str) -> Optional[str]:
    """Extract CSRF token from cookie string"""
    if not cookie:
        return None
    
    csrf_cookie = next((c for c in cookie.split(';') if c.strip().startswith('csrftoken=')), None)
    if csrf_cookie:
        return csrf_cookie.split('=')[1].strip()
    
    return None


async def get_headers_from_request(request: Request) -> HeadersModel:
    """Extract headers from request and create HeadersModel"""
    # Get headers from request
    headers = dict(request.headers.items())
    
    # Extract specific headers
    cookie = headers.get('cookie')
    csrf_token = headers.get('x-csrftoken')
    user_agent = headers.get('user-agent')
    origin = headers.get('origin')
    referer = headers.get('referer')
    
    # If CSRF token is not in headers, try to extract from cookie
    if not csrf_token and cookie:
        csrf_token = extract_csrf_token_from_cookie(cookie)
    
    # Create and return HeadersModel
    return HeadersModel(
        cookie=cookie,
        csrfToken=csrf_token,
        userAgent=user_agent,
        origin=origin,
        referer=referer
    )