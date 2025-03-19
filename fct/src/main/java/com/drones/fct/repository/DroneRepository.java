package com.drones.fct.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drones.fct.domain.Drone;

public interface DroneRepository extends JpaRepository<Drone, Long> {
  List<Drone> findByXAndYAndMatrixId(Integer x, Integer y, Long matrixId);

  List<Drone> findByMatrixId(Long matrixId);
}