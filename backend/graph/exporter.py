import networkx as nx

def export_react_flow(G: nx.DiGraph):
    """
    Exports a NetworkX graph to React Flow's expected JSON structure.
    """
    react_flow_nodes = []
    react_flow_edges = []
    
    # Calculate a basic force-directed layout starting point.
    # We can refine this using dagre on the frontend later for hierarchical view.
    try:
        positions = nx.spring_layout(G, scale=1000)
    except Exception:
        positions = {n: [0, 0] for n in G.nodes()}

    for node_id, data in G.nodes(data=True):
        pos = positions.get(node_id, [0, 0])
        react_flow_nodes.append({
            "id": str(node_id),
            "type": "custom", # Frontend can map this if needed
            "data": dict(data),
            "position": {"x": float(pos[0]), "y": float(pos[1])}
        })
        
    for u, v, data in G.edges(data=True):
        edge_id = f"e_{u}_{v}"
        react_flow_edges.append({
            "id": edge_id,
            "source": str(u),
            "target": str(v),
            "label": data.get("type", ""),
            "animated": True
        })
        
    return {
        "nodes": react_flow_nodes,
        "edges": react_flow_edges
    }
