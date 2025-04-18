from fastapi import APIRouter, Depends, HTTPException, Request, Header, Body
from typing import Dict, Any, Optional

from app.services.submission_service import SubmissionService
from app.models.leetcode_models import SubmissionStatus, HeadersModel

router = APIRouter()

@router.get("/submissions/{submission_id}/check", response_model=SubmissionStatus, summary="Check submission status")
async def check_submission(
    submission_id: str,
    request: Request,
    user_agent: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
    csrf_token: Optional[str] = Header(None, alias="x-csrftoken"),
    origin: Optional[str] = Header(None),
    referer: Optional[str] = Header(None)
):
    print(f"Checking submission result for {submission_id}")
    print(f"Headers: UA: {user_agent is not None}, Cookie: {cookie is not None}, CSRF: {csrf_token is not None}")

    # If cookie is not provided, use the one from .env
    if not cookie:
        import os
        try:
            cookie = os.getenv('LEETCODE_COOKIE', '')
            print(f"Using cookie from .env file: {cookie[:20]}...")
        except Exception as e:
            print(f"Error loading cookie from .env: {str(e)}")
    """Check the status of a LeetCode submission"""
    try:
        # Create headers model from request headers
        headers = HeadersModel(
            cookie=cookie,
            csrfToken=csrf_token,
            userAgent=user_agent,
            origin=origin,
            referer=referer
        )

        # Check the submission status - we'll use the credentials from .env in the service
        submission_status = await SubmissionService.check_submission(submission_id, headers)
        return submission_status
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to check submission: {str(e)}")

@router.post("/submissions/check-as-proxy", response_model=SubmissionStatus, summary="Check submission status as proxy")
async def check_submission_as_proxy(submission_data: Dict[str, Any]):
    """Check the status of a LeetCode submission using proxy headers"""
    try:
        # Extract data from the request
        submission_id = submission_data.get("submissionId")
        if not submission_id:
            raise HTTPException(status_code=400, detail="Submission ID is required")

        # Create headers model from the request data
        headers = HeadersModel(
            cookie=submission_data.get("cookie"),
            csrfToken=submission_data.get("csrfToken"),
            userAgent=submission_data.get("userAgent"),
            origin=submission_data.get("origin"),
            referer=submission_data.get("referer")
        )

        # Check the submission status
        submission_status = await SubmissionService.check_submission(submission_id, headers)
        return submission_status
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to check submission: {str(e)}")

@router.post("/run-code/{question_title_slug}", summary="Run code for a problem")
async def run_code(
    question_title_slug: str,
    request: Request,
    user_agent: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
    csrf_token: Optional[str] = Header(None, alias="x-csrftoken"),
    origin: Optional[str] = Header(None),
    referer: Optional[str] = Header(None),
    submission_data: Dict[str, Any] = Body(...)
):
    print(f"Received run code request for {question_title_slug}")
    print(f"Headers: UA: {user_agent is not None}, Cookie: {cookie is not None}, CSRF: {csrf_token is not None}")
    print(f"Submission data: {submission_data}")

    # If cookie is not provided, use the one from .env
    if not cookie:
        import os
        from dotenv import load_dotenv
        try:
            load_dotenv()
            cookie = os.getenv('LEETCODE_COOKIE', '')
            print(f"Using cookie from .env file: {cookie[:20]}...")
        except Exception as e:
            print(f"Error loading cookie from .env: {str(e)}")
    """Run code for a LeetCode problem without submitting it"""
    try:
        # Create headers model from request headers
        headers = HeadersModel(
            cookie=cookie,
            csrfToken=csrf_token,
            userAgent=user_agent,
            origin=origin,
            referer=referer
        )

        # Run the code - we'll use the credentials from .env in the service
        run_result = await SubmissionService.run_code(question_title_slug, submission_data, headers)
        return run_result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to run code: {str(e)}")

@router.post("/submit/{question_title_slug}", summary="Submit code for a problem")
async def submit_solution(
    question_title_slug: str,
    request: Request,
    user_agent: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
    csrf_token: Optional[str] = Header(None, alias="x-csrftoken"),
    origin: Optional[str] = Header(None),
    referer: Optional[str] = Header(None),
    submission_data: Dict[str, Any] = Body(...)
):
    print(f"Received submit request for {question_title_slug}")
    print(f"Headers: UA: {user_agent is not None}, Cookie: {cookie is not None}, CSRF: {csrf_token is not None}")
    print(f"Submission data: {submission_data}")

    # If cookie is not provided, use the one from .env
    if not cookie:
        import os
        try:
            cookie = os.getenv('LEETCODE_COOKIE', '')
            print(f"Using cookie from .env file: {cookie[:20]}...")
        except Exception as e:
            print(f"Error loading cookie from .env: {str(e)}")
    """Submit code for a LeetCode problem"""
    try:
        # Create headers model from request headers
        headers = HeadersModel(
            cookie=cookie,
            csrfToken=csrf_token,
            userAgent=user_agent,
            origin=origin,
            referer=referer
        )

        # Submit the code - we'll use the credentials from .env in the service
        submit_result = await SubmissionService.submit_solution(question_title_slug, submission_data, headers)
        return submit_result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to submit code: {str(e)}")

@router.get("/run-code/check/{interpret_id}", summary="Check the result of a code run")
async def check_run_result(
    interpret_id: str,
    request: Request,
    user_agent: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
    csrf_token: Optional[str] = Header(None, alias="x-csrftoken"),
    origin: Optional[str] = Header(None),
    referer: Optional[str] = Header(None)
):
    print(f"Checking run result for {interpret_id}")
    print(f"Headers: UA: {user_agent is not None}, Cookie: {cookie is not None}, CSRF: {csrf_token is not None}")

    # If cookie is not provided, use the one from .env
    if not cookie:
        import os
        try:
            cookie = os.getenv('LEETCODE_COOKIE', '')
            print(f"Using cookie from .env file: {cookie[:20]}...")
        except Exception as e:
            print(f"Error loading cookie from .env: {str(e)}")
    """Check the result of a code run"""
    try:
        # Create headers model from request headers
        headers = HeadersModel(
            cookie=cookie,
            csrfToken=csrf_token,
            userAgent=user_agent,
            origin=origin,
            referer=referer
        )

        # Check the run result - we'll use the credentials from .env in the service
        run_result = await SubmissionService.check_run_result(interpret_id, headers)
        return run_result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to check run result: {str(e)}")