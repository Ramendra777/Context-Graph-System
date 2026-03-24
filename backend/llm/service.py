import os
import google.generativeai as genai
from dotenv import load_dotenv
from backend.llm.prompts import SQL_SYSTEM_PROMPT, SYNTHESIS_SYSTEM_PROMPT

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use the highly efficient flash model
model = genai.GenerativeModel('gemini-2.5-flash')

def generate_sql(question: str, history: list = None) -> str:
    """Generates a SQL query from natural language."""
    history_context = ""
    if history:
        history_context = "Conversation History:\n"
        for msg in history[-10:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_context += f"{role.capitalize()}: {content}\n"
        history_context += "\n"
        
    prompt = f"{SQL_SYSTEM_PROMPT}\n\n{history_context}User Question: {question}\nSQL Query:"
    response = model.generate_content(prompt)
    
    sql = response.text.strip()
    # Failsafe parsing to strip markdown blocks if the LLM includes them
    if sql.startswith("```sql"):
        sql = sql[6:]
    if sql.startswith("```"):
        sql = sql[3:]
    if sql.endswith("```"):
        sql = sql[:-3]
        
    return sql.strip()

def synthesize_answer(question: str, query_results: str) -> str:
    """Synthesizes a natural language answer based on JSON query results."""
    prompt = f"{SYNTHESIS_SYSTEM_PROMPT}\n\nUser Question: {question}\nSQL JSON Results:\n{query_results}\n\nAnswer:"
    response = model.generate_content(prompt)
    return response.text.strip()
