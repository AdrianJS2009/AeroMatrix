package com.drones.fct.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
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
class TestDroneService {

  @Mock
  private DroneRepository droneRepository;

  @Mock
  private MatrixRepository matrixRepository;

  @InjectMocks
  private DroneService droneService;

  private static final Long VALID_MATRIX_ID = 1L;
  private static final Long VALID_DRONE_ID = 1L;
  private static final Long INVALID_DRONE_ID = 999L;

  private Matrix matrix;
  private Drone drone;

  @BeforeEach
  void setUp() {
    matrix = new Matrix();
    matrix.setId(VALID_MATRIX_ID);
    matrix.setMaxX(10);
    matrix.setMaxY(10);

    drone = Drone.builder()
        .id(VALID_DRONE_ID)
        .name("Drone1")
        .model("X200")
        .x(5)
        .y(5)
        .orientation(Orientation.N)
        .matrix(matrix)
        .build();
  }

  // ------------------ CREATE DRONE ------------------
  @Test
  void createDrone_ValidData_ReturnsDrone() {
    when(matrixRepository.findById(VALID_MATRIX_ID)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByXAndYAndMatrixId(5, 5, VALID_MATRIX_ID))
        .thenReturn(Collections.emptyList());
    when(droneRepository.save(any(Drone.class))).thenReturn(drone);

    Drone createdDrone = droneService.createDrone(VALID_MATRIX_ID, "Drone1", "X200", 5, 5, Orientation.N);

    assertNotNull(createdDrone);
    assertEquals("Drone1", createdDrone.getName());
    verify(droneRepository).save(any(Drone.class));
  }

  @Test
  void createDrone_MatrixNotFound_ThrowsNotFoundException() {
    when(matrixRepository.findById(VALID_MATRIX_ID)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class,
        () -> droneService.createDrone(VALID_MATRIX_ID, "Drone1", "X200", 5, 5, Orientation.N));
  }

  @Test
  void createDrone_PositionOccupied_ThrowsConflictException() {
    when(matrixRepository.findById(VALID_MATRIX_ID)).thenReturn(Optional.of(matrix));
    when(droneRepository.findByXAndYAndMatrixId(5, 5, VALID_MATRIX_ID))
        .thenReturn(Collections.singletonList(drone));

    assertThrows(ConflictException.class,
        () -> droneService.createDrone(VALID_MATRIX_ID, "Drone1", "X200", 5, 5, Orientation.N));
  }

  @Test
  void createDrone_InvalidPosition_ThrowsIllegalArgumentException() {
    when(matrixRepository.findById(VALID_MATRIX_ID)).thenReturn(Optional.of(matrix));

    assertThrows(IllegalArgumentException.class,
        () -> droneService.createDrone(VALID_MATRIX_ID, "Drone1", "X200", 15, 15, Orientation.N));
  }

  // ------------------ UPDATE DRONE ------------------
  @Test
  void updateDrone_ValidData_ReturnsUpdatedDrone() {
    when(droneRepository.findById(VALID_DRONE_ID)).thenReturn(Optional.of(drone));
    when(droneRepository.findByXAndYAndMatrixId(anyInt(), anyInt(), anyLong()))
        .thenReturn(Collections.emptyList());
    when(droneRepository.save(any(Drone.class))).thenReturn(drone);

    Drone updatedDrone = droneService.updateDrone(VALID_DRONE_ID, VALID_MATRIX_ID, "UpdatedName", "X300", 7, 7,
        Orientation.E);

    assertNotNull(updatedDrone);
    assertEquals("UpdatedName", updatedDrone.getName());
    verify(droneRepository).save(any(Drone.class));
  }

  @Test
  void updateDrone_DroneNotFound_ThrowsNotFoundException() {
    when(droneRepository.findById(VALID_DRONE_ID)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class,
        () -> droneService.updateDrone(VALID_DRONE_ID, VALID_MATRIX_ID, "UpdatedName", "X300", 7, 7, Orientation.E));
  }

  @Test
  void updateDrone_PositionOccupied_ThrowsConflictException() {
    when(droneRepository.findById(VALID_DRONE_ID)).thenReturn(Optional.of(drone));
    when(droneRepository.findByXAndYAndMatrixId(7, 7, VALID_MATRIX_ID))
        .thenReturn(Collections.singletonList(new Drone()));

    assertThrows(ConflictException.class,
        () -> droneService.updateDrone(VALID_DRONE_ID, VALID_MATRIX_ID, "UpdatedName", "X300", 7, 7, Orientation.E));
  }

  // ------------------ DELETE DRONE ------------------
  @Test
  void deleteDrone_ValidId_DeletesDrone() {
    when(droneRepository.findById(VALID_DRONE_ID)).thenReturn(Optional.of(drone));

    droneService.deleteDrone(VALID_DRONE_ID);

    verify(droneRepository).delete(drone);
  }

  @Test
  void deleteDrone_DroneNotFound_ThrowsNotFoundException() {
    when(droneRepository.findById(INVALID_DRONE_ID)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> droneService.deleteDrone(INVALID_DRONE_ID));
  }

  // ------------------ GET DRONE ------------------
  @Test
  void getDrone_ValidId_ReturnsDrone() {
    when(droneRepository.findById(VALID_DRONE_ID)).thenReturn(Optional.of(drone));

    Drone foundDrone = droneService.getDrone(VALID_DRONE_ID);

    assertNotNull(foundDrone);
    assertEquals("Drone1", foundDrone.getName());
  }

  @Test
  void getDrone_DroneNotFound_ThrowsNotFoundException() {
    when(droneRepository.findById(INVALID_DRONE_ID)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> droneService.getDrone(INVALID_DRONE_ID));
  }
}
