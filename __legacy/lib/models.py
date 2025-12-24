from pydantic import BaseModel


class Move(BaseModel):
    checker_id: str
    start: str
    end: str
