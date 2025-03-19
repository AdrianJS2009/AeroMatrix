package com.drones.fct.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.Orientation;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.repository.MatrixRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DroneService {

  private final DroneRepository droneRepository;
  private final MatrixRepository matrixRepository;

  public Drone createDrone(Long matrixId, String name, String model, int x, int y, Orientation orientation) {
    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matriz no encontrada"));

    validatePosition(matrix, x, y);

    // Check if there is a drone iin that position
    if (droneRepository.findByXAndYAndMatrixId(x, y, matrixId).isPresent()) {
      throw new ConflictException("Ya existe un dron en esa posición");
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

  public Drone updateDrone(Long droneId, String name, String model, int x, int y, Orientation orientation) {
    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone not found"));

    Matrix matrix = drone.getMatrix();
    validatePosition(matrix, x, y);

    // If pos changes check if there is a drone in the same position
    if ((drone.getX() != x || drone.getY() != y) &&
        droneRepository.findByXAndYAndMatrixId(x, y, matrix.getId()).isPresent()) {
      throw new ConflictException("Ya existe un dron en esa posición");
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
    if (x < 0 || x > matrix.getMaxX() || y < 0 || y > matrix.getMaxY()) {
      throw new IllegalArgumentException("Coords out of bounds");
    }
  }

}
