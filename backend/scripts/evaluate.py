"""
Evaluation Script for the Order-to-Cash Graph System.
Runs the 3 key example queries from the project requirements through the Chat API
and prints the LLM-generated SQL + natural language answers.
"""
import json
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

EXAMPLE_QUERIES = [
    "Which customers are associated with the highest number of billing documents?",
    "Trace the full order-to-cash flow for billing document 90504259. Show the related sales order, delivery, and any payments.",
    "Identify all broken flows: which deliveries were never billed, and which billing documents were never paid?",
]

def run_evaluation():
    print("=" * 70)
    print("  ORDER-TO-CASH GRAPH SYSTEM — EVALUATION REPORT")
    print("=" * 70)
    
    # 1. Graph Stats
    print("\n📊 GRAPH STATISTICS")
    print("-" * 40)
    stats = client.get("/api/graph/stats").json()
    print(f"  Total Nodes: {stats['total_nodes']}")
    print(f"  Total Edges: {stats['total_edges']}")
    print(f"  Node Types: {json.dumps(stats['node_counts_by_type'], indent=4)}")
    print(f"  Edge Types: {json.dumps(stats['edge_counts_by_type'], indent=4)}")
    
    bf = stats["broken_flows"]
    print(f"\n  🔴 Broken Flows Detected:")
    print(f"     Delivered but NOT Billed: {bf['delivered_not_billed']['count']} (e.g. {bf['delivered_not_billed']['ids'][:3]})")
    print(f"     Billed but NOT Paid:      {bf['billed_not_paid']['count']} (e.g. {bf['billed_not_paid']['ids'][:3]})")
    print(f"     Orders NOT Delivered:     {bf['orders_not_delivered']['count']} (e.g. {bf['orders_not_delivered']['ids'][:3]})")
    
    # 2. Example Chat Queries
    print("\n\n💬 EXAMPLE QUERY EVALUATION")
    print("=" * 70)
    
    history = []
    for i, question in enumerate(EXAMPLE_QUERIES, 1):
        print(f"\n--- Query {i} ---")
        print(f"❓ Question: {question}")
        
        response = client.post("/api/chat/", json={
            "question": question,
            "history": history
        })
        
        data = response.json()
        print(f"🔧 Generated SQL: {data.get('sql_query', 'N/A')}")
        print(f"✅ Answer: {data['answer']}")
        
        # Build up conversation history
        history.append({"role": "user", "content": question})
        history.append({"role": "assistant", "content": data["answer"]})
    
    print("\n" + "=" * 70)
    print("  EVALUATION COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    run_evaluation()
