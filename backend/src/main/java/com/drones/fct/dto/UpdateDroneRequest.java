package com.drones.fct.dto;

import com.drones.fct.domain.Orientation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDroneRequest {

        @NotNull(message = "Matrix ID is required")
        @Schema(description = "ID of the matrix")
        private Long matrixId;

        @NotBlank(message = "Drone name is required")
        @Schema(description = "Drone name")
        private String name;

        @NotBlank(message = "Drone model is required")
        @Schema(description = "Drone model")
        private String model;

        @Min(value = 0, message = "X coordinate must be non-negative")
        @Schema(description = "X coordinate of the drone")
        private int x;

        @Min(value = 0, message = "Y coordinate must be non-negative")
        @Schema(description = "Y coordinate of the drone")
        private int y;

        @NotNull(message = "Orientation is required")
        @Schema(description = "Drone orientation")
        private Orientation orientation;
}
