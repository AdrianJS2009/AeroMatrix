package com.drones.fct.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.Orientation;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.repository.MatrixRepository;

@DataJpaTest
@ActiveProfiles("test")

class TestDroneRepository {

    @Autowired
    private DroneRepository droneRepository;

    @Autowired
    private MatrixRepository matrixRepository;

    private Matrix matrix1;
    private Matrix matrix2;

    @BeforeEach
    void setup() {
        // Testing matrices
        matrix1 = matrixRepository.save(new Matrix(100, 100));
        matrix2 = matrixRepository.save(new Matrix(200, 200));

        // Testing drones on matrices
        droneRepository.saveAll(List.of(
                Drone.builder().name("Drone1").x(5).y(5).matrix(matrix1).orientation(Orientation.N).build(),
                Drone.builder().name("Drone2").x(5).y(5).matrix(matrix1).orientation(Orientation.E).build(),
                Drone.builder().name("Drone3").x(10).y(10).matrix(matrix1).orientation(Orientation.S).build(),
                Drone.builder().name("Drone4").x(5).y(5).matrix(matrix2).orientation(Orientation.O).build()));
    }

    // ===================== findByXAndYAndMatrixId =====================
    @Test
    void findByXAndYAndMatrixIdExistingPositionReturnsDrones() {
        List<Drone> result = droneRepository.findByXAndYAndMatrixId(5, 5, matrix1.getId());

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(d -> d.getX() == 5 && d.getY() == 5));
        assertTrue(result.stream().anyMatch(d -> d.getName().equals("Drone1")));
        assertTrue(result.stream().anyMatch(d -> d.getName().equals("Drone2")));
    }

    @Test
    void findByXAndYAndMatrixIdNonExistingPositionReturnsEmpty() {
        List<Drone> result = droneRepository.findByXAndYAndMatrixId(99, 99, matrix1.getId());
        assertTrue(result.isEmpty());
    }

    @Test
    void findByXAndYAndMatrixIdDifferentMatrixReturnsEmpty() {
        List<Drone> result = droneRepository.findByXAndYAndMatrixId(5, 5, matrix2.getId());
        assertEquals(1, result.size());
        assertTrue(result.stream().anyMatch(d -> d.getName().equals("Drone4")));
    }

    // ===================== findByMatrixId =====================
    @Test
    void findByMatrixIdValidMatrixReturnsAllDrones() {
        List<Drone> result = droneRepository.findByMatrixId(matrix1.getId());
        assertEquals(3, result.size());
        assertTrue(result.stream().allMatch(d -> d.getMatrix().getId().equals(matrix1.getId())));
    }

    @Test
    void findByMatrixIdNonExistingMatrixReturnsEmpty() {
        List<Drone> result = droneRepository.findByMatrixId(999L);
        assertTrue(result.isEmpty());
    }

    @Test
    void findByMatrixIdEmptyMatrixReturnsEmpty() {
        Matrix emptyMatrix = matrixRepository.save(new Matrix(50, 50));
        List<Drone> result = droneRepository.findByMatrixId(emptyMatrix.getId());
        assertTrue(result.isEmpty());
    }

}