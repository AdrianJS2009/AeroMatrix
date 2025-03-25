package com.drones.fct.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.Orientation;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.repository.MatrixRepository;
import com.drones.fct.service.DroneService;

@ExtendWith(MockitoExtension.class)
class DroneServiceTest {

  @Mock
  private DroneRepository droneRepository;

  @Mock
  private MatrixRepository matrixRepository;

  @InjectMocks
  private DroneService droneService;

  private Matrix matrix;
  private Drone drone;

  @BeforeEach
  void setUp() {
    matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    drone = Drone.builder()
        .id(100L)
        .name("Drone A")
        .model("Model X")
        .x(5)
        .y(5)
        .orientation(Orientation.N)
        .matrix(matrix)
        .build();
  }

  // --- createDrone tests ---

  @Test
  void createDrone_Success() {
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByXAndYAndMatrixId(5, 5, 1L)).thenReturn(Collections.emptyList());
    when(droneRepository.save(any(Drone.class))).thenReturn(drone);

    Drone result = droneService.createDrone(1L, "Drone A", "Model X", 5, 5, Orientation.N);

    assertNotNull(result);
    assertEquals(100L, result.getId());
    verify(matrixRepository).findById(1L);
    verify(droneRepository).save(any(Drone.class));
  }

  @Test
  void createDrone_MatrixNotFound() {
    when(matrixRepository.findById(2L)).thenReturn(Optional.empty());

    NotFoundException exception = assertThrows(NotFoundException.class,
        () -> droneService.createDrone(2L, "Drone B", "Model Y", 3, 3, Orientation.E));
    assertTrue(exception.getMessage().contains("Matrix ID 2 not found"));
  }

  @Test
  void createDrone_PositionConflict() {
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));

    when(droneRepository.findByXAndYAndMatrixId(5, 5, 1L))
        .thenReturn(Collections.singletonList(new Drone()));

    ConflictException exception = assertThrows(ConflictException.class,
        () -> droneService.createDrone(1L, "Drone C", "Model Z", 5, 5, Orientation.S));
    assertTrue(exception.getMessage().contains("Position conflict"));
  }

  // --- updateDrone tests ---

  @Test
  void updateDrone_Success() {

    Drone updatedDrone = Drone.builder()
        .id(100L)
        .name("Drone A Updated")
        .model("Model X")
        .x(6)
        .y(6)
        .orientation(Orientation.E)
        .matrix(matrix)
        .build();

    when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));

    when(droneRepository.findByXAndYAndMatrixId(6, 6, 1L)).thenReturn(Collections.emptyList());
    when(droneRepository.save(any(Drone.class))).thenReturn(updatedDrone);

    Drone result = droneService.updateDrone(100L, 1L, "Drone A Updated", "Model X", 6, 6, Orientation.E);

    assertNotNull(result);
    assertEquals("Drone A Updated", result.getName());
    assertEquals(6, result.getX());
    assertEquals(6, result.getY());
  }

  @Test
  void updateDrone_DroneNotFound() {
    when(droneRepository.findById(200L)).thenReturn(Optional.empty());

    NotFoundException exception = assertThrows(NotFoundException.class,
        () -> droneService.updateDrone(200L, 1L, "Drone NotFound", "Model", 2, 2, Orientation.O));
    assertTrue(exception.getMessage().contains("Drone ID 200 not found"));
  }

  @Test
  void updateDrone_MatrixNotFound() {
    when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));
    when(matrixRepository.findById(2L)).thenReturn(Optional.empty());

    NotFoundException exception = assertThrows(NotFoundException.class,
        () -> droneService.updateDrone(100L, 2L, "Drone A", "Model X", 5, 5, Orientation.N));
    assertTrue(exception.getMessage().contains("Matrix ID 2 not found"));
  }

  @Test
  void updateDrone_PositionConflict() {

    Drone otherDrone = Drone.builder().id(101L).build();

    when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));
    when(matrixRepository.findById(1L)).thenReturn(Optional.of(matrix));

    when(droneRepository.findByXAndYAndMatrixId(5, 5, 1L))
        .thenReturn(List.of(otherDrone));

    ConflictException exception = assertThrows(ConflictException.class,
        () -> droneService.updateDrone(100L, 1L, "Drone A", "Model X", 5, 5, Orientation.N));
    assertTrue(exception.getMessage().contains("Position (5,5) in matrix 1 is occupied"));
  }

  // --- deleteDrone, getDrone y listDrones ---

  @Test
  void deleteDrone_Success() {
    when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));
    doNothing().when(droneRepository).delete(drone);

    Drone result = droneService.deleteDrone(100L);

    assertNotNull(result);
    assertEquals(100L, result.getId());
    verify(droneRepository).delete(drone);
  }

  @Test
  void getDrone_Success() {
    when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));

    Drone result = droneService.getDrone(100L);

    assertNotNull(result);
    assertEquals(100L, result.getId());
  }

  @Test
  void listDrones_ReturnsList() {
    when(droneRepository.findAll()).thenReturn(List.of(drone));

    List<Drone> result = droneService.listDrones();

    assertNotNull(result);
    assertFalse(result.isEmpty());
    assertEquals(1, result.size());
  }
}
