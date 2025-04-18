import os
import requests
from typing import Dict, Any
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
LEETCODE_GRAPHQL = os.getenv('LEETCODE_GRAPHQL', 'https://leetcode.com/graphql')


class QuestionsService:
    """Service for fetching LeetCode questions"""

    @staticmethod
    def get_mock_questions(skip: int = 0, limit: int = 100) -> Dict[str, Any]:
        """Generate mock questions data for testing"""
        # Create a list of mock questions
        mock_questions = [
            {
                "questionId": "1",
                "questionFrontendId": "1",
                "title": "Two Sum",
                "titleSlug": "two-sum",
                "difficulty": "EASY",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "Array", "slug": "array"},
                    {"name": "Hash Table", "slug": "hash-table"}
                ],
                "acRate": 0.4781
            },
            {
                "questionId": "2",
                "questionFrontendId": "2",
                "title": "Add Two Numbers",
                "titleSlug": "add-two-numbers",
                "difficulty": "MEDIUM",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "Linked List", "slug": "linked-list"},
                    {"name": "Math", "slug": "math"},
                    {"name": "Recursion", "slug": "recursion"}
                ],
                "acRate": 0.3581
            },
            {
                "questionId": "3",
                "questionFrontendId": "3",
                "title": "Longest Substring Without Repeating Characters",
                "titleSlug": "longest-substring-without-repeating-characters",
                "difficulty": "MEDIUM",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "Hash Table", "slug": "hash-table"},
                    {"name": "String", "slug": "string"},
                    {"name": "Sliding Window", "slug": "sliding-window"}
                ],
                "acRate": 0.3281
            },
            {
                "questionId": "4",
                "questionFrontendId": "4",
                "title": "Median of Two Sorted Arrays",
                "titleSlug": "median-of-two-sorted-arrays",
                "difficulty": "HARD",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "Array", "slug": "array"},
                    {"name": "Binary Search", "slug": "binary-search"},
                    {"name": "Divide and Conquer", "slug": "divide-and-conquer"}
                ],
                "acRate": 0.3181
            },
            {
                "questionId": "5",
                "questionFrontendId": "5",
                "title": "Longest Palindromic Substring",
                "titleSlug": "longest-palindromic-substring",
                "difficulty": "MEDIUM",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "String", "slug": "string"},
                    {"name": "Dynamic Programming", "slug": "dynamic-programming"}
                ],
                "acRate": 0.3081
            },
            {
                "questionId": "6",
                "questionFrontendId": "6",
                "title": "Zigzag Conversion",
                "titleSlug": "zigzag-conversion",
                "difficulty": "MEDIUM",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "String", "slug": "string"}
                ],
                "acRate": 0.3881
            },
            {
                "questionId": "7",
                "questionFrontendId": "7",
                "title": "Reverse Integer",
                "titleSlug": "reverse-integer",
                "difficulty": "MEDIUM",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "Math", "slug": "math"}
                ],
                "acRate": 0.2681
            },
            {
                "questionId": "8",
                "questionFrontendId": "8",
                "title": "String to Integer (atoi)",
                "titleSlug": "string-to-integer-atoi",
                "difficulty": "MEDIUM",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "String", "slug": "string"}
                ],
                "acRate": 0.1581
            },
            {
                "questionId": "9",
                "questionFrontendId": "9",
                "title": "Palindrome Number",
                "titleSlug": "palindrome-number",
                "difficulty": "EASY",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "Math", "slug": "math"}
                ],
                "acRate": 0.5081
            },
            {
                "questionId": "10",
                "questionFrontendId": "10",
                "title": "Regular Expression Matching",
                "titleSlug": "regular-expression-matching",
                "difficulty": "HARD",
                "status": None,
                "isPaidOnly": False,
                "topicTags": [
                    {"name": "String", "slug": "string"},
                    {"name": "Dynamic Programming", "slug": "dynamic-programming"},
                    {"name": "Recursion", "slug": "recursion"}
                ],
                "acRate": 0.2781
            }
        ]

        # Generate more mock questions if needed
        total_questions = 100

        # Apply pagination
        start_idx = min(skip, len(mock_questions))
        end_idx = min(skip + limit, len(mock_questions))
        paginated_questions = mock_questions[start_idx:end_idx]

        return {
            "questions": paginated_questions,
            "total": total_questions,
            "page": skip // limit + 1 if limit > 0 else 1,
            "pageSize": limit
        }

    @staticmethod
    async def get_all_questions(category: str = 'all-code-essentials',
                               skip: int = 0,
                               limit: int = 100,
                               filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """Fetch all LeetCode questions with pagination and filtering"""
        # Default filters if none provided
        if filters is None:
            filters = {}

        # Category is passed directly to the API now

        # Build difficulty filter if provided
        difficulty_filter = ""
        if filters.get("difficulty"):
            difficulty_filter = f"difficulty: {filters['difficulty']}"

        # Build search filter if provided
        search_filter = ""
        if filters.get("search"):
            search_filter = f"searchKeywords: \"{filters['search']}\""

        # Combine filters
        filter_conditions = [f for f in [difficulty_filter, search_filter] if f]
        filter_string = ", ".join(filter_conditions)
        if filter_string:
            filter_string = f"filters: {{{filter_string}}}"

        query = {
            "operationName": "problemsetQuestionListV2",
            "query": f"""
                query problemsetQuestionListV2($filters: QuestionFilterInput, $limit: Int, $searchKeyword: String, $skip: Int, $sortBy: QuestionSortByInput, $categorySlug: String) {{
                  problemsetQuestionListV2(
                    filters: $filters
                    limit: $limit
                    searchKeyword: $searchKeyword
                    skip: $skip
                    sortBy: $sortBy
                    categorySlug: $categorySlug
                  ) {{
                    questions {{
                      id
                      titleSlug
                      title
                      questionFrontendId
                      paidOnly
                      difficulty
                      topicTags {{
                        name
                        slug
                      }}
                      status
                      acRate
                    }}
                    totalLength
                    finishedLength
                    hasMore
                  }}
                }}
            """,
            "variables": {
                "categorySlug": category,
                "skip": skip,
                "limit": limit,
                "searchKeyword": filters.get("search", ""),
                "filters": {
                    "filterCombineType": "ALL",
                    "statusFilter": {"questionStatuses": [], "operator": "IS"},
                    "difficultyFilter": {
                        "difficulties": [filters.get("difficulty", "")] if filters.get("difficulty") else [],
                        "operator": "IS"
                    }
                },
                "sortBy": {"sortField": "CUSTOM", "sortOrder": "ASCENDING"}
            }
        }

        try:
            print(f"Fetching questions with category: {category}, skip: {skip}, limit: {limit}, filters: {filters}")

            response = requests.post(
                LEETCODE_GRAPHQL,
                json=query,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            data = response.json()

            problemset = data.get('data', {}).get('problemsetQuestionListV2', {})

            # Check if we got a valid response
            if not problemset or not problemset.get('questions'):
                print("No questions found in API response, using mock data")
                # Use mock data instead of failing
                return QuestionsService.get_mock_questions(skip, limit)

            total = problemset.get('totalLength', 0)
            questions = problemset.get('questions', [])

            # Convert isPaidOnly to isPaidOnly for consistency
            for question in questions:
                if 'paidOnly' in question:
                    question['isPaidOnly'] = question.pop('paidOnly')

            print(f"Successfully fetched {len(questions)} questions out of {total} total")

            # Map the response to match our expected format
            formatted_questions = []
            for q in questions:
                formatted_question = {
                    "questionId": str(q.get("id")),  # Convert to string to match model
                    "questionFrontendId": q.get("questionFrontendId"),
                    "title": q.get("title"),
                    "titleSlug": q.get("titleSlug"),
                    "difficulty": q.get("difficulty"),
                    "status": q.get("status"),
                    "isPaidOnly": q.get("isPaidOnly"),
                    "topicTags": q.get("topicTags", []),
                    "acRate": q.get("acRate")
                }
                formatted_questions.append(formatted_question)

            return {
                "questions": formatted_questions,
                "total": total,
                "page": skip // limit + 1 if limit > 0 else 1,
                "pageSize": limit
            }
        except requests.RequestException as e:
            print(f"Error in get_all_questions service: {str(e)}")

            # Check for specific error types
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status: {e.response.status_code}")
                print(f"Response data: {e.response.text}")

            raise HTTPException(status_code=500, detail=f"Failed to fetch questions: {str(e)}")
        except Exception as e:
            print(f"Unexpected error in get_all_questions service: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")