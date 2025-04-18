import os
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from fastapi import HTTPException

# Load environment variables
load_dotenv()

# Constants
LEETCODE_GRAPHQL = os.getenv('LEETCODE_GRAPHQL', 'https://leetcode.com/graphql')
LEETCODE_BASE_URL = 'https://leetcode.com'


class LeetCodeService:
    """Service for interacting with LeetCode API"""

    @staticmethod
    async def fetch_daily_challenge() -> Dict[str, Any]:
        """Fetch the daily challenge from LeetCode"""
        query = {
            "query": """
                query questionOfToday {
                  activeDailyCodingChallengeQuestion {
                    date
                    link
                    question {
                      questionId
                      questionFrontendId
                      title
                      titleSlug
                      difficulty
                      isPaidOnly
                      content
                      topicTags {
                        name
                        slug
                      }
                      hints
                      solution {
                        id
                        canSeeDetail
                        paidOnly
                        hasVideoSolution
                        paidOnlyVideo
                      }
                      exampleTestcases
                      likes
                      dislikes
                      similarQuestions
                    }
                  }
                }
            """
        }

        try:
            response = requests.post(
                LEETCODE_GRAPHQL,
                json=query,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            data = response.json()

            daily_challenge = data.get('data', {}).get('activeDailyCodingChallengeQuestion')
            if not daily_challenge:
                raise HTTPException(status_code=404, detail="No daily challenge found")

            question = daily_challenge.get('question')
            
            return {
                "questionLink": 'https://leetcode.com' + daily_challenge.get('link'),
                "date": daily_challenge.get('date'),
                "questionId": question.get('questionId'),
                "questionFrontendId": question.get('questionFrontendId'),
                "questionTitle": question.get('title'),
                "titleSlug": question.get('titleSlug'),
                "difficulty": question.get('difficulty'),
                "isPaidOnly": question.get('isPaidOnly'),
                "question": question.get('content'),
                "exampleTestcases": question.get('exampleTestcases'),
                "topicTags": question.get('topicTags'),
                "hints": question.get('hints', []),
                "solution": question.get('solution'),
                "likes": question.get('likes'),
                "dislikes": question.get('dislikes'),
                "similarQuestions": question.get('similarQuestions'),
            }
        except requests.RequestException as e:
            print(f"Error in fetch_daily_challenge service: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to fetch daily challenge: {str(e)}")
        except Exception as e:
            print(f"Unexpected error in fetch_daily_challenge service: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")