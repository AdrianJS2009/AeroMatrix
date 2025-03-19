package com.drones.fct.domain;

public enum Orientation {
  N, S, E, O;

  public Orientation turnLeft() {
    return switch (this) {
      case N -> O;
      case S -> E;
      case E -> N;
      case O -> S;
    };
  }

  public Orientation turnRight() {
    return switch (this) {
      case N -> E;
      case S -> O;
      case E -> S;
      case O -> N;
    };
  }
}
