from pydantic import BaseModel, Field, field_validator


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
    array: list[int] = Field(default_factory=list)
    comparing: list[int] = Field(default_factory=list)
    swapping: list[int] = Field(default_factory=list)
    overwriting: list[int] = Field(default_factory=list)
    sorted: list[int] = Field(default_factory=list)
    comparisons: int
    swaps: int
    array_accesses: int
    operation: str = ""
    description: str = ""
    pseudocode_line: int = -1
    range: list[int] = Field(default_factory=list)
    left_range: list[int] = Field(default_factory=list)
    right_range: list[int] = Field(default_factory=list)
    depth: int = 0
    segments: list[list[int]] = Field(default_factory=list)
    merge_range: list[int] = Field(default_factory=list)
    temp_snapshot: list[int] = Field(default_factory=list)
    temp_left_range: list[int] = Field(default_factory=list)
    temp_right_range: list[int] = Field(default_factory=list)
    temp_left_ptr: int = -1
    temp_right_ptr: int = -1
    write_index: int = -1
    write_value: int | None = None
    source_side: str = ""
    source_indices: list[int] = Field(default_factory=list)


class SortResponse(BaseModel):
    algorithm: str
    initial_array: list[int]
    steps: list[SortStep]
