import os
import requests
from typing import Dict, Any, Optional
from fastapi import HTTPException
from app.models.leetcode_models import HeadersModel

# Constants
LEETCODE_GRAPHQL = os.getenv('LEETCODE_GRAPHQL', 'https://leetcode.com/graphql')


class AuthService:
    """Service for handling LeetCode authentication"""

    @staticmethod
    async def check_authentication(headers: HeadersModel) -> Dict[str, Any]:
        """Check if the user is authenticated with LeetCode"""
        try:
            query = {
                "query": """
                    query getUserProfile {
                        userStatus {
                            userId
                            username
                            isSignedIn
                        }
                    }
                """
            }
            
            # Extract the CSRF token from the cookie if it's not provided in the headers
            csrf_token = headers.csrfToken
            if not csrf_token and headers.cookie:
                csrf_cookie = next((c for c in headers.cookie.split(';') if c.strip().startswith('csrftoken=')), None)
                if csrf_cookie:
                    csrf_token = csrf_cookie.split('=')[1].strip()
                    print(f"Extracted CSRF token from cookie: {csrf_token}")
            
            # Prepare headers
            request_headers = {
                'Content-Type': 'application/json',
                'Cookie': headers.cookie,
                'Referer': 'https://leetcode.com/',
                'User-Agent': headers.userAgent,
                'x-csrftoken': csrf_token,
                'Origin': headers.origin or 'https://leetcode.com',
                'Host': 'leetcode.com'
            }
            
            # Make authentication check request
            response = requests.post(
                LEETCODE_GRAPHQL,
                json=query,
                headers=request_headers
            )
            response.raise_for_status()
            data = response.json()
            
            user_status = data.get('data', {}).get('userStatus', {})
            
            return {
                "isSignedIn": user_status.get('isSignedIn', False),
                "username": user_status.get('username'),
                "userId": user_status.get('userId')
            }
        except requests.RequestException as e:
            print(f"Error in check_authentication service:")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status: {e.response.status_code}")
                print(f"Response headers: {e.response.headers}")
                print(f"Response data: {e.response.text}")
                
                error_detail = f"Failed to check authentication: {e.response.text}"
                status_code = e.response.status_code
            else:
                print(f"Error message: {str(e)}")
                error_detail = f"Failed to check authentication: {str(e)}"
                status_code = 500
                
            return {
                "isSignedIn": False,
                "error": error_detail
            }
        except Exception as e:
            print(f"Unexpected error in check_authentication service: {str(e)}")
            return {
                "isSignedIn": False,
                "error": f"An unexpected error occurred: {str(e)}"
            }