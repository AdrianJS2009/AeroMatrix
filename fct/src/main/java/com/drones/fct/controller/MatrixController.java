package com.drones.fct.controller;

import java.util.List;
import java.util.stream.Collectors;

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
import com.drones.fct.exception.ConflictException;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.service.MatrixService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Flight Matrix Management", description = "CRUD operations for flight matrices")
@RestController
@RequestMapping("/api/matrices-flight")
@RequiredArgsConstructor
public class MatrixController {

  private final MatrixService matrixService;
  private final DroneRepository droneRepository;

  @Operation(summary = "Create a flight matrix")
  @PostMapping("/create")
  public ResponseEntity<MatrixDto> createMatrix(
      @Valid @RequestBody CreateMatrixRequest request) {
    Matrix matrix = matrixService.createMatrix(request.getMaxX(), request.getMaxY());
    return new ResponseEntity<>(toDto(matrix), HttpStatus.CREATED);
  }

  @Operation(summary = "Get a matrix by ID")
  @GetMapping("/get/{id}")
  public MatrixDto getMatrix(@PathVariable Long id) {
    Matrix matrix = matrixService.getMatrix(id);
    return toDto(matrix);
  }

  @Operation(summary = "Update a matrix by ID")
  @PutMapping("/update/{id}")
  public MatrixDto updateMatrix(
      @PathVariable Long id,
      @RequestBody CreateMatrixRequest request) {
    Matrix matrix = matrixService.updateMatrix(id, request.getMaxX(), request.getMaxY());
    return toDto(matrix);
  }

  @Operation(summary = "Delete a matrix by ID", responses = {
      @ApiResponse(responseCode = "204", description = "Matrix deleted"),
      @ApiResponse(responseCode = "404", description = "Matrix not found"),
      @ApiResponse(responseCode = "409", description = "Matrix contains drones")
  })
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<String> deleteMatrix(@PathVariable Long id) {
    try {
      matrixService.deleteMatrix(id);
      return ResponseEntity.noContent().header("Message", "Matrix with " + id + " deleted").build();
    } catch (IllegalArgumentException ex) {
      List<Drone> drones = droneRepository.findByMatrixId(id);
      String droneIds = drones.stream().map(drone -> String.valueOf(drone.getId())).collect(Collectors.joining(", "));
      String message = "Cannot delete the matrix with " + id + " because it has drones working on it. Active drones: "
          + droneIds;
      throw new ConflictException(message);
    }
  }

  @Operation(summary = "List all matrices with their drones")
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