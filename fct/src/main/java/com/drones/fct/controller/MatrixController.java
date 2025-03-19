package com.drones.fct.controller;

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

import com.drones.fct.domain.Matrix;
import com.drones.fct.dto.CreateMatrixRequest;
import com.drones.fct.dto.MatrixDto;
import com.drones.fct.service.MatrixService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Flight Matrix Management", description = "CRUD operations for flight matrices")
@RestController
@RequestMapping("/api/matrices-flight")
@RequiredArgsConstructor
public class MatrixController {

  private final MatrixService matrixService;

  @Operation(summary = "Create a flight matrix")
  @PostMapping
  public ResponseEntity<MatrixDto> createMatrix(@RequestBody CreateMatrixRequest request) {
    Matrix matrix = matrixService.createMatrix(request.getMaxX(), request.getMaxY());
    return new ResponseEntity<>(toDto(matrix), HttpStatus.CREATED);
  }

  @Operation(summary = "Get a matrix by ID")
  @GetMapping("/{id}")
  public MatrixDto getMatrix(@PathVariable Long id) {
    Matrix matrix = matrixService.getMatrix(id);
    return toDto(matrix);
  }

  @Operation(summary = "Update a matrix by ID")
  @PutMapping("/{id}")
  public MatrixDto updateMatrix(
      @PathVariable Long id,
      @RequestBody CreateMatrixRequest request) {
    Matrix matrix = matrixService.updateMatrix(id, request.getMaxX(), request.getMaxY());
    return toDto(matrix);
  }

  @Operation(summary = "Delete a matrix by ID")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteMatrix(@PathVariable Long id) {
    matrixService.deleteMatrix(id);
    return ResponseEntity.noContent().build();
  }

  private MatrixDto toDto(Matrix matrix) {
    MatrixDto dto = new MatrixDto();
    dto.setId(matrix.getId());
    dto.setMaxX(matrix.getMaxX());
    dto.setMaxY(matrix.getMaxY());
    return dto;
  }

}