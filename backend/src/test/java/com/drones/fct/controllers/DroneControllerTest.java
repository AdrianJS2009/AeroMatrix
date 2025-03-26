package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.drones.fct.controller.DroneController;
import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.Orientation;
import com.drones.fct.dto.CreateDroneRequest;
import com.drones.fct.service.DroneService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(DroneController.class)
class DroneControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private DroneService droneService;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void createDrone_ReturnsCreated() throws Exception {
    CreateDroneRequest request = new CreateDroneRequest();
    request.setMatrixId(1L);
    request.setName("Drone Test");
    request.setModel("Model T");
    request.setX(2);
    request.setY(3);
    request.setOrientation(Orientation.E);

    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    Drone drone = Drone.builder()
        .id(10L)
        .name("Drone Test")
        .model("Model T")
        .x(2)
        .y(3)
        .orientation(Orientation.E)
        .matrix(matrix)
        .build();

    when(droneService.createDrone(any(Long.class), any(String.class), any(String.class),
        any(Integer.class), any(Integer.class), any(Orientation.class)))
        .thenReturn(drone);

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(10))
        .andExpect(jsonPath("$.name").value("Drone Test"))
        .andExpect(jsonPath("$.matrixId").value(1));
  }

  @Test
  void getDrone_ReturnsDrone() throws Exception {
    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    Drone drone = Drone.builder()
        .id(20L)
        .name("Drone Get")
        .model("Model G")
        .x(3)
        .y(4)
        .orientation(Orientation.N)
        .matrix(matrix)
        .build();

    when(droneService.getDrone(20L)).thenReturn(drone);

    mockMvc.perform(get("/api/drones/20"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(20))
        .andExpect(jsonPath("$.name").value("Drone Get"));
  }

  @Test
  void deleteDrone_ReturnsOk() throws Exception {
    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    Drone drone = Drone.builder()
        .id(30L)
        .name("Drone Delete")
        .matrix(matrix)
        .build();

    when(droneService.deleteDrone(30L)).thenReturn(drone);

    mockMvc.perform(delete("/api/drones/30"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Drone ID 30 deleted from database and all associated matrices"));
  }

  // TODO: Add tests for updateDrone and listDrones

}
