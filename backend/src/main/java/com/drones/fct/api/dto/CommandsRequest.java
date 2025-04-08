package com.drones.fct.api.dto;

import java.util.List;

import com.drones.fct.domain.model.MovementCommand;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CommandsRequest {
  @Schema(description = "List of movement commands")
  private List<MovementCommand> commands;
}
