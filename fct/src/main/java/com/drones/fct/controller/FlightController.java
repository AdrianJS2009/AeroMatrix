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
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Gestión de Vuelos", description = "Operaciones para gestionar vuelos de drones")
@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

  private final FlightService flightService;

  @Operation(summary = "Ejecutar una secuencia de órdenes en un dron", responses = {
      @ApiResponse(responseCode = "200", description = "Órdenes ejecutadas", content = @Content(schema = @Schema(implementation = DroneDto.class))),
      @ApiResponse(responseCode = "404", description = "Dron no encontrado"),
      @ApiResponse(responseCode = "400", description = "Solicitud inválida")
  })
  @PostMapping("/drone/{droneId}/commands")
  public DroneDto executeCommands(@Parameter(description = "ID del dron") @PathVariable Long droneId,
      @RequestBody CommandsRequest request) {
    Drone drone = flightService.executeCommands(droneId, request.getCommands());
    return toDto(drone);
  }

  @Operation(summary = "Ejecutar una misma secuencia de órdenes en varios drones a la vez", responses = {
      @ApiResponse(responseCode = "200", description = "Órdenes ejecutadas"),
      @ApiResponse(responseCode = "400", description = "Solicitud inválida")
  })
  @PostMapping("/drones/commands")
  public void executeCommandsInSequence(
      @Parameter(description = "IDs de los drones") @RequestParam List<Long> droneIds,
      @RequestBody CommandsRequest request) {
    flightService.executeCommandsInSequence(droneIds, request.getCommands());
  }

  @Operation(summary = "Ejecutar múltiples secuencias de ordenes distintas para múltiples drones distintos", responses = {
      @ApiResponse(responseCode = "202", description = "Órdenes aceptadas"),
      @ApiResponse(responseCode = "400", description = "Solicitud inválida")
  })
  @PostMapping("/drones/batch-commands")
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