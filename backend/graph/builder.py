import networkx as nx
from backend.database import SessionLocal
from backend.models import Customer, SalesOrder, Delivery, BillingDocument, Payment

def build_o2c_graph():
    """Builds and returns a NetworkX DiGraph representing the O2C process."""
    G = nx.DiGraph()
    db = SessionLocal()
    
    try:
        # 1. Add Customers
        for c in db.query(Customer).all():
            G.add_node(c.customer_id, type="Customer", label=c.customer_name or f"Customer {c.customer_id}", country=c.country)
            
        # 2. Add Sales Orders
        for so in db.query(SalesOrder).all():
            G.add_node(so.sales_order_id, type="SalesOrder", label=f"Order {so.sales_order_id}", amount=so.total_net_amount, currency=so.currency, status=so.overall_delivery_status)
            if so.customer_id:
                G.add_edge(so.customer_id, so.sales_order_id, type="PLACED_ORDER")
                
        # 3. Add Deliveries
        for d in db.query(Delivery).all():
            G.add_node(d.delivery_id, type="Delivery", label=f"Deliv {d.delivery_id}", status=d.overall_goods_movement_status)
            if d.sales_order_id:
                G.add_edge(d.sales_order_id, d.delivery_id, type="HAS_DELIVERY")
                
        # 4. Add Billing Documents
        for b in db.query(BillingDocument).all():
            G.add_node(b.billing_document_id, type="BillingDocument", label=f"Bill {b.billing_document_id}", amount=b.total_net_amount, currency=b.currency)
            # Link to Delivery if available, else link to SalesOrder
            if b.delivery_id:
                G.add_edge(b.delivery_id, b.billing_document_id, type="BILLED_AS")
            elif b.sales_order_id:
                G.add_edge(b.sales_order_id, b.billing_document_id, type="BILLED_AS")

        # 5. Add Payments
        # Pre-fetch all bills to find matching accounting_document_id mappings efficiently
        billing_acc_map = {}
        for b in db.query(BillingDocument).filter(BillingDocument.accounting_document_id.isnot(None)):
            billing_acc_map[b.accounting_document_id] = b.billing_document_id

        for p in db.query(Payment).all():
            pid = f"PAY_{p.payment_id}"
            G.add_node(pid, type="Payment", label=f"Pay {p.accounting_document_id}", amount=p.amount_in_transaction_currency, currency=p.currency)
            
            # Map Payment to BillingDocument based on accounting_document_id
            if p.accounting_document_id in billing_acc_map:
                linked_bill_id = billing_acc_map[p.accounting_document_id]
                G.add_edge(linked_bill_id, pid, type="CLEARED_BY")
            elif p.clearing_accounting_document in billing_acc_map:
                # Sometimes the payment clears via clearing_accounting_document
                linked_bill_id = billing_acc_map[p.clearing_accounting_document]
                G.add_edge(linked_bill_id, pid, type="CLEARED_BY")

        return G
    finally:
        db.close()
