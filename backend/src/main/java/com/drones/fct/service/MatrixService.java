package com.drones.fct.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.repository.MatrixRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MatrixService {

  private final MatrixRepository matrixRepository;
  private final DroneRepository droneRepository;

  public Matrix createMatrix(Integer maxX, Integer maxY) {
    if (maxX <= 0 || maxY <= 0) {
      throw new ConflictException("Matrix dimensions must be positive (maxX: " + maxX + ", maxY: " + maxY + ")");
    }
    Matrix matrix = Matrix.builder()
        .maxX(maxX)
        .maxY(maxY)
        .build();
    return matrixRepository.save(matrix);
  }

  public Matrix updateMatrix(Long matrixId, Integer maxX, Integer maxY) {
    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));

    List<Drone> drones = droneRepository.findByMatrixId(matrixId);
    for (Drone drone : drones) {
      if (drone.getX() >= maxX || drone.getY() >= maxY) {
        throw new ConflictException(
            "Drone " + drone.getId() + " is out of bounds for new matrix size (maxX: " + maxX + ", maxY: " + maxY
                + ")");
      }
    }

    matrix.setMaxX(maxX);
    matrix.setMaxY(maxY);
    return matrixRepository.save(matrix);
  }

  public Matrix getMatrix(Long matrixId) {
    return matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));
  }

  public void deleteMatrix(Long matrixId) {
    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new NotFoundException("Matrix ID " + matrixId + " not found"));

    List<Drone> drones = droneRepository.findByMatrixId(matrixId);
    if (!drones.isEmpty()) {
      String droneIds = drones.stream()
          .map(d -> String.valueOf(d.getId()))
          .collect(Collectors.joining(", "));
      throw new ConflictException(
          "Cannot delete matrix " + matrixId + ". Active drones: " + droneIds);
    }

    matrixRepository.delete(matrix);
  }

  public List<Matrix> listMatrices() {
    return matrixRepository.findAll();
  }

}
