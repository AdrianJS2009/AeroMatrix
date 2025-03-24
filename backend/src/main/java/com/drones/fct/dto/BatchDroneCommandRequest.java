package com.drones.fct.dto;

import java.util.List;

import com.drones.fct.domain.MovementCommand;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class BatchDroneCommandRequest {
  @Schema(description = "List of commands to execute by drones")
  private List<DroneCommand> commands;

  @Data
  @AllArgsConstructor
  public static class DroneCommand {
    @NotNull
    @Schema(description = "Drone identifier")
    private Long droneId;

    @NotNull
    @Schema(description = "List of movement commands")
    private List<MovementCommand> commands;
  }
}
