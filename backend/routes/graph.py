from fastapi import APIRouter
from backend.graph.builder import build_o2c_graph
from backend.graph.exporter import export_react_flow

router = APIRouter()

@router.get("/")
def get_graph():
    """
    Returns the full O2C graph formatted for React Flow.
    """
    g = build_o2c_graph()
    data = export_react_flow(g)
    return data
