// package com.drones.fct.repositories;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertTrue;

// import java.util.List;
// import java.util.Optional;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

// import com.drones.fct.domain.Matrix;
// import com.drones.fct.repository.MatrixRepository;

// @DataJpaTest
// class MatrixRepositoryTest {

// @Autowired
// private MatrixRepository matrixRepository;

// @Test
// void testSaveAndFindMatrix() {
// Matrix matrix = Matrix.builder().maxX(10).maxY(10).build();
// matrix = matrixRepository.save(matrix);

// Optional<Matrix> foundMatrix = matrixRepository.findById(matrix.getId());
// assertTrue(foundMatrix.isPresent());
// assertEquals(10, foundMatrix.get().getMaxX());
// assertEquals(10, foundMatrix.get().getMaxY());
// }

// @Test
// void testFindByMaxXAndMaxY() {
// Matrix matrix = Matrix.builder().maxX(15).maxY(20).build();
// matrixRepository.save(matrix);

// List<Matrix> matrices = matrixRepository.findByMaxXAndMaxY(15, 20);
// assertFalse(matrices.isEmpty());
// assertEquals(15, matrices.get(0).getMaxX());
// assertEquals(20, matrices.get(0).getMaxY());
// }
// }
