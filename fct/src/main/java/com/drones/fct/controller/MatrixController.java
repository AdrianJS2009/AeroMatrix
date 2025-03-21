package com.drones.fct.controller;

import java.util.List;

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

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.dto.CreateMatrixRequest;
import com.drones.fct.dto.DroneDto;
import com.drones.fct.dto.MatrixDto;
import com.drones.fct.dto.UpdateMatrixRequest;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.service.MatrixService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Flight Matrix Management", description = "CRUD operations for flight matrices")
@RestController
@RequestMapping("/api/matrices")
@RequiredArgsConstructor
public class MatrixController {

  private final MatrixService matrixService;
  private final DroneRepository droneRepository;

  @PostMapping
  public ResponseEntity<MatrixDto> createMatrix(@Valid @RequestBody CreateMatrixRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(toDto(matrixService.createMatrix(request.getMaxX(), request.getMaxY())));
  }

  @Operation(summary = "Get matrix details", responses = {
      @ApiResponse(responseCode = "200", description = "Matrix found"),
      @ApiResponse(responseCode = "404", description = "Matrix not found")
  })
  @GetMapping("/{matrixId}")
  public MatrixDto getMatrix(@PathVariable Long matrixId) {
    return toDto(matrixService.getMatrix(matrixId));
  }

  @Operation(summary = "Update matrix", responses = {
      @ApiResponse(responseCode = "200", description = "Matrix updated"),
      @ApiResponse(responseCode = "404", description = "Matrix not found"),
      @ApiResponse(responseCode = "409", description = "Invalid dimensions for drones")
  })
  @PutMapping("/{matrixId}")
  public MatrixDto updateMatrix(
      @PathVariable Long matrixId,
      @Valid @RequestBody UpdateMatrixRequest request) {
    return toDto(matrixService.updateMatrix(
        matrixId,
        request.getMaxX(),
        request.getMaxY()));
  }

  @Operation(summary = "Delete matrix", responses = {
      @ApiResponse(responseCode = "204", description = "Matrix deleted"),
      @ApiResponse(responseCode = "404", description = "Matrix not found"),
      @ApiResponse(responseCode = "409", description = "Matrix contains drones")
  })
  @DeleteMapping("/{matrixId}")
  public ResponseEntity<Void> deleteMatrix(@PathVariable Long matrixId) {
    matrixService.deleteMatrix(matrixId);
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "List all matrices")
  @GetMapping
  public List<MatrixDto> listMatrices() {
    return matrixService.listMatrices().stream().map(this::toDto).toList();
  }

  private MatrixDto toDto(Matrix matrix) {
    MatrixDto dto = new MatrixDto();
    dto.setId(matrix.getId());
    dto.setMaxX(matrix.getMaxX());
    dto.setMaxY(matrix.getMaxY());

    List<Drone> drones = droneRepository.findByMatrixId(matrix.getId());
    dto.setDrones(drones.stream().map(this::toDroneDto).toList());

    return dto;
  }

  private DroneDto toDroneDto(Drone drone) {
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