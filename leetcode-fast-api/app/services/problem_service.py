import os
import requests
from typing import Dict, Any
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
LEETCODE_GRAPHQL = os.getenv('LEETCODE_GRAPHQL', 'https://leetcode.com/graphql')
LEETCODE_BASE_URL = 'https://leetcode.com'


class ProblemService:
    """Service for interacting with LeetCode problems API"""

    @staticmethod
    def get_mock_problem(title_slug: str) -> Dict[str, Any]:
        """Generate mock problem data for testing"""
        # Map of title slugs to mock problems
        mock_problems = {
            "two-sum": {
                "questionId": "1",
                "questionFrontendId": "1",
                "questionTitle": "Two Sum",
                "titleSlug": "two-sum",
                "difficulty": "EASY",
                "isPaidOnly": False,
                "question": "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>\n\n<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>\n\n<p>You can return the answer in any order.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,7,11,15], target = 9\n<strong>Output:</strong> [0,1]\n<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,4], target = 6\n<strong>Output:</strong> [1,2]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,3], target = 6\n<strong>Output:</strong> [0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>\n\t<li><strong>Only one valid answer exists.</strong></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow-up:&nbsp;</strong>Can you come up with an algorithm that is less than <code>O(n<sup>2</sup>)</code><font face=\"monospace\">&nbsp;</font>time complexity?",
                "exampleTestcases": "[2,7,11,15]\n9\n[3,2,4]\n6\n[3,3]\n6",
                "sampleTestCase": "[2,7,11,15]\n9",
                "metaData": "{\"name\":\"twoSum\",\"params\":[{\"name\":\"nums\",\"type\":\"integer[]\"},\"target\"],\"return\":{\"type\":\"integer[]\",\"size\":2}}",
                "codeSnippets": [
                    {
                        "lang": "C++",
                        "langSlug": "cpp",
                        "code": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
                    },
                    {
                        "lang": "Java",
                        "langSlug": "java",
                        "code": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"
                    },
                    {
                        "lang": "Python",
                        "langSlug": "python",
                        "code": "class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n"
                    },
                    {
                        "lang": "Python3",
                        "langSlug": "python3",
                        "code": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        \n"
                    },
                    {
                        "lang": "JavaScript",
                        "langSlug": "javascript",
                        "code": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};"
                    }
                ],
                "topicTags": [
                    {"name": "Array", "slug": "array"},
                    {"name": "Hash Table", "slug": "hash-table"}
                ],
                "hints": ["A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.", "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?", "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?"],
                "likes": 42000,
                "dislikes": 1337,
                "questionLink": "https://leetcode.com/problems/two-sum/",
                "enableRunCode": True
            },
            "add-two-numbers": {
                "questionId": "2",
                "questionFrontendId": "2",
                "questionTitle": "Add Two Numbers",
                "titleSlug": "add-two-numbers",
                "difficulty": "MEDIUM",
                "isPaidOnly": False,
                "question": "<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum&nbsp;as a linked list.</p>\n\n<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg\" style=\"width: 483px; height: 342px;\" />\n<pre>\n<strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]\n<strong>Output:</strong> [7,0,8]\n<strong>Explanation:</strong> 342 + 465 = 807.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> l1 = [0], l2 = [0]\n<strong>Output:</strong> [0]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\n<strong>Output:</strong> [8,9,9,9,0,0,0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 9</code></li>\n\t<li>It is guaranteed that the list represents a number that does not have leading zeros.</li>\n</ul>\n",
                "exampleTestcases": "[2,4,3]\n[5,6,4]\n[0]\n[0]\n[9,9,9,9,9,9,9]\n[9,9,9,9]",
                "sampleTestCase": "[2,4,3]\n[5,6,4]",
                "metaData": "{\"name\":\"addTwoNumbers\",\"params\":[{\"name\":\"l1\",\"type\":\"ListNode\"},{\"name\":\"l2\",\"type\":\"ListNode\"}],\"return\":{\"type\":\"ListNode\"}}",
                "codeSnippets": [
                    {
                        "lang": "C++",
                        "langSlug": "cpp",
                        "code": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        \n    }\n};"
                    },
                    {
                        "lang": "Java",
                        "langSlug": "java",
                        "code": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}"
                    },
                    {
                        "lang": "Python",
                        "langSlug": "python",
                        "code": "# Definition for singly-linked list.\n# class ListNode(object):\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution(object):\n    def addTwoNumbers(self, l1, l2):\n        \"\"\"\n        :type l1: ListNode\n        :type l2: ListNode\n        :rtype: ListNode\n        \"\"\"\n        \n"
                    }
                ],
                "topicTags": [
                    {"name": "Linked List", "slug": "linked-list"},
                    {"name": "Math", "slug": "math"},
                    {"name": "Recursion", "slug": "recursion"}
                ],
                "hints": [],
                "likes": 21000,
                "dislikes": 4200,
                "questionLink": "https://leetcode.com/problems/add-two-numbers/",
                "enableRunCode": True
            }
        }

        # Return the mock problem if it exists, otherwise return a default mock problem
        return mock_problems.get(title_slug, {
            "questionId": "404",
            "questionFrontendId": "404",
            "questionTitle": "Problem Not Found",
            "titleSlug": title_slug,
            "difficulty": "MEDIUM",
            "isPaidOnly": False,
            "question": "<p>This problem is not available or could not be found.</p>",
            "exampleTestcases": "",
            "sampleTestCase": "",
            "metaData": "{}",
            "codeSnippets": [
                {
                    "lang": "C++",
                    "langSlug": "cpp",
                    "code": "// Problem not found\n"
                },
                {
                    "lang": "Python3",
                    "langSlug": "python3",
                    "code": "# Problem not found\n"
                }
            ],
            "topicTags": [],
            "hints": [],
            "likes": 0,
            "dislikes": 0,
            "questionLink": f"https://leetcode.com/problems/{title_slug}/",
            "enableRunCode": False
        })

    @staticmethod
    async def fetch_problem_by_title_slug(title_slug: str) -> Dict[str, Any]:
        """Fetch a problem by its title slug"""
        query = {
            "query": """
                query getQuestionDetail($titleSlug: String!) {
                  question(titleSlug: $titleSlug) {
                    questionId
                    questionFrontendId
                    title
                    titleSlug
                    content
                    difficulty
                    topicTags {
                      name
                      slug
                    }
                    codeSnippets {
                      lang
                      langSlug
                      code
                    }
                    hints
                    exampleTestcases
                    sampleTestCase
                    metaData
                    enableRunCode
                    isPaidOnly
                    likes
                    dislikes
                  }
                }
            """,
            "variables": {
                "titleSlug": title_slug
            }
        }

        try:
            print(f"Fetching problem with title slug: {title_slug}")

            response = requests.post(
                LEETCODE_GRAPHQL,
                json=query,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            data = response.json()

            problem = data.get('data', {}).get('question')
            if not problem:
                raise HTTPException(status_code=404, detail="Problem not found")

            print(f"Successfully fetched problem data")

            # Format the response similar to daily challenge
            return {
                "questionId": problem.get('questionId'),
                "questionFrontendId": problem.get('questionFrontendId'),
                "questionTitle": problem.get('title'),
                "titleSlug": problem.get('titleSlug'),
                "difficulty": problem.get('difficulty'),
                "isPaidOnly": problem.get('isPaidOnly'),
                "question": problem.get('content'),
                "exampleTestcases": problem.get('exampleTestcases'),
                "sampleTestCase": problem.get('sampleTestCase'),
                "metaData": problem.get('metaData'),
                "codeSnippets": problem.get('codeSnippets'),
                "topicTags": problem.get('topicTags'),
                "hints": problem.get('hints', []),
                "likes": problem.get('likes'),
                "dislikes": problem.get('dislikes'),
                "questionLink": f"https://leetcode.com/problems/{title_slug}/",
                "enableRunCode": problem.get('enableRunCode')
            }
        except requests.RequestException as e:
            print(f"Network error in fetch_problem_by_title_slug service")

            # Check for specific error types without logging sensitive data
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status: {e.response.status_code}")
                # Don't log response data as it might contain sensitive information

            print(f"Using mock data for problem: {title_slug}")
            return ProblemService.get_mock_problem(title_slug)

        except Exception as e:
            print(f"Unexpected error in fetch_problem_by_title_slug service")
            print(f"Using mock data for problem: {title_slug}")
            return ProblemService.get_mock_problem(title_slug)