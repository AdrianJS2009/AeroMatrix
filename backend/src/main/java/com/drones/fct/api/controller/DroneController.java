package com.drones.fct.api.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.drones.fct.api.dto.CreateDroneRequest;
import com.drones.fct.api.dto.DroneDto;
import com.drones.fct.api.dto.UpdateDroneRequest;
import com.drones.fct.application.DroneService;
import com.drones.fct.domain.model.Drone;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Drone Management", description = "CRUD operations for drones")
@RestController
@RequestMapping("/api/drones")
@RequiredArgsConstructor
public class DroneController {

  private final DroneService droneService;

  @Operation(summary = "Create a drone", responses = {
      @ApiResponse(responseCode = "201", description = "Drone created", content = @Content(schema = @Schema(implementation = DroneDto.class))),
      @ApiResponse(responseCode = "400", description = "Invalid input"),
      @ApiResponse(responseCode = "404", description = "Matrix not found"),
      @ApiResponse(responseCode = "409", description = "Position conflict")
  })
  @PostMapping
  public ResponseEntity<DroneDto> createDrone(@Valid @RequestBody CreateDroneRequest request) {

    Drone drone = droneService.createDrone(
        request.getMatrixId(),
        request.getName(),
        request.getModel(),
        request.getX(),
        request.getY(),
        request.getOrientation());
    return new ResponseEntity<>(toDto(drone), HttpStatus.CREATED);

  }

  @Operation(summary = "Get a drone by ID", responses = {
      @ApiResponse(responseCode = "200", description = "Drone found", content = @Content(schema = @Schema(implementation = DroneDto.class))),
      @ApiResponse(responseCode = "404", description = "Drone not found")
  })
  @GetMapping("/{droneId}")
  public DroneDto getDrone(@PathVariable Long droneId) {
    return toDto(droneService.getDrone(droneId));
  }

  @Operation(summary = "Update drone", responses = {
      @ApiResponse(responseCode = "200", description = "Drone updated"),
      @ApiResponse(responseCode = "404", description = "Drone or Matrix not found"),
      @ApiResponse(responseCode = "409", description = "Position conflict")
  })

  @PutMapping("/{droneId}")
  public DroneDto updateDrone(
      @PathVariable Long droneId,
      @Valid @RequestBody UpdateDroneRequest request) {
    return toDto(droneService.updateDrone(
        droneId,
        request.getMatrixId(),
        request.getName(),
        request.getModel(),
        request.getX(),
        request.getY(),
        request.getOrientation()));
  }

  @Operation(summary = "Delete drone", responses = {
      @ApiResponse(responseCode = "200", description = "Drone deleted"),
      @ApiResponse(responseCode = "404", description = "Drone not found")
  })
  @DeleteMapping("/{droneId}")
  public ResponseEntity<Map<String, String>> deleteDrone(
      @Parameter(description = "Drone ID") @PathVariable Long droneId) {

    Drone deletedDrone = droneService.deleteDrone(droneId);

    Map<String, String> response = new HashMap<>();
    response.put("message",
        "Drone ID " + deletedDrone.getId() + " deleted from database and all associated matrices");

    return ResponseEntity.ok(response);
  }

  @Operation(summary = "List all drones")
  @GetMapping
  public List<DroneDto> listDrones() {
    return droneService.listDrones().stream().map(this::toDto).toList();
  }

  private DroneDto toDto(Drone drone) {
    if (drone == null)
      return new DroneDto();
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
