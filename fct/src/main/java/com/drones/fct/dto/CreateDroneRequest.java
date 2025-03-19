package com.drones.fct.dto;

import com.drones.fct.domain.Orientation;

import io.swagger.v3.oas.annotations.media.Schema;
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
  @Schema(description = "Initial X coordinate of the drone")
  private Integer x;

  @NotNull
  @Schema(description = "Initial Y coordinate of the drone")
  private Integer y;

  @NotNull
  @Schema(description = "Initial orientation of the drone")
  private Orientation orientation;
}