import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from backend.database import engine, Base, SessionLocal
from backend.models import Customer, SalesOrder, Delivery, BillingDocument, Payment

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA_DIR = os.path.join(REPO_ROOT, "sap-o2c-data")

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except ValueError:
        return None

def process_files(dir_name, callback):
    dir_path = os.path.join(DATA_DIR, dir_name)
    if not os.path.exists(dir_path):
        print(f"Directory not found: {dir_path}")
        return
    for filename in os.listdir(dir_path):
        if filename.endswith(".jsonl"):
            with open(os.path.join(dir_path, filename), "r") as f:
                for line in f:
                    if line.strip():
                        data = json.loads(line)
                        callback(data)

def run_ingestion():
    db = SessionLocal()
    try:
        print("Ingesting Sales Orders...")
        customers = set()
        
        def process_so(data):
            cust_id = data.get("soldToParty")
            if cust_id and cust_id not in customers:
                if not db.query(Customer).filter_by(customer_id=cust_id).first():
                    db.add(Customer(customer_id=cust_id, customer_name=f"Customer {cust_id}"))
                customers.add(cust_id)
            
            order_id = data.get("salesOrder")
            if order_id:
                try:
                    amount = float(data.get("totalNetAmount", 0) or 0)
                except ValueError:
                    amount = 0.0
                order = SalesOrder(
                    sales_order_id=order_id,
                    customer_id=cust_id,
                    creation_date=parse_date(data.get("creationDate")),
                    total_net_amount=amount,
                    currency=data.get("transactionCurrency"),
                    overall_delivery_status=data.get("overallDeliveryStatus")
                )
                db.add(order)
        process_files("sales_order_headers", process_so)
        db.commit()

        print("Mapping Deliveries to Orders...")
        deliv_to_so = {}
        def map_deliv(data):
            deliv_to_so[data.get("deliveryDocument")] = data.get("referenceSdDocument")
        process_files("outbound_delivery_items", map_deliv)

        print("Ingesting Deliveries...")
        def process_deliv(data):
            deliv_id = data.get("deliveryDocument")
            if deliv_id:
                db.add(Delivery(
                    delivery_id=deliv_id,
                    sales_order_id=deliv_to_so.get(deliv_id),
                    creation_date=parse_date(data.get("creationDate")),
                    shipping_point=data.get("shippingPoint"),
                    overall_goods_movement_status=data.get("overallGoodsMovementStatus")
                ))
        process_files("outbound_delivery_headers", process_deliv)
        db.commit()

        print("Mapping Billing Documents...")
        bill_to_ref = {}
        def map_bill(data):
            bill_to_ref[data.get("billingDocument")] = data.get("referenceSdDocument")
        process_files("billing_document_items", map_bill)

        print("Ingesting Billing Documents...")
        def process_bill(data):
            bill_id = data.get("billingDocument")
            if bill_id:
                ref = bill_to_ref.get(bill_id)
                d_id = None
                so_id = None
                if ref:
                    if ref in deliv_to_so:
                        d_id = ref
                        so_id = deliv_to_so[ref]
                    else:
                        so_id = ref
                
                try:
                    amount = float(data.get("totalNetAmount", 0) or 0)
                except ValueError:
                    amount = 0.0

                db.add(BillingDocument(
                    billing_document_id=bill_id,
                    delivery_id=d_id,
                    sales_order_id=so_id,
                    creation_date=parse_date(data.get("creationDate")),
                    total_net_amount=amount,
                    currency=data.get("transactionCurrency"),
                    accounting_document_id=data.get("accountingDocument")
                ))
        process_files("billing_document_headers", process_bill)
        db.commit()

        print("Ingesting Payments...")
        def process_payment(data):
            try:
                amount = float(data.get("amountInTransactionCurrency", 0) or 0)
            except ValueError:
                amount = 0.0
            
            accounting_doc = data.get("accountingDocument")
            clearing_doc = data.get("clearingAccountingDocument")
            cust_id = data.get("customer")
            
            db.add(Payment(
                accounting_document_id=accounting_doc,
                company_code=data.get("companyCode"),
                fiscal_year=data.get("fiscalYear"),
                clearing_accounting_document=clearing_doc,
                amount_in_transaction_currency=amount,
                currency=data.get("transactionCurrency"),
                customer_id=cust_id
            ))
        process_files("payments_accounts_receivable", process_payment)
        db.commit()
        
        print(f"Ingestion complete. Orders: {db.query(SalesOrder).count()} | Deliveries: {db.query(Delivery).count()} | Billing: {db.query(BillingDocument).count()} | Payments: {db.query(Payment).count()}")

    finally:
        db.close()

if __name__ == "__main__":
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    run_ingestion()
