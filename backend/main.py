from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="AKTU Marks API", version="1.0.0", description="Starter API for the AKTU Marks frontend")

# For local development only. Restrict this to your deployed frontend domain in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BRANCHES = [
    {"id": "cse", "name": "Computer Science & Engg."},
    {"id": "cse_aiml", "name": "CSE (AI & Machine Learning)"},
    {"id": "it", "name": "Information Technology"},
    {"id": "ece", "name": "Electronics & Comm. Engg."},
    {"id": "ee", "name": "Electrical Engineering"},
    {"id": "me", "name": "Mechanical Engineering"},
    {"id": "ce", "name": "Civil Engineering"},
]

# Starter sample records. Add/migrate the rest of the frontend's demo curriculum here
# before treating this API as the app's source of truth.
SUBJECTS = [
    {"id": "kcs301", "code": "KCS-301", "name": "Data Structures", "sem": 3,
     "branches": ["cse", "cse_aiml", "it"], "verified": True,
     "units": [
         {"id": 1, "name": "Unit 1: Introduction to Data Structures & Stacks", "topics": "Arrays, Stacks, Queues, Recursion, Evaluation of Expressions"},
         {"id": 2, "name": "Unit 2: Linked Lists & Polynomial Addition", "topics": "Singly, Doubly & Circular Linked Lists, Stack & Queue via Linked List"},
         {"id": 3, "name": "Unit 3: Trees & Binary Search Trees", "topics": "Binary Trees, BST, AVL Trees, B-Trees, Threaded Trees, Traversals"},
         {"id": 4, "name": "Unit 4: Graphs & Shortest Paths", "topics": "DFS, BFS, Dijkstra Algorithm, Minimum Spanning Trees (Kruskal, Prim)"},
         {"id": 5, "name": "Unit 5: Searching, Sorting & Hashing", "topics": "Bubble, Quick, Merge, Heap Sort, Hash functions, Collision resolution"},
     ]},
    {"id": "kcs302", "code": "KCS-302", "name": "Computer System Architecture (COA)", "sem": 3,
     "branches": ["cse", "cse_aiml", "it"], "verified": True, "units": []},
    {"id": "kcs303", "code": "KCS-303", "name": "Discrete Structures & Theory of Logic", "sem": 3,
     "branches": ["cse", "cse_aiml", "it"], "verified": True, "units": []},
]

# Temporary in-memory demo stores; data resets when the server restarts.
BOOKMARKS: dict[str, list[str]] = {}
NOTES: dict[str, dict[str, str]] = {}
ATTEMPTS: dict[str, list[dict[str, Any]]] = {}

class NotePayload(BaseModel):
    user_id: str = Field(min_length=1)
    question_id: str = Field(min_length=1)
    text: str = ""

class BookmarkPayload(BaseModel):
    user_id: str = Field(min_length=1)
    question_id: str = Field(min_length=1)

class AttemptPayload(BaseModel):
    user_id: str = Field(min_length=1)
    test_id: str = Field(min_length=1)
    score: float = Field(ge=0)
    max_score: float = Field(gt=0)

@app.get("/")
def root():
    return {"message": "AKTU Marks API is running", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/branches")
def get_branches():
    return BRANCHES

@app.get("/api/subjects")
def get_subjects(semester: int | None = None, branch: str | None = None):
    result = SUBJECTS
    if semester is not None:
        result = [s for s in result if s["sem"] == semester]
    if branch:
        result = [s for s in result if branch in s["branches"] or "all" in s["branches"]]
    return result

@app.get("/api/subjects/{subject_id}")
def get_subject(subject_id: str):
    for subject in SUBJECTS:
        if subject["id"] == subject_id:
            return subject
    raise HTTPException(status_code=404, detail="Subject not found")

@app.get("/api/users/{user_id}/bookmarks")
def get_bookmarks(user_id: str):
    return {"user_id": user_id, "question_ids": BOOKMARKS.get(user_id, [])}

@app.post("/api/bookmarks")
def toggle_bookmark(payload: BookmarkPayload):
    saved = BOOKMARKS.setdefault(payload.user_id, [])
    if payload.question_id in saved:
        saved.remove(payload.question_id)
        is_bookmarked = False
    else:
        saved.append(payload.question_id)
        is_bookmarked = True
    return {"question_id": payload.question_id, "bookmarked": is_bookmarked, "question_ids": saved}

@app.get("/api/users/{user_id}/notes")
def get_notes(user_id: str):
    return NOTES.get(user_id, {})

@app.put("/api/notes")
def save_note(payload: NotePayload):
    NOTES.setdefault(payload.user_id, {})[payload.question_id] = payload.text
    return {"saved": True, "question_id": payload.question_id}

@app.get("/api/users/{user_id}/attempts")
def get_attempts(user_id: str):
    return ATTEMPTS.get(user_id, [])

@app.post("/api/attempts")
def save_attempt(payload: AttemptPayload):
    attempt = {
        "test_id": payload.test_id,
        "score": payload.score,
        "max_score": payload.max_score,
        "accuracy": round(payload.score / payload.max_score * 100, 2),
    }
    ATTEMPTS.setdefault(payload.user_id, []).append(attempt)
    return attempt
