# Order-to-Cash Graph Explorer

A graph-based data modeling and query system to explore Order-to-Cash processes using natural language queries.

## Architecture & Tech Stack
- **Backend**: FastAPI + SQLite + SQLAlchemy
- **Graph Processing**: NetworkX, converting tabular SAP O2C data into interconnected flows.
- **Frontend**: React + React Flow + TailwindCSS.
- **LLM**: Google API (`google-generativeai`) to handle natural language parsing into SQL/graph operations.

## Graph Modeling Decisions
- **Nodes**: Each unique entity such as an Order, Delivery, Invoice, Payment, Customer, and Product is represented as a node. Node properties hold the item-level semantics and metadata.
- **Edges**: Relationships are mapped linearly representing the flow logic (Order -> Delivery -> Invoice -> Payment), and hierarchically to associated contexts (Order -> Customer, Product -> Category).
