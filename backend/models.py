from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "p_users"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    password = Column(String)
    name = Column(String)
    type = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip = Column(String)

class Donation(Base):
    __tablename__ = "p_donations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    item = Column(String)
    quantity = Column(Integer)
    date = Column(DateTime(timezone=True), server_default=func.now())
    shipping_number = Column(String, default="PENDING-123")

class Request(Base):
    __tablename__ = "p_requests"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    item = Column(String)
    quantity = Column(Integer)
    status = Column(String, default="Pending")
    date = Column(DateTime(timezone=True), server_default=func.now())
