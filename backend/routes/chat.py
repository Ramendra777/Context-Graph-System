from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Any
from backend.llm.guardrails import is_query_relevant
from backend.llm.service import generate_sql, synthesize_answer
from backend.llm.executor import execute_read_only_sql
import json

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    history: list[dict] = []

class ChatResponse(BaseModel):
    answer: str
    sql_query: Optional[str] = None
    data: Optional[list[Any]] = None

@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    # Phase 1: Guardrails
    if not is_query_relevant(question):
        return ChatResponse(
            answer="I'm sorry, I can only answer questions related to the Order-to-Cash process (such as orders, deliveries, billing, and payments).",
            sql_query=None,
            data=[]
        )
        
    # Phase 2: Translate to SQL
    try:
        sql = generate_sql(question, history=request.history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate SQL: {str(e)}")
        
    # Phase 3: Execute in DB
    try:
        results = execute_read_only_sql(sql)
    except ValueError as ve:
        return ChatResponse(
            answer=f"I couldn't run the generated query safely: {str(ve)}",
            sql_query=sql,
            data=[]
        )
    except Exception as e:
        return ChatResponse(
            answer="An error occurred while trying to run the query against the database.",
            sql_query=sql,
            data=[]
        )
        
    # Phase 4: Synthesize Final Answer
    try:
        results_str = json.dumps(results, default=str)
        answer = synthesize_answer(question, results_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to synthesize human-readable answer.")
        
    return ChatResponse(
        answer=answer,
        sql_query=sql,
        data=results
    )
