package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
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
import com.drones.fct.exception.NotFoundException;
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
  void createDrone_ValidRequest_ReturnsCreated() throws Exception {
    CreateDroneRequest request = new CreateDroneRequest();
    request.setMatrixId(1L);
    request.setName("Drone1");
    request.setModel("X200");
    request.setX(0);
    request.setY(0);
    request.setOrientation(Orientation.N);

    Matrix mockMatrix = new Matrix();
    mockMatrix.setId(1L);

    Drone mockDrone = new Drone();
    mockDrone.setId(1L);
    mockDrone.setMatrix(mockMatrix);
    when(droneService.createDrone(anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
        .thenReturn(mockDrone);

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getDrone_NotFound_Returns404() throws Exception {
    when(droneService.getDrone(anyLong())).thenThrow(new NotFoundException("Drone no encontrado"));

    mockMvc.perform(get("/api/drones/999"))
        .andExpect(status().isNotFound());
  }

  @Test
  void deleteDrone_Success_Returns204() throws Exception {
    mockMvc.perform(delete("/api/drones/1"))
        .andExpect(status().isNoContent());
    verify(droneService).deleteDrone(1L);
  }
}
