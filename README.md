# Order-to-Cash Context Graph System

A graph-based data exploration system that unifies fragmented SAP Order-to-Cash (O2C) data into an interactive context graph with an LLM-powered conversational query interface.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  React + React Flow + Tailwind CSS + Framer Motion          │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │   Graph Viewport    │  │   AI Chat Sidebar            │  │
│  │   (React Flow)      │  │   (POST /api/chat)           │  │
│  │   + Node Detail     │  │   + History Context          │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                     Vite Dev Proxy
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  ┌──────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐  │
│  │ /api/     │ │ /api/chat  │ │ /api/     │ │ LLM        │  │
│  │ graph     │ │            │ │ graph/    │ │ Service    │  │
│  │           │ │ Guardrails │ │ stats     │ │ (Gemini)   │  │
│  └──────────┘ │ → SQL Gen  │ └───────────┘ └────────────┘  │
│               │ → Execute  │                                │
│               │ → Synth    │                                │
│               └────────────┘                                │
│  ┌──────────────────────┐  ┌─────────────────────────────┐  │
│  │  NetworkX Graph      │  │  SQLite + SQLAlchemy ORM    │  │
│  │  (In-memory)         │  │  (Persistent Storage)       │  │
│  └──────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React, React Flow, Tailwind CSS, Framer Motion|
| Backend   | FastAPI, SQLAlchemy, NetworkX                 |
| Database  | SQLite                                        |
| LLM       | Google Gemini 2.5 Flash                       |
| Build     | Vite                                          |

## Graph Model

**Nodes**: Customers, Sales Orders, Deliveries, Billing Documents, Payments  
**Edges**: `PLACED_ORDER` → `HAS_DELIVERY` → `BILLED_AS` → `CLEARED_BY`

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Google Gemini API Key](https://ai.google.dev/)

### 1. Clone & Setup Backend
```bash
cd order-to-cash-graph
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Ingest Data
```bash
export PYTHONPATH=.
python backend/scripts/ingest.py
```

### 4. Start Backend
```bash
uvicorn backend.main:app --reload
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** to explore the graph and chat with your data.

## API Reference

| Method | Endpoint           | Description                                |
|--------|--------------------|--------------------------------------------|
| GET    | `/api/graph`       | Returns full graph in React Flow format    |
| GET    | `/api/graph/stats` | Returns analytics and broken flow data     |
| POST   | `/api/chat/`       | LLM-powered natural language querying      |

### POST `/api/chat/` — Request Body
```json
{
  "question": "How many sales orders are there?",
  "history": []
}
```

### POST `/api/chat/` — Response
```json
{
  "answer": "There are 100 sales orders in the database.",
  "sql_query": "SELECT COUNT(*) FROM sales_orders",
  "data": [{"COUNT(*)": 100}]
}
```

## Example Queries
- *"Which customers are associated with the highest number of billing documents?"*
- *"Trace the flow of billing document 90504259."*
- *"Identify broken flows — deliveries that were never billed."*

Run the evaluation script to test all example queries:
```bash
export PYTHONPATH=.
python backend/scripts/evaluate.py
```

## Project Structure
```
order-to-cash-graph/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py           # SQLite + SQLAlchemy setup
│   ├── models.py             # ORM models
│   ├── graph/
│   │   ├── builder.py        # NetworkX graph construction
│   │   └── exporter.py       # React Flow JSON export
│   ├── llm/
│   │   ├── service.py        # Gemini API client
│   │   ├── prompts.py        # System prompts & schema
│   │   ├── guardrails.py     # Off-topic rejection
│   │   └── executor.py       # Safe SQL execution
│   ├── routes/
│   │   ├── graph.py          # /api/graph endpoints
│   │   └── chat.py           # /api/chat endpoint
│   └── scripts/
│       ├── ingest.py          # Data ingestion from JSONL
│       └── evaluate.py        # Automated query evaluation
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main layout
│   │   └── components/
│   │       ├── GraphView.jsx       # React Flow canvas
│   │       ├── CustomNodes.jsx     # Styled entity nodes
│   │       ├── ChatPanel.jsx       # AI chat interface
│   │       └── NodeDetailPanel.jsx # Click-to-inspect panel
│   ├── index.html
│   └── vite.config.js
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Key Features
- **Interactive Graph**: 477 nodes, 469 edges — pan, zoom, and click to inspect any entity.
- **LLM Chat**: Ask natural language questions → auto-generated SQL → data-backed answers.
- **Guardrails**: Off-topic questions are rejected before reaching the database.
- **Broken Flow Detection**: Automatically identifies orders not delivered, deliveries not billed, and bills not paid.
- **Multi-turn Context**: Follow-up questions reference previous conversation history.
