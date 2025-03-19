package com.drones.fct.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.repository.MatrixRepository;
import com.drones.fct.service.MatrixService;

@ExtendWith(MockitoExtension.class)
class TestMatrixService {

  @Mock
  private MatrixRepository matrixRepository;

  @InjectMocks
  private MatrixService matrixService;

  @Test
  void createMatrix_InvalidSize_ThrowsException() {
    assertThrows(IllegalArgumentException.class, () -> matrixService.createMatrix(-5, 10) // Tamaño negativo
    );
  }

  @Test
  void deleteMatrix_WithDrones_ThrowsConflict() {
    Matrix matrix = new Matrix();
    matrix.setMaxX(10);
    matrix.setMaxY(10);
    Drone drone = new Drone();
    drone.setName("Drone1");
    matrix.setDrones(Collections.singletonList(drone)); // Usar lista válida

    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));

    assertThrows(ConflictException.class, () -> matrixService.deleteMatrix(1L));
  }
}