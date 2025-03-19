package com.drones.fct.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drones.fct.domain.Matrix;

public interface MatrixRepository extends JpaRepository<Matrix, Long> {

}
