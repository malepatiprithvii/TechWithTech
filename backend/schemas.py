from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    name: str
    type: str
    address: str
    city: str
    state: str
    zip: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True


from datetime import datetime

class LoginSchema(BaseModel):
    email: str
    password: str

class DonationSchema(BaseModel):
    user_id: int
    item: str
    quantity: int

class DonationResponse(DonationSchema):
    id: int
    date: datetime
    shipping_number: Optional[str] = None
    
    class Config:
        orm_mode = True

class RequestSchema(BaseModel):
    user_id: int
    item: str
    quantity: int

class RequestResponse(RequestSchema):
    id: int
    status: str
    date: datetime

    class Config:
        orm_mode = True

class SchoolRequestResponse(RequestResponse):
    school_name: str
