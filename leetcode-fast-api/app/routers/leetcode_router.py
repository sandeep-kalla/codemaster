from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, Any

from app.services.leetcode_service import LeetCodeService
from app.models.leetcode_models import DailyChallenge

router = APIRouter()

@router.get("/daily", response_model=DailyChallenge, summary="Get daily LeetCode challenge")
async def get_daily_challenge():
    """Fetch today's LeetCode daily challenge"""
    try:
        daily_challenge = await LeetCodeService.fetch_daily_challenge()
        return daily_challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch daily challenge: {str(e)}")