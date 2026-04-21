from pydantic import BaseModel, field_validator


class AlgorithmMeta(BaseModel):
    id: str
    name: str
    time_complexity: dict[str, str]
    space_complexity: str
    description: str
    stable: bool


class SortRequest(BaseModel):
    algorithm: str
    array: list[int]

    @field_validator("array")
    @classmethod
    def validate_array(cls, v: list[int]) -> list[int]:
        if not v:
            raise ValueError("array must not be empty")
        if len(v) > 100:
            raise ValueError("array size cannot exceed 100 elements")
        return v


class SortStep(BaseModel):
    array: list[int]
    comparing: list[int] = []
    swapping: list[int] = []
    overwriting: list[int] = []
    sorted: list[int] = []
    comparisons: int
    swaps: int
    array_accesses: int


class SortResponse(BaseModel):
    algorithm: str
    initial_array: list[int]
    steps: list[SortStep]
