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


class LoginSchema(BaseModel):
    email: str
    password: str

class DonationSchema(BaseModel):
    user_id: int
    item: str
    quantity: int

class RequestSchema(BaseModel):
    user_id: int
    item: str
    quantity: int
