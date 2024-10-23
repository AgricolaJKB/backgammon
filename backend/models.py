from pydantic import BaseModel


class Move(BaseModel):
    checker_id: str
    start: int
    end: int
