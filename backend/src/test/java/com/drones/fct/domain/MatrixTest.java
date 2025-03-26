package com.drones.fct.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class MatrixTest {

  @Test
  void testMatrixBuilderAndDefaultDrones() {
    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    assertEquals(1L, matrix.getId());
    assertEquals(10, matrix.getMaxX());
    assertEquals(10, matrix.getMaxY());
    assertNotNull(matrix.getDrones());

    // Should be empty
    assertTrue(matrix.getDrones().isEmpty());
  }
}
