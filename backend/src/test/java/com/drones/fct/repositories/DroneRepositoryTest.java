// package com.drones.fct.repositories;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertTrue;

// import java.util.List;
// import java.util.Optional;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
// import org.springframework.test.context.TestPropertySource;

// import com.drones.fct.domain.Drone;
// import com.drones.fct.domain.Matrix;
// import com.drones.fct.domain.Orientation;
// import com.drones.fct.repository.DroneRepository;
// import com.drones.fct.repository.MatrixRepository;

// @DataJpaTest
// @TestPropertySource(properties = {
// "spring.jpa.hibernate.ddl-auto=create-drop"
// })
// class DroneRepositoryTest {

// @Autowired
// private DroneRepository droneRepository;

// @Autowired
// private MatrixRepository matrixRepository;

// @Test
// void testSaveAndFindDrone() {

// Matrix matrix = Matrix.builder().maxX(10).maxY(10).build();
// matrix = matrixRepository.save(matrix);

// Drone drone = Drone.builder()
// .name("Test Drone")
// .model("Model X")
// .x(5)
// .y(5)
// .orientation(Orientation.N)
// .matrix(matrix)
// .build();
// drone = droneRepository.save(drone);

// Optional<Drone> foundDrone = droneRepository.findById(drone.getId());
// assertTrue(foundDrone.isPresent());
// assertEquals("Test Drone", foundDrone.get().getName());
// }

// @Test
// void testFindByXAndYAndMatrixId() {
// Matrix matrix = Matrix.builder().maxX(10).maxY(10).build();
// matrix = matrixRepository.save(matrix);

// Drone drone = Drone.builder()
// .name("Test Drone")
// .model("Model X")
// .x(5)
// .y(5)
// .orientation(Orientation.N)
// .matrix(matrix)
// .build();
// drone = droneRepository.save(drone);

// List<Drone> drones = droneRepository.findByXAndYAndMatrixId(5, 5,
// matrix.getId());
// assertFalse(drones.isEmpty());
// assertEquals(drone.getId(), drones.get(0).getId());
// }

// @Test
// void testFindByMatrixId() {
// Matrix matrix = Matrix.builder().maxX(10).maxY(10).build();
// matrix = matrixRepository.save(matrix);

// Drone drone1 = Drone.builder()
// .name("Drone1")
// .model("Model 1")
// .x(2)
// .y(3)
// .orientation(Orientation.N)
// .matrix(matrix)
// .build();
// Drone drone2 = Drone.builder()
// .name("Drone2")
// .model("Model 2")
// .x(4)
// .y(5)
// .orientation(Orientation.E)
// .matrix(matrix)
// .build();

// droneRepository.save(drone1);
// droneRepository.save(drone2);

// List<Drone> drones = droneRepository.findByMatrixId(matrix.getId());
// assertEquals(2, drones.size());
// }
// }
