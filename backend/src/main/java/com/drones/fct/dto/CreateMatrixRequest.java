package com.drones.fct.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMatrixRequest {

  @NotNull
  @Min(1)
  @Schema(description = "Maximum value of the X coordinate")
  private int maxX;

  @NotNull
  @Min(1)
  @Schema(description = "Maximum value of the Y coordinate")
  private int maxY;

}
