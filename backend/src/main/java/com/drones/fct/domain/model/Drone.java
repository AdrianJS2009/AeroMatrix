package com.drones.fct.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "drones")
@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class Drone {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(nullable = false, length = 50)
  private String model;

  @Column(name = "pos_x", nullable = false)
  private int x;

  @Column(name = "pos_y", nullable = false)
  private int y;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 1)
  private Orientation orientation;

  // El Lazy es para que no se cargue la matriz al cargar el dron
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "matrix_id")
  private Matrix matrix;

  public void move(char command, Matrix matrix) {
    switch (command) {
      case 'L':
        this.orientation = this.orientation.turnLeft();
        break;
      case 'R':
        this.orientation = this.orientation.turnRight();
        break;
      case 'M':
        int newX = this.x;
        int newY = this.y;
        switch (this.orientation) {
          case N -> newY++;
          case S -> newY--;
          case E -> newX++;
          case O -> newX--;
        }
        if (newX < 0 || newY < 0 || newX > matrix.getMaxX() || newY > matrix.getMaxY()) {
          throw new IllegalStateException("Movement out of bounds: (" + newX + "," + newY + ")");
        }
        this.x = newX;
        this.y = newY;
        break;
      default:
        throw new IllegalArgumentException("Invalid command: " + command);
    }
  }

}