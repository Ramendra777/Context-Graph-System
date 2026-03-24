from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .database import Base

class Customer(Base):
    __tablename__ = "customers"
    
    customer_id = Column(String, primary_key=True, index=True)
    customer_name = Column(String, nullable=True)
    country = Column(String, nullable=True)

    sales_orders = relationship("SalesOrder", back_populates="customer")

class SalesOrder(Base):
    __tablename__ = "sales_orders"
    
    sales_order_id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.customer_id"), nullable=True, index=True)
    creation_date = Column(DateTime)
    total_net_amount = Column(Float)
    currency = Column(String)
    overall_delivery_status = Column(String)

    customer = relationship("Customer", back_populates="sales_orders")
    deliveries = relationship("Delivery", back_populates="sales_order")
    billing_documents = relationship("BillingDocument", back_populates="sales_order")

class Delivery(Base):
    __tablename__ = "deliveries"
    
    delivery_id = Column(String, primary_key=True, index=True)
    sales_order_id = Column(String, ForeignKey("sales_orders.sales_order_id"), nullable=True, index=True) 
    creation_date = Column(DateTime)
    shipping_point = Column(String)
    overall_goods_movement_status = Column(String)

    sales_order = relationship("SalesOrder", back_populates="deliveries")
    billing_documents = relationship("BillingDocument", back_populates="delivery")

class BillingDocument(Base):
    __tablename__ = "billing_documents"
    
    billing_document_id = Column(String, primary_key=True, index=True)
    delivery_id = Column(String, ForeignKey("deliveries.delivery_id"), nullable=True, index=True) 
    sales_order_id = Column(String, ForeignKey("sales_orders.sales_order_id"), nullable=True, index=True) 
    creation_date = Column(DateTime)
    total_net_amount = Column(Float)
    currency = Column(String)
    accounting_document_id = Column(String, index=True)

    delivery = relationship("Delivery", back_populates="billing_documents")
    sales_order = relationship("SalesOrder", back_populates="billing_documents")

class Payment(Base):
    __tablename__ = "payments"
    
    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    accounting_document_id = Column(String, index=True)
    company_code = Column(String)
    fiscal_year = Column(String)
    clearing_accounting_document = Column(String, index=True)
    amount_in_transaction_currency = Column(Float)
    currency = Column(String)
    customer_id = Column(String, ForeignKey("customers.customer_id"), nullable=True)
