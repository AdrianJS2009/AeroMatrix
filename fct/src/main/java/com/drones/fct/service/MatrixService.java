package com.drones.fct.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
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
      throw new IllegalArgumentException("Invalid matrix size");
    }
    Matrix matrix = Matrix.builder()
        .maxX(maxX)
        .maxY(maxY)
        .build();
    return matrixRepository.save(matrix);
  }

  public Matrix updateMatrix(Long matrixId, Integer maxX, Integer maxY) {
    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new IllegalArgumentException("Matrix not found"));

    // Check current drones
    List<Drone> drones = droneRepository.findByMatrixId(matrixId);
    for (Drone drone : drones) {
      if (drone.getX() >= maxX || drone.getY() >= maxY) {
        throw new IllegalArgumentException("Invalid matrix size");
      }
    }

    matrix.setMaxX(maxX);
    matrix.setMaxY(maxY);
    return matrixRepository.save(matrix);
  }

  public Matrix getMatrix(Long matrixId) {
    return matrixRepository.findById(matrixId)
        .orElseThrow(() -> new IllegalArgumentException("Matrix not found"));
  }

  public void deleteMatrix(Long matrixId) {
    Matrix matrix = matrixRepository.findById(matrixId)
        .orElseThrow(() -> new IllegalArgumentException("Matrix not found"));
    matrixRepository.delete(matrix);
  }

}
