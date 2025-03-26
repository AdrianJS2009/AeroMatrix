package com.drones.fct.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class OrientationTest {

  @Test
  void testTurnLeft() {
    // N -> O, S -> E, E -> N, O -> S
    assertEquals(Orientation.O, Orientation.N.turnLeft(), "N.turnLeft() should be O");
    assertEquals(Orientation.E, Orientation.S.turnLeft(), "S.turnLeft() should be E");
    assertEquals(Orientation.N, Orientation.E.turnLeft(), "E.turnLeft() should be N");
    assertEquals(Orientation.S, Orientation.O.turnLeft(), "O.turnLeft() should be S");
  }

  @Test
  void testTurnRight() {
    // N -> E, S -> O, E -> S, O -> N
    assertEquals(Orientation.E, Orientation.N.turnRight(), "N.turnRight() should be E");
    assertEquals(Orientation.O, Orientation.S.turnRight(), "S.turnRight() should be O");
    assertEquals(Orientation.S, Orientation.E.turnRight(), "E.turnRight() should be S");
    assertEquals(Orientation.N, Orientation.O.turnRight(), "O.turnRight() should be N");
  }
}
