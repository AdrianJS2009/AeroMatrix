package com.drones.fct.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.drones.fct.domain.Drone;
import com.drones.fct.dto.BatchDroneCommandRequest;
import com.drones.fct.dto.CommandsRequest;
import com.drones.fct.dto.DroneDto;
import com.drones.fct.service.FlightService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Flight Management", description = "Operations to manage drone flights")
@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

  private final FlightService flightService;

  @Operation(summary = "Execute commands on a drone", responses = {
      @ApiResponse(responseCode = "200", description = "Commands executed"),
      @ApiResponse(responseCode = "400", description = "Invalid command"),
      @ApiResponse(responseCode = "404", description = "Drone not found"),
      @ApiResponse(responseCode = "409", description = "Collision/Out of bounds")
  })
  @PostMapping("/drones/{droneId}/commands")
  public DroneDto executeCommands(
      @PathVariable Long droneId,
      @Valid @RequestBody CommandsRequest request) {
    return toDto(flightService.executeCommands(droneId, request.getCommands()));
  }

  @Operation(summary = "Execute the same sequence of commands on multiple drones at once", responses = {
      @ApiResponse(responseCode = "200", description = "Commands executed"),
      @ApiResponse(responseCode = "400", description = "Invalid request")
  })
  @PostMapping("/drones/commands")
  public void executeCommandsInSequence(
      @Parameter(description = "Drones IDs") @RequestParam List<Long> droneIds,
      @RequestBody CommandsRequest request) {
    flightService.executeCommandsInSequence(droneIds, request.getCommands());
  }

  @Operation(summary = "Execute multiple different command sequences for multiple different drones", responses = {
      @ApiResponse(responseCode = "202", description = "Commands accepted"),
      @ApiResponse(responseCode = "400", description = "Invalid request")
  })
  @PostMapping("/batch-commands")
  public ResponseEntity<Void> executeBatchCommands(
      @Valid @RequestBody BatchDroneCommandRequest request) {
    flightService.executeBatchCommands(request.getCommands());
    return ResponseEntity.accepted().build();
  }

  private DroneDto toDto(Drone drone) {
    DroneDto dto = new DroneDto();
    dto.setId(drone.getId());
    dto.setName(drone.getName());
    dto.setModel(drone.getModel());
    dto.setX(drone.getX());
    dto.setY(drone.getY());
    dto.setOrientation(drone.getOrientation());
    dto.setMatrixId(drone.getMatrix().getId());
    return dto;
  }
}