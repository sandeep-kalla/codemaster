from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime


class TopicTag(BaseModel):
    """Model for LeetCode problem topic tags"""
    name: str
    slug: str


class CodeSnippet(BaseModel):
    """Model for code snippets provided by LeetCode"""
    lang: str
    langSlug: str
    code: str


class Solution(BaseModel):
    """Model for LeetCode problem solution"""
    id: str
    canSeeDetail: bool
    paidOnly: bool
    hasVideoSolution: Optional[bool] = None
    paidOnlyVideo: Optional[bool] = None


class ProblemDetail(BaseModel):
    """Model for LeetCode problem details"""
    questionId: str
    questionFrontendId: str
    questionTitle: str
    titleSlug: str
    difficulty: str
    isPaidOnly: bool
    question: str  # HTML content
    exampleTestcases: str
    topicTags: List[TopicTag]
    hints: Optional[List[str]] = Field(default_factory=list)
    solution: Optional[Solution] = None
    likes: Optional[int] = None
    dislikes: Optional[int] = None
    similarQuestions: Optional[str] = None
    questionLink: str
    sampleTestCase: Optional[str] = None
    metaData: Optional[str] = None
    codeSnippets: Optional[List[CodeSnippet]] = None
    enableRunCode: Optional[bool] = None


class DailyChallenge(BaseModel):
    """Model for LeetCode daily challenge"""
    questionLink: str
    date: str
    questionId: str
    questionFrontendId: str
    questionTitle: str
    titleSlug: str
    difficulty: str
    isPaidOnly: bool
    question: str  # HTML content
    exampleTestcases: str
    topicTags: List[TopicTag]
    hints: List[str]
    solution: Optional[Solution] = None
    likes: Optional[int] = None
    dislikes: Optional[int] = None
    similarQuestions: Optional[str] = None


class SubmissionRequest(BaseModel):
    """Model for submission request"""
    lang: str = "cpp"  # Default to C++
    question_id: str
    typed_code: str


class SubmissionResponse(BaseModel):
    """Model for submission response"""
    submission_id: str
    status_code: int
    lang: str
    question_id: str
    status_msg: Optional[str] = None
    error: Optional[str] = None


class SubmissionStatus(BaseModel):
    """Model for submission status"""
    state: str
    status_code: Optional[int] = None
    lang: Optional[str] = None
    runtime: Optional[str] = None
    memory: Optional[Union[str, int, float]] = None  # Can be string or number
    total_correct: Optional[int] = None
    total_testcases: Optional[int] = None
    submission_id: str
    status_runtime: Optional[str] = None
    status_memory: Optional[str] = None
    status_msg: Optional[str] = None
    compare_result: Optional[str] = None
    code_output: Optional[str] = None
    std_output: Optional[str] = None
    last_testcase: Optional[str] = None
    expected_output: Optional[str] = None
    task_finish_time: Optional[int] = None
    question_id: Optional[str] = None
    run_success: Optional[bool] = None
    pretty_lang: Optional[str] = None
    runtime_percentile: Optional[float] = None
    memory_percentile: Optional[float] = None
    finished: Optional[bool] = None
    elapsed_time: Optional[int] = None
    display_runtime: Optional[str] = None


class AuthCheckResponse(BaseModel):
    """Model for authentication check response"""
    isSignedIn: bool
    username: Optional[str] = None
    userId: Optional[str] = None
    error: Optional[str] = None


class QuestionListItem(BaseModel):
    """Model for question list item"""
    questionId: str
    questionFrontendId: str
    title: str
    titleSlug: str
    difficulty: str
    status: Optional[str] = None
    isPaidOnly: bool
    topicTags: List[TopicTag]
    acRate: Optional[float] = None


class QuestionListResponse(BaseModel):
    """Model for question list response"""
    questions: List[QuestionListItem]
    total: int
    page: int
    pageSize: int


class HeadersModel(BaseModel):
    """Model for headers"""
    cookie: Optional[str] = None
    csrfToken: Optional[str] = None
    userAgent: Optional[str] = None
    origin: Optional[str] = None
    referer: Optional[str] = None