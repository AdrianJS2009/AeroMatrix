package com.drones.fct.dto;

import com.drones.fct.domain.Orientation;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class DroneDto {
  @Schema(description = "Drone ID")
  private Long id;

  @Schema(description = "Drone name")
  private String name;

  @Schema(description = "Drone model")
  private String model;

  @Schema(description = "Coord X of the drone")
  private int x;

  @Schema(description = "Coord Y of the drone")
  private int y;

  @Schema(description = "Drone orientation")
  private Orientation orientation;

  @Schema(description = "Matrix ID where the drone is located")
  private Long matrixId;
}