package com.drones.fct.api.dto;

import com.drones.fct.domain.model.Orientation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDroneRequest {

  @NotNull
  @Schema(description = "ID of the matrix to which the drone belongs")
  private Long matrixId;

  @NotBlank
  @Schema(description = "Name of the drone")
  private String name;

  @NotBlank
  @Schema(description = "Model of the drone")
  private String model;

  @NotNull
  @Min(value = 0, message = "X can not be negative")
  @Schema(description = "Initial X coordinate of the drone")
  private int x;

  @NotNull
  @Min(value = 0, message = "Y can not be negative")
  @Schema(description = "Initial Y coordinate of the drone")
  private int y;

  @NotNull(message = "Orientation is required")
  @Schema(description = "Initial orientation of the drone")
  private Orientation orientation;
}