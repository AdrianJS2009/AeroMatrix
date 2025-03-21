package com.drones.fct.service;

import java.util.List;

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
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));

    validatePosition(matrix, x, y);

    if (!droneRepository.findByXAndYAndMatrixId(x, y, matrixId).isEmpty()) {
      throw new ConflictException("Position conflict at (" + x + "," + y + ") in matrix " + matrixId);
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

  public Drone updateDrone(Long droneId, Long matrixId, String name, String model, int x, int y,
      Orientation orientation) {
    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone ID " + droneId + " not found"));

    Matrix newMatrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));

    validatePosition(newMatrix, x, y);

    // Check if new position is occupied by another drone
    if ((drone.getX() != x || drone.getY() != y || !drone.getMatrix().getId().equals(matrixId))
        && !droneRepository.findByXAndYAndMatrixId(x, y, matrixId).isEmpty()) {
      throw new ConflictException("Position (" + x + "," + y + ") in matrix " + matrixId + " is occupied");
    }

    drone.setMatrix(newMatrix);
    drone.setX(x);
    drone.setY(y);
    drone.setName(name);
    drone.setModel(model);
    drone.setOrientation(orientation);

    return droneRepository.save(drone);
  }

  public Drone deleteDrone(Long droneId) {
    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone ID " + droneId + " not found"));
    droneRepository.delete(drone);
    return drone;
  }

  public Drone getDrone(Long droneId) {
    return droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone ID " + droneId + " not found"));
  }

  public List<Drone> listDrones() {
    return droneRepository.findAll();
  }

  private void validatePosition(Matrix matrix, int x, int y) {
    if (x < 0 || x > matrix.getMaxX() || y < 0 || y > matrix.getMaxY()) {
      throw new ConflictException(
          "Invalid coordinates (" + x + "," + y + ") for matrix " + matrix.getId()
              + " (Max X: " + matrix.getMaxX() + ", Max Y: " + matrix.getMaxY() + ")");
    }
  }
}