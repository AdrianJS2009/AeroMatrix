package com.drones.fct.dto;

import java.util.List;

import com.drones.fct.domain.MovementCommand;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class BatchDroneCommandRequest {
  @NotNull(message = "commands cannot be null")
  @Schema(description = "List of commands to execute by drones")
  private List<DroneCommand> commands;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class DroneCommand {
    @NotNull(message = "Drone identifier cannot be null")
    @Schema(description = "Drone identifier")
    private Long droneId;

    @NotNull(message = "List of movement commands cannot be null")
    @Schema(description = "List of movement commands")
    private List<MovementCommand> commands;
  }
}
