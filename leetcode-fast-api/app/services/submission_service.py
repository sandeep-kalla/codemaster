import os
import requests
from typing import Dict, Any
from fastapi import HTTPException
from app.models.leetcode_models import HeadersModel

# Try to load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment variables loaded successfully")
except Exception as e:
    print(f"Error loading environment variables: {str(e)}")
    print("Using hardcoded values instead")

# Constants
LEETCODE_BASE_URL = 'https://leetcode.com'

# Default headers from environment variables or hardcoded values
DEFAULT_HEADERS = {
    'Cookie': os.getenv('LEETCODE_COOKIE', 'csrftoken=U7lxmnXMFu59SsRfwpKvAT5BShglywfZWE3WjcdsZWfXAbzdYA2Clcc4Gj5hRxe4; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMTEyNDc4MjMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI2ZGJiNWQ3YTBhNzhmNDQxM2Y2ODBjMTg2YmZkZDRlMzgwMDYxZjU1OWY0YTE0NWY5Njc5OTgyMDQ0YzJmOGUzIiwic2Vzc2lvbl91dWlkIjoiNjE0ZTU3OWIiLCJpZCI6MTEyNDc4MjMsImVtYWlsIjoiZGFyazExNzhyaWRlckBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IlM0TkRFRVAiLCJ1c2VyX3NsdWciOiJTNE5ERUVQIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2RhcmsxMTc4cmlkZXIvYXZhdGFyXzE3MzcxNDIzMzEucG5nIiwicmVmcmVzaGVkX2F0IjoxNzQ0OTA5NzQ5LCJpcCI6IjI0MDk6NDBkMDoxMDJkOjQ5OTY6NTE1OTpjMzkzOjg5OGI6NDAxZiIsImlkZW50aXR5IjoiOTlkMTQ5ODk5YzRmMmYzZDc5ZGYxZjhlNzNmNTM5ZWYiLCJkZXZpY2Vfd2l0aF9pcCI6WyIxNTljYWY4NDZhODJmNTU0MjcyMjAxZTUzZjUxZmQ2NCIsIjI0MDk6NDBkMDoxMDJkOjQ5OTY6NTE1OTpjMzkzOjg5OGI6NDAxZiJdLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.JYVTrDElzIwtyCx9cuDkhWRUIdUipaVPoNbeLZ7l200'),
    'x-csrftoken': os.getenv('LEETCODE_CSRF_TOKEN', 'U7lxmnXMFu59SsRfwpKvAT5BShglywfZWE3WjcdsZWfXAbzdYA2Clcc4Gj5hRxe4'),
    'User-Agent': os.getenv('LEETCODE_USER_AGENT', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'),
    'Origin': os.getenv('LEETCODE_ORIGIN', 'https://leetcode.com'),
    'Referer': os.getenv('LEETCODE_REFERER', 'https://leetcode.com/problems/two-sum/'),
    'Content-Type': 'application/json',
    'Host': 'leetcode.com',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
}

# Log that headers are configured (without revealing sensitive information)
print("Authentication headers configured successfully")


class SubmissionService:
    """Service for handling LeetCode submissions"""

    @staticmethod
    async def submit_solution(question_title_slug: str, submission_data: Dict[str, Any], headers: HeadersModel) -> Dict[str, Any]:
        """Submit a solution to a LeetCode problem"""
        try:
            submission_url = f"{LEETCODE_BASE_URL}/problems/{question_title_slug}/submit/"

            # Format the submission data according to LeetCode's API requirements
            formatted_data = {
                "lang": submission_data.get("lang"),
                "question_id": submission_data.get("question_id"),
                "typed_code": submission_data.get("typed_code")
            }

            print(f"Submission URL: {submission_url}")
            print(f"Formatted submission data: {formatted_data}")
            print(f"Question title slug: {question_title_slug}")

            # Always use the default headers from environment variables
            request_headers = DEFAULT_HEADERS.copy()

            # Update Referer for this specific request
            request_headers['Referer'] = f"{LEETCODE_BASE_URL}/problems/{question_title_slug}/"

            # Make sure we have the CSRF token
            csrf_token = os.getenv('LEETCODE_CSRF_TOKEN')
            if csrf_token:
                request_headers['x-csrftoken'] = csrf_token
                print("CSRF token configured from environment variables")

            # Log only that we're making a request (without sensitive details)
            print(f"Making submission request to LeetCode API for problem: {question_title_slug}")

            # Make submission request with timeout
            response = requests.post(
                submission_url,
                json=formatted_data,
                headers=request_headers,
                timeout=30  # Add timeout to prevent hanging
            )
            response.raise_for_status()
            data = response.json()

            print(f"Submission response status: {response.status_code}")
            print(f"Submission response received successfully")

            # Use safer get() with defaults for all values
            return {
                "submission_id": data.get("submission_id", ""),
                "status_code": response.status_code,
                "lang": formatted_data.get("lang", ""),
                "question_id": formatted_data.get("question_id", ""),
                "status_msg": data.get("status_msg", "")
            }

        except requests.RequestException as e:
            print(f"Network error in submit_solution service")
            status_code = 500
            error_detail = "Failed to submit solution"

            if hasattr(e, 'response') and e.response is not None:
                try:
                    print(f"Response status: {e.response.status_code}")
                    # Don't log headers or response data as they might contain sensitive information

                    error_detail = "Failed to submit solution due to API error"
                    status_code = e.response.status_code
                except Exception as inner_e:
                    print(f"Error accessing response properties")
            else:
                print(f"Connection error occurred")
                error_detail = "Failed to submit solution due to connection error"

            raise HTTPException(status_code=status_code, detail=error_detail)

        except Exception as e:
            print(f"Unexpected error in submit_solution service")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred")

    @staticmethod
    async def run_code(question_title_slug: str, submission_data: Dict[str, Any], headers: HeadersModel) -> Dict[str, Any]:
        """Run code for a LeetCode problem without submitting it"""
        try:
            run_url = f"{LEETCODE_BASE_URL}/problems/{question_title_slug}/interpret_solution/"

            # Format the submission data according to LeetCode's API requirements
            formatted_data = {
                "lang": submission_data.get("lang"),
                "question_id": submission_data.get("question_id"),
                "typed_code": submission_data.get("typed_code"),
                "data_input": submission_data.get("data_input", "")
            }

            # Clean up the data_input format if needed
            if "data_input" in formatted_data and formatted_data["data_input"]:
                # Remove any "Input:" or "Output:" prefixes that might be in the test cases
                data_input = formatted_data["data_input"]
                data_input = data_input.replace("Input: ", "")
                data_input = data_input.replace("Output: ", "")
                data_input = data_input.replace("Explanation: ", "")
                formatted_data["data_input"] = data_input

            print(f"Run code URL: {run_url}")
            print(f"Formatted run data: {formatted_data}")
            print(f"Question title slug: {question_title_slug}")

            # Always use the default headers from environment variables
            request_headers = DEFAULT_HEADERS.copy()

            # Update Referer for this specific request
            request_headers['Referer'] = f"{LEETCODE_BASE_URL}/problems/{question_title_slug}/"

            # Make sure we have the CSRF token
            csrf_token = os.getenv('LEETCODE_CSRF_TOKEN')
            if csrf_token:
                request_headers['x-csrftoken'] = csrf_token
                print("CSRF token configured from environment variables")

            # Log only that we're making a request (without sensitive details)
            print(f"Making run code request to LeetCode API for problem: {question_title_slug}")

            # Make run code request with timeout
            response = requests.post(
                run_url,
                json=formatted_data,
                headers=request_headers,
                timeout=30  # Add timeout to prevent hanging
            )
            response.raise_for_status()
            data = response.json()

            print(f"Run code response status: {response.status_code}")
            print(f"Run code response received successfully")

            # Return the interpret_id and test_case
            return {
                "interpret_id": data.get("interpret_id", ""),
                "test_case": data.get("test_case", ""),
                "status_code": response.status_code
            }

        except requests.RequestException as e:
            print(f"Network error in run_code service")
            status_code = 500
            error_detail = "Failed to run code"

            if hasattr(e, 'response') and e.response is not None:
                try:
                    print(f"Response status: {e.response.status_code}")
                    # Don't log headers or response data as they might contain sensitive information

                    error_detail = "Failed to run code due to API error"
                    status_code = e.response.status_code
                except Exception as inner_e:
                    print(f"Error accessing response properties")
            else:
                print(f"Connection error occurred")
                error_detail = "Failed to run code due to connection error"

            raise HTTPException(status_code=status_code, detail=error_detail)

        except Exception as e:
            print(f"Unexpected error in run_code service")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred")

    @staticmethod
    async def check_run_result(interpret_id: str, headers: HeadersModel) -> Dict[str, Any]:
        """Check the result of a code run"""
        try:
            check_url = f"{LEETCODE_BASE_URL}/submissions/detail/{interpret_id}/check/"

            print(f"Checking run result with ID: {interpret_id}")
            print(f"Check URL: {check_url}")

            # Always use the default headers from environment variables
            request_headers = DEFAULT_HEADERS.copy()

            # Update Referer for this specific request
            request_headers['Referer'] = f"{LEETCODE_BASE_URL}/submissions/detail/{interpret_id}/"

            # Make sure we have the CSRF token
            csrf_token = os.getenv('LEETCODE_CSRF_TOKEN')
            if csrf_token:
                request_headers['x-csrftoken'] = csrf_token
                print("CSRF token configured from environment variables")

            # Log only that we're making a request (without sensitive details)
            print(f"Checking run result with interpret ID: {interpret_id}")

            # Make check request with timeout
            response = requests.get(
                check_url,
                headers=request_headers,
                timeout=30  # Add timeout to prevent hanging
            )
            response.raise_for_status()
            data = response.json()

            print(f"Check run result response status: {response.status_code}")
            print(f"Check run result response received successfully")

            # Add interpret_id to the response data
            result = data.copy() if data else {}
            result["interpret_id"] = interpret_id

            return result

        except requests.RequestException as e:
            print(f"Network error in check_run_result service")
            status_code = 500
            error_detail = "Failed to check run result"

            if hasattr(e, 'response') and e.response is not None:
                try:
                    print(f"Response status: {e.response.status_code}")
                    # Don't log headers or response data as they might contain sensitive information

                    error_detail = "Failed to check run result due to API error"
                    status_code = e.response.status_code
                except Exception:
                    print(f"Error accessing response properties")
            else:
                print(f"Connection error occurred")
                error_detail = "Failed to check run result due to connection error"

            raise HTTPException(status_code=status_code, detail=error_detail)

        except Exception as e:
            print(f"Unexpected error in check_run_result service")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred")

    @staticmethod
    async def check_submission(submission_id: str, headers: HeadersModel) -> Dict[str, Any]:
        """Check the status of a submission"""
        try:
            check_url = f"{LEETCODE_BASE_URL}/submissions/detail/{submission_id}/check/"

            print(f"Checking submission with ID: {submission_id}")
            print(f"Check URL: {check_url}")

            # Always use the default headers from environment variables
            request_headers = DEFAULT_HEADERS.copy()

            # Update Referer for this specific request
            request_headers['Referer'] = f"{LEETCODE_BASE_URL}/submissions/detail/{submission_id}/"

            # Make sure we have the CSRF token
            csrf_token = os.getenv('LEETCODE_CSRF_TOKEN')
            if csrf_token:
                request_headers['x-csrftoken'] = csrf_token
                print("CSRF token configured from environment variables")

            # Log only that we're making a request (without sensitive details)
            print(f"Checking submission status with submission ID: {submission_id}")

            # Make check request with timeout
            response = requests.get(
                check_url,
                headers=request_headers,
                timeout=30  # Add timeout to prevent hanging
            )
            response.raise_for_status()
            data = response.json()

            print(f"Check response status: {response.status_code}")
            print(f"Check response received successfully")

            # Add submission_id to the response data (use a copy to avoid modifying the original)
            result = data.copy() if data else {}
            result["submission_id"] = submission_id

            # Make sure the required fields are present
            if "state" not in result:
                result["state"] = "UNKNOWN"

            # Convert memory to string if it's a number
            if "memory" in result and not isinstance(result["memory"], str):
                try:
                    # Format memory as a string with MB suffix
                    memory_value = float(result["memory"]) / 1000000  # Convert to MB
                    result["memory"] = f"{memory_value:.1f} MB"
                except (ValueError, TypeError):
                    # If conversion fails, keep the original value
                    pass

            return result

        except requests.RequestException as e:
            print(f"Network error in check_submission service")
            status_code = 500
            error_detail = "Failed to check submission"

            if hasattr(e, 'response') and e.response is not None:
                try:
                    print(f"Response status: {e.response.status_code}")
                    # Don't log headers or response data as they might contain sensitive information

                    error_detail = "Failed to check submission due to API error"
                    status_code = e.response.status_code
                except Exception:
                    print(f"Error accessing response properties")
            else:
                print(f"Connection error occurred")
                error_detail = "Failed to check submission due to connection error"

            raise HTTPException(status_code=status_code, detail=error_detail)

        except Exception as e:
            print(f"Unexpected error in check_submission service")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred")