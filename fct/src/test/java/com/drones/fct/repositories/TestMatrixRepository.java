package com.drones.fct.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.drones.fct.domain.Matrix;
import com.drones.fct.repository.MatrixRepository;

@DataJpaTest
class TestMatrixRepository {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private MatrixRepository repository;

  @Test
  void findByMaxDimensions_ReturnsCorrectMatrices() {
    // Crear Matrix usando setters
    Matrix matrix1 = new Matrix();
    matrix1.setMaxX(10);
    matrix1.setMaxY(10);
    entityManager.persist(matrix1);

    Matrix matrix2 = new Matrix();
    matrix2.setMaxX(5);
    matrix2.setMaxY(5);
    entityManager.persist(matrix2);

    // Usar el método correcto del repositorio (debe existir en MatrixRepository)
    List<Matrix> result = repository.findByMaxXAndMaxY(10, 10);
    assertEquals(1, result.size());
  }
}