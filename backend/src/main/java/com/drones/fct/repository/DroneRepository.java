package com.drones.fct.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drones.fct.domain.Drone;

public interface DroneRepository extends JpaRepository<Drone, Long> {
  List<Drone> findByXAndYAndMatrixId(int x, int y, Long matrixId);

  List<Drone> findByMatrixId(Long matrixId);

  boolean existsByModelAndMatrixId(String model, Long matrixId);

  @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Drone d WHERE d.name = :name AND d.matrix.id = :matrixId")
  boolean existsByNameAndMatrixId(@Param("name") String name, @Param("matrixId") Long matrixId);

}