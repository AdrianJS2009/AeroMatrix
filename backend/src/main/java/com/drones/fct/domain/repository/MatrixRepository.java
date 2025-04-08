package com.drones.fct.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drones.fct.domain.model.Matrix;

public interface MatrixRepository extends JpaRepository<Matrix, Long> {
  List<Matrix> findByMaxXAndMaxY(int maxX, int maxY);
}