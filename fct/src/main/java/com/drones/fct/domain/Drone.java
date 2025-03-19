package com.drones.fct.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Drone {
  @Entity
  @Table(name = "drones")
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor

  @Builder
  public class Drone {
    @id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String model;

    @Column(name = "pos_x", nullable = false)
    private Integer x;

    @Column(name = "pos_y", nullable = false)
    private Integer y;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Orientation orientation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "matrix_id")
    private Matrix matrix;
  }
}
