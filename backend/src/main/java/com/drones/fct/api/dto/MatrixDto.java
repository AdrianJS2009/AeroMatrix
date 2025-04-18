package com.drones.fct.api.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MatrixDto {
  @Schema(description = "ID of the matrix")
  private Long id;

  @Schema(description = "Maximum value of the X coordinate")
  private int maxX;

  @Schema(description = "Maximum value of the Y coordinate")
  private int maxY;

  @Schema(description = "List of drones in the matrix")
  private List<DroneDto> drones;
}
