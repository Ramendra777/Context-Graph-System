import re
from sqlalchemy import text
from backend.database import SessionLocal

def execute_read_only_sql(sql_query: str) -> list[dict]:
    """
    Safely executes a read-only SQL query against the SQLite database.
    Returns the results as a list of dictionaries mapping column name to value.
    """
    cleaned_sql = sql_query.strip()
    
    # 1. Basic safety guardrails: ONLY allow SELECT queries
    upper_sql = cleaned_sql.upper()
    if not upper_sql.startswith("SELECT"):
        raise ValueError("Only SELECT queries are allowed.")
    
    # 2. Prevent syntax that modifies schema or data
    forbidden_keywords = [
        "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", 
        "CREATE", "GRANT", "REVOKE", "TRUNCATE", "REPLACE"
    ]
    for kw in forbidden_keywords:
        # Match explicit whole words inside the query logic
        if re.search(r'\b' + kw + r'\b', upper_sql):
            raise ValueError(f"Forbidden SQL keyword detected: {kw}")

    db = SessionLocal()
    try:
        # Execute the raw SQL cleanly
        result_proxy = db.execute(text(cleaned_sql))
        keys = result_proxy.keys()
        
        results = []
        for row in result_proxy:
            results.append(dict(zip(keys, row)))
            
        return results
    except Exception as e:
        raise ValueError(f"SQL Execution Error: {str(e)}")
    finally:
        db.close()
