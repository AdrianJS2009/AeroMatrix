package com.drones.fct.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class DroneTest {

  @Test
  void testDroneBuilderAndGetters() {
    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    Drone drone = Drone.builder()
        .id(100L)
        .name("Test Drone")
        .model("Model X")
        .x(5)
        .y(5)
        .orientation(Orientation.N)
        .matrix(matrix)
        .build();

    assertEquals(100L, drone.getId());
    assertEquals("Test Drone", drone.getName());
    assertEquals("Model X", drone.getModel());
    assertEquals(5, drone.getX());
    assertEquals(5, drone.getY());
    assertEquals(Orientation.N, drone.getOrientation());
    assertNotNull(drone.getMatrix());
    assertEquals(1L, drone.getMatrix().getId());
  }
}
