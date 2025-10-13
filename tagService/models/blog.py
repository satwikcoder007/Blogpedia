from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

# Helper to handle ObjectId serialization
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Pydantic model for validation
class BlogModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    owner: PyObjectId
    title: str
    content: str
    image: Optional[str] = ""
    tags: List[str] = []
    keywords: List[str] = []
    likes: int = 0
    dislikes: int = 0

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# MongoDB setup
MONGO_URI = os.getenv("MONGODBURL")+"/"+os.getenv("MONGODBDBNAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client["blogs"]
blogs_collection = db["Blogs"]
