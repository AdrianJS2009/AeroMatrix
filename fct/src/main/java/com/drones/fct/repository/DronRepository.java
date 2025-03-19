package com.drones.fct.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drones.fct.domain.Dron;

public interface DronRepository extends JpaRepository<Dron, Long> {

}