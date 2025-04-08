package com.drones.fct.api.dto;

import jakarta.validation.constraints.Min;
import lombok.Value;

@Value
public class UpdateMatrixRequest {
  @Min(value = 1, message = "Max X must be at least 1")
  int maxX;

  @Min(value = 1, message = "Max Y must be at least 1")
  int maxY;

}
