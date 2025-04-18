from fastapi import APIRouter, Depends, HTTPException, Request, Header
from typing import Dict, Any, Optional

from app.services.problem_service import ProblemService
from app.services.submission_service import SubmissionService
from app.models.leetcode_models import ProblemDetail, SubmissionRequest, SubmissionResponse, HeadersModel

router = APIRouter()

@router.get("/problems/{title_slug}", response_model=ProblemDetail, summary="Get problem by title slug")
async def get_problem_by_title_slug(title_slug: str):
    """Fetch a LeetCode problem by its title slug"""
    try:
        problem = await ProblemService.fetch_problem_by_title_slug(title_slug)
        return problem
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch problem: {str(e)}")

@router.post("/problems/submit", response_model=SubmissionResponse, summary="Submit solution for a problem")
async def submit_problem_solution(
    submission_data: SubmissionRequest,
    request: Request,
    user_agent: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
    csrf_token: Optional[str] = Header(None, alias="x-csrftoken"),
    origin: Optional[str] = Header(None),
    referer: Optional[str] = Header(None)
):
    """Submit a solution to a LeetCode problem"""
    try:
        # Get the title slug from the request body or query parameters
        title_slug = request.query_params.get("titleSlug")
        if not title_slug:
            raise HTTPException(status_code=400, detail="Title slug is required")
        
        # Create headers model from request headers
        headers = HeadersModel(
            cookie=cookie,
            csrfToken=csrf_token,
            userAgent=user_agent,
            origin=origin,
            referer=referer
        )
        
        # Submit the solution
        submission_result = await SubmissionService.submit_solution(
            title_slug, 
            submission_data.dict(), 
            headers
        )
        
        return submission_result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to submit solution: {str(e)}")

@router.post("/problems/submit-as-proxy", response_model=SubmissionResponse, summary="Submit solution as proxy")
async def submit_problem_solution_as_proxy(submission_data: Dict[str, Any]):
    """Submit a solution to a LeetCode problem using proxy headers"""
    try:
        # Extract data from the request
        title_slug = submission_data.get("titleSlug")
        if not title_slug:
            raise HTTPException(status_code=400, detail="Title slug is required")
        
        solution_data = {
            "lang": submission_data.get("lang", "cpp"),
            "question_id": submission_data.get("questionId"),
            "typed_code": submission_data.get("code")
        }
        
        # Create headers model from the request data
        headers = HeadersModel(
            cookie=submission_data.get("cookie"),
            csrfToken=submission_data.get("csrfToken"),
            userAgent=submission_data.get("userAgent"),
            origin=submission_data.get("origin"),
            referer=submission_data.get("referer")
        )
        
        # Submit the solution
        submission_result = await SubmissionService.submit_solution(
            title_slug, 
            solution_data, 
            headers
        )
        
        return submission_result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to submit solution: {str(e)}")