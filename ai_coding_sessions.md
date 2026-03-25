# AI Coding Sessions / Prompt Logs

## 1. Overview of AI Tool Usage
The project was built using **Antigravity**, an agentic AI coding assistant. The workflow followed a **Phase-based Implementation Strategy**:
- **Planning**: AI generated implementation plans (Step-by-Step) before any code was written.
- **Execution**: AI performed code generation, file management, and terminal command execution.
- **Verification**: AI used a browser subagent and automated evaluation scripts to verify functional requirements.

---

## 2. Key Prompts and Workflows

### Phase 1: Data Ingestion & Modeling
**Objective**: Transform fragmented JSONL data into a relational SQLite database.
- **Key Prompt**: *"Analyze the SAP O2C dataset in `sap-o2c-data/` and design a SQLAlchemy schema that unifies Sales Orders, Deliveries, Billing, and Payments."*
- **Outcome**: Created `backend/models.py` and `backend/scripts/ingest.py`.

### Phase 2: Graph Engine Implementation
**Objective**: Build the relationship network using NetworkX.
- **Key Prompt**: *"Build a graph engine that extracts relationships from SQLite. Edges should represent the O2C flow: Sales -> Delivery -> Billing -> Payment."*
- **Outcome**: Developed `backend/graph/builder.py` and `backend/graph/exporter.py` for React Flow compatibility.

### Phase 3: Conversational AI & Guardrails
**Objective**: Implement NL-to-SQL translation with security filters.
- **Key Prompt**: *"Configure Gemini 1.5 Flash to translate user questions into SQL. Add a guardrail service to block off-topic questions (e.g., weather) and ensure read-only execution."*
- **Outcome**: Implemented `backend/llm/guardrails.py` and `backend/llm/service.py`.

### Phase 4: Frontend Development
**Objective**: Create a modern interactive dashboard.
- **Key Prompt**: *"Build a React split-pane UI. Left side: React Flow graph with custom nodes. Right side: AI Chat sidebar with message history."*
- **Outcome**: Developed the core frontend in `frontend/src/`.

---

## 3. Debugging & Iteration Cycles

### Issue 1: Frontend Startup Failure
- **Symptom**: `npm run dev` exited immediately.
- **Diagnosis**: AI identified missing `"type": "module"` in `package.json` for ES module compatibility with Vite.
- **Fix**: AI patched `package.json` and restarted the server.

### Issue 2: Python Version & SDK Deprecation
- **Observation**: The environment was running Python 3.9 (EOL) and used the deprecated `google.generativeai` package.
- **Strategic Decision**: AI recommended a future migration to `google.genai` and documented this in the `README` as a technical debt item.

### Issue 3: UI Theming
- **User Iteration**: User requested a shift from a Dark Theme to a "Clean White Theme."
- **Response**: Developed a 3-commit retheming plan, updating Global CSS, Custom Nodes, and the Chat Panel to match corporate reference images accurately.

---

## 4. Workflows Summary
- **Verification Loop**: After every major phase, the AI used a `browser_subagent` to take screenshots and record video of the UI features (Graph zoom, Node click, Chat response).
- **Automated Tests**: An `evaluate.py` script was created to run the 3 core required business queries repeatedly to ensure no regressions occurred during UI redesign.
