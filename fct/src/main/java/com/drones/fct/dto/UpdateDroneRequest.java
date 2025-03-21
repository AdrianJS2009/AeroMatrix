package com.drones.fct.dto;

import com.drones.fct.domain.Orientation;

import lombok.Value;

@Value
public class UpdateDroneRequest {
        Long matrixId;
        String name;
        String model;
        int x;
        int y;
        Orientation orientation;
}