package com.drones.fct.service;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.Orientation;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.repository.MatrixRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor

public class DroneService {
  private final DroneRepository droneRepository;
  private final MatrixRepository matrixRepository;

  public Drone createDrone(Long matrixId, String name, String model, int x, int y, Orientation orientation) {
    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix not found"));

    validatePosition(matrix, x, y);

    // Checking collisions with other drones
    if (droneRepository.findByXAndMatrixId(x, y, matrixId).IsEmpty()) {
      throw new ConflictException("There is already a drone in that position");
    }

    Drone drone = Drone.builder()
        .name(name)
        .model(model)
        .x(x)
        .y(y)
        .orientation(orientation)
        .matrix(matrix)
        .build();

    return droneRepository.save(drone);
  }

  public Drone updateDrone(Long droneId, int x, int y, String name, String model, Orientation orientation) {
    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone not found"));

    Matrix matrix = drone.getMatrix();

    validatePosition(matrix, x, y);

    // Checking collisions with other drones if the position changes
    if ((drone.getX() != x || drone.getY() != y)
        && droneRepository.findByXAndMatrixId(x, y, matrix.getId()).isEmpty()) {
      throw new ConflictException("There is already a drone in that position");
    }

    drone.setName(name);
    drone.setModel(model);
    drone.setX(x);
    drone.setY(y);
    drone.setOrientation(orientation);

    return droneRepository.save(drone);
  }

  public void deleteDrone(Long droneId) {
    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone not found"));

    droneRepository.delete(drone);
  }

  public Drone getDrone(Long droneId) {
    return droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone not found"));
  }

  private void validatePosition(Matrix matrix, int x, int y) {
    if (x < 0 || x >= matrix.getMaxX() || y < 0 || y >= matrix.getMaxY()) {
      throw new IllegalArgumentException("Coords out of bounds");
    }
  }

}
