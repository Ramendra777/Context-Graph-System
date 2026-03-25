from fastapi import APIRouter
from backend.graph.builder import build_o2c_graph
from backend.graph.exporter import export_react_flow
from backend.database import SessionLocal
from backend.models import SalesOrder, Delivery, BillingDocument, Payment

router = APIRouter()

@router.get("/")
def get_graph():
    """
    Returns the full O2C graph formatted for React Flow.
    """
    g = build_o2c_graph()
    data = export_react_flow(g)
    return data

@router.get("/stats")
def get_graph_stats():
    """
    Returns graph-level analytics including node/edge counts and broken flow detection.
    """
    g = build_o2c_graph()
    db = SessionLocal()
    try:
        # Count nodes by type
        node_counts = {}
        for _, data in g.nodes(data=True):
            ntype = data.get("type", "Unknown")
            node_counts[ntype] = node_counts.get(ntype, 0) + 1

        # Count edges by type
        edge_counts = {}
        for _, _, data in g.edges(data=True):
            etype = data.get("type", "Unknown")
            edge_counts[etype] = edge_counts.get(etype, 0) + 1

        # Broken flows: Delivered but NOT billed
        all_deliveries = {d.delivery_id for d in db.query(Delivery).all()}
        billed_deliveries = {b.delivery_id for b in db.query(BillingDocument).filter(BillingDocument.delivery_id.isnot(None)).all()}
        delivered_not_billed = list(all_deliveries - billed_deliveries)

        # Broken flows: Billed but NOT paid
        all_billing_acc_docs = {b.accounting_document_id for b in db.query(BillingDocument).filter(BillingDocument.accounting_document_id.isnot(None)).all()}
        paid_acc_docs = {p.accounting_document_id for p in db.query(Payment).all()} | {p.clearing_accounting_document for p in db.query(Payment).all()}
        billed_not_paid = list(all_billing_acc_docs - paid_acc_docs)

        # Broken flows: Orders without any delivery
        all_orders = {so.sales_order_id for so in db.query(SalesOrder).all()}
        delivered_orders = {d.sales_order_id for d in db.query(Delivery).filter(Delivery.sales_order_id.isnot(None)).all()}
        orders_not_delivered = list(all_orders - delivered_orders)

        return {
            "total_nodes": g.number_of_nodes(),
            "total_edges": g.number_of_edges(),
            "node_counts_by_type": node_counts,
            "edge_counts_by_type": edge_counts,
            "broken_flows": {
                "delivered_not_billed": {"count": len(delivered_not_billed), "ids": delivered_not_billed[:10]},
                "billed_not_paid": {"count": len(billed_not_paid), "ids": billed_not_paid[:10]},
                "orders_not_delivered": {"count": len(orders_not_delivered), "ids": orders_not_delivered[:10]},
            }
        }
    finally:
        db.close()
