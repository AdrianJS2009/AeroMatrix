package com.drones.fct.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.drones.fct.api.exception.ConflictException;
import com.drones.fct.api.exception.NotFoundException;
import com.drones.fct.application.MatrixService;
import com.drones.fct.domain.model.Drone;
import com.drones.fct.domain.model.Matrix;
import com.drones.fct.domain.repository.DroneRepository;
import com.drones.fct.domain.repository.MatrixRepository;

@ExtendWith(MockitoExtension.class)
class MatrixServiceTest {

  @Mock
  private MatrixRepository matrixRepository;

  @Mock
  private DroneRepository droneRepository;

  @InjectMocks
  private MatrixService matrixService;

  private Matrix matrix;

  @BeforeEach
  void setUp() {
    matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
  }

  @Test
  void createMatrix_Success() {
    when(matrixRepository.save(any(Matrix.class))).thenReturn(matrix);

    Matrix result = matrixService.createMatrix(10, 10);

    assertNotNull(result);
    assertEquals(10, result.getMaxX());
    assertEquals(10, result.getMaxY());
  }

  @Test
  void createMatrix_InvalidDimensions() {
    ConflictException exception = assertThrows(ConflictException.class, () -> matrixService.createMatrix(0, 10));
    assertTrue(exception.getMessage().contains("Matrix dimensions must be positive"));
  }

  @Test
  void updateMatrix_Success() {
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByMatrixId(1L)).thenReturn(Collections.emptyList());
    when(matrixRepository.save(any(Matrix.class))).thenReturn(matrix);

    Matrix result = matrixService.updateMatrix(1L, 12, 12);

    assertNotNull(result);
    assertEquals(12, result.getMaxX());
    assertEquals(12, result.getMaxY());
  }

  @Test
  void updateMatrix_MatrixNotFound() {
    when(matrixRepository.findById(2L)).thenReturn(Optional.empty());

    NotFoundException exception = assertThrows(NotFoundException.class, () -> matrixService.updateMatrix(2L, 12, 12));
    assertTrue(exception.getMessage().contains("Matrix ID 2 not found"));
  }

  @Test
  void updateMatrix_DroneOutOfBounds() {
    Drone droneOut = Drone.builder().id(200L).x(11).y(5).build();
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByMatrixId(1L)).thenReturn(List.of(droneOut));

    ConflictException exception = assertThrows(ConflictException.class, () -> matrixService.updateMatrix(1L, 10, 10));
    assertTrue(exception.getMessage().contains("Drone 200 is out of bounds"));
  }

  @Test
  void getMatrix_Success() {
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));

    Matrix result = matrixService.getMatrix(1L);

    assertNotNull(result);
    assertEquals(1L, result.getId());
  }

  @Test
  void deleteMatrix_Success() {
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByMatrixId(1L)).thenReturn(Collections.emptyList());
    doNothing().when(matrixRepository).delete(matrix);

    assertDoesNotThrow(() -> matrixService.deleteMatrix(1L));
    verify(matrixRepository).delete(matrix);
  }

  @Test
  void deleteMatrix_WithActiveDrones() {
    Drone droneActive = Drone.builder().id(300L).build();
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByMatrixId(1L)).thenReturn(List.of(droneActive));

    ConflictException exception = assertThrows(ConflictException.class, () -> matrixService.deleteMatrix(1L));
    assertTrue(exception.getMessage().contains("Active drones"));
  }

  @Test
  void listMatrices_ReturnsList() {
    when(matrixRepository.findAll()).thenReturn(List.of(matrix));

    List<Matrix> result = matrixService.listMatrices();

    assertNotNull(result);
    assertEquals(1, result.size());
  }
}
