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
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("Drone name must not be empty.");
    }
    if (model == null || model.trim().isEmpty()) {
      throw new IllegalArgumentException("Drone model must not be empty.");
    }
    if (orientation == null) {
      throw new IllegalArgumentException("Drone orientation must be provided.");
    }

    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));

    validatePosition(matrix, x, y);

    if (droneRepository.existsByNameAndMatrixId(name, matrixId)) {
      throw new ConflictException("A drone with the name '" + name + "' already exists in matrix " + matrixId);
    }
    if (droneRepository.existsByModelAndMatrixId(model, matrixId)) {
      throw new ConflictException("A drone with the model '" + model + "' already exists in matrix " + matrixId);
    }

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
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("Drone name must not be empty.");
    }
    if (model == null || model.trim().isEmpty()) {
      throw new IllegalArgumentException("Drone model must not be empty.");
    }
    if (orientation == null) {
      throw new IllegalArgumentException("Drone orientation must be provided.");
    }

    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone ID " + droneId + " not found"));

    Matrix newMatrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));

    validatePosition(newMatrix, x, y);

    if (!drone.getName().equals(name) && droneRepository.existsByNameAndMatrixId(name, matrixId)) {
      throw new ConflictException("A drone with the name '" + name + "' already exists in matrix " + matrixId);
    }
    if (!drone.getModel().equals(model) && droneRepository.existsByModelAndMatrixId(model, matrixId)) {
      throw new ConflictException("A drone with the model '" + model + "' already exists in matrix " + matrixId);
    }

    if ((drone.getX() != x || drone.getY() != y || !drone.getMatrix().getId().equals(matrixId))
        && !droneRepository.findByXAndYAndMatrixId(x, y, matrixId).isEmpty()) {
      throw new ConflictException("Position (" + x + "," + y + ") in matrix " + matrixId + " is occupied");
    }

    if (drone.getX() == x && drone.getY() == y &&
        drone.getOrientation() == orientation &&
        drone.getMatrix().getId().equals(matrixId) &&
        drone.getName().equals(name) &&
        drone.getModel().equals(model)) {
      throw new ConflictException("No changes detected in the drone update.");
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