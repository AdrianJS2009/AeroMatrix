package com.drones.fct.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drones.fct.domain.Drone;

public interface DronRepository extends JpaRepository<Drone, Long> {
  List<Drone> findByXAndMatrixId(Integer x, Integer y, Long matrixId);

  List<Drone> findByMatrixId(Long matrixId);
}