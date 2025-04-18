from fastapi import APIRouter, Depends, HTTPException, Request, Query
from typing import Dict, Any, Optional, List

from app.services.questions_service import QuestionsService
from app.models.leetcode_models import QuestionListResponse

router = APIRouter()

@router.get("/questions", response_model=QuestionListResponse, summary="Get all LeetCode questions")
async def get_all_questions(
    category: str = Query("all-code-essentials", description="Category of questions to fetch"),
    page: int = Query(1, description="Page number", ge=1),
    page_size: int = Query(100, description="Number of questions per page", ge=1, le=500),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty (EASY, MEDIUM, HARD)"),
    search: Optional[str] = Query(None, description="Search by title or ID")
):
    """Fetch all LeetCode questions with pagination and filtering"""
    try:
        # Calculate skip based on page and page_size
        skip = (page - 1) * page_size
        
        # Build filters
        filters = {}
        if difficulty:
            filters["difficulty"] = difficulty
        if search:
            filters["search"] = search
        
        # Fetch questions
        questions = await QuestionsService.get_all_questions(
            category=category,
            skip=skip,
            limit=page_size,
            filters=filters
        )
        
        return questions
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch questions: {str(e)}")