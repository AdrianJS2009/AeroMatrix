package com.drones.fct.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "matrix")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Matrix {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "max_x", nullable = false)
  private int maxX;

  @Column(name = "max_y", nullable = false)
  private int maxY;

  @OneToMany(mappedBy = "matrix", fetch = FetchType.LAZY)
  @Builder.Default
  private List<Drone> drones = new ArrayList<>();

  public Matrix(int maxX, int maxY) {
    this.maxX = maxX;
    this.maxY = maxY;
  }

}
