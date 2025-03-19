package com.drones.fct.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MatrixDto {
  @Schema(description = "ID of the matrix")
  private Long id;

  @Schema(description = "Maximum value of the X coordinate")
  private Integer maxX;

  @Schema(description = "Maximum value of the Y coordinate")
  private Integer maxY;
}
