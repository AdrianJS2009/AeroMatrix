package com.drones.fct.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMatrixRequest {

  @NotNull(message = "Max X is required")
  @Min(value = 1, message = "Max X must be at least 1")
  @Schema(description = "Maximum value of the X coordinate")
  private int maxX;

  @NotNull(message = "Max Y is required")
  @Min(value = 1, message = "Max Y must be at least 1")
  @Schema(description = "Maximum value of the Y coordinate")
  private int maxY;
}
