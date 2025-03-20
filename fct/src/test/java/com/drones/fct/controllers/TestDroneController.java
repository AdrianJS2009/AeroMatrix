package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.drones.fct.controller.DroneController;
import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.Orientation;
import com.drones.fct.dto.CreateDroneRequest;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.service.DroneService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(DroneController.class)
class TestDroneController {

  private static final Long VALID_DRONE_ID = 1L;
  private static final Long INVALID_DRONE_ID = 999L;
  private static final Long VALID_MATRIX_ID = 1L;
  private static final Long INVALID_MATRIX_ID = 999L;
  private static final int MAX_MATRIX_SIZE = 100;
  private static final int INVALID_POSITION = MAX_MATRIX_SIZE + 1;

  @Autowired
  private MockMvc mockMvc;

  @Mock
  private DroneService droneService;

  @Autowired
  private ObjectMapper objectMapper;

  // --------------------- COORDENATES ---------------------
  @Test
  void createDrone_EdgeCoordinates_ReturnsCreated() throws Exception {
    CreateDroneRequest request = buildValidCreateRequest();
    request.setX(MAX_MATRIX_SIZE);
    request.setY(MAX_MATRIX_SIZE);

    Drone mockDrone = buildDrone(VALID_DRONE_ID, "EdgeDrone", Orientation.N, MAX_MATRIX_SIZE, MAX_MATRIX_SIZE);
    when(droneService.createDrone(anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
        .thenReturn(mockDrone);

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated());
  }

  @Test
  void createDrone_ExceedsMaxCoordinates_Returns400() throws Exception {
    CreateDroneRequest request = buildValidCreateRequest();
    request.setX(INVALID_POSITION);
    request.setY(INVALID_POSITION);

    when(droneService.createDrone(anyLong(), any(), any(), anyInt(), anyInt(), any()))
        .thenThrow(new IllegalArgumentException("Position out of bounds"));

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  // --------------------- INVALID ORIENTATIONS ---------------------
  @Test
  void createDrone_AllValidOrientations_ReturnsCreated() throws Exception {
    for (Orientation orientation : Orientation.values()) {
      CreateDroneRequest request = buildValidCreateRequest();
      request.setOrientation(orientation);

      Drone mockDrone = buildDrone(VALID_DRONE_ID, "Drone-" + orientation.name(), orientation, 0, 0);
      when(droneService.createDrone(anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
          .thenReturn(mockDrone);

      mockMvc.perform(post("/api/drones")
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.orientation").value(orientation.name()));
    }
  }

  // --------------------- PERFORMANCE ---------------------
  @Test
  void createMultipleDrones_StressTest_ReturnsAllCreated() {
    IntStream.range(0, 100).parallel().forEach(i -> {
      try {
        CreateDroneRequest request = buildValidCreateRequest();
        request.setName("Drone-" + i);

        Drone mockDrone = buildDrone((long) i, "Drone-" + i, Orientation.N, i % 10, i % 10);
        when(droneService.createDrone(anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
            .thenReturn(mockDrone);

        mockMvc.perform(post("/api/drones")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated());
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    });
  }

  // ===================== HELPER METHODS =====================

  private CreateDroneRequest buildValidCreateRequest() {
    CreateDroneRequest request = new CreateDroneRequest();
    request.setMatrixId(VALID_MATRIX_ID);
    request.setName("Drone1");
    request.setModel("X200");
    request.setX(0);
    request.setY(0);
    request.setOrientation(Orientation.N);
    return request;
  }

  private Drone buildDrone(Long id, String name, Orientation orientation, int x, int y) {
    Matrix matrix = new Matrix();
    matrix.setId(VALID_MATRIX_ID);
    matrix.setMaxX(MAX_MATRIX_SIZE);
    matrix.setMaxY(MAX_MATRIX_SIZE);

    return Drone.builder()
        .id(id)
        .name(name)
        .model("X200")
        .x(x)
        .y(y)
        .orientation(orientation)
        .matrix(matrix)
        .build();
  }

  // --------------------- CREATION OF DRONES ---------------------
  @Test
  void createDrone_ValidRequest_ReturnsCreated() throws Exception {
    CreateDroneRequest request = buildValidCreateRequest();
    Drone mockDrone = buildDrone(VALID_DRONE_ID, "Drone1", Orientation.N, 0, 0);

    when(droneService.createDrone(anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
        .thenReturn(mockDrone);

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpectAll(
            status().isCreated(),
            jsonPath("$.id").value(VALID_DRONE_ID),
            jsonPath("$.name").value("Drone1"),
            jsonPath("$.model").value("X200"),
            jsonPath("$.orientation").value("N"),
            jsonPath("$.x").value(0),
            jsonPath("$.y").value(0),
            jsonPath("$.matrixId").value(VALID_MATRIX_ID));
  }

  @Test
  void createDrone_MatrixNotFound_Returns404() throws Exception {
    CreateDroneRequest request = buildValidCreateRequest();
    request.setMatrixId(INVALID_MATRIX_ID);

    when(droneService.createDrone(anyLong(), any(), any(), anyInt(), anyInt(), any()))
        .thenThrow(new NotFoundException("Matriz no encontrada"));

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound());
  }

  @Test
  void createDrone_InvalidPosition_Returns400() throws Exception {
    CreateDroneRequest request = buildValidCreateRequest();
    request.setX(INVALID_POSITION);

    when(droneService.createDrone(anyLong(), any(), any(), anyInt(), anyInt(), any()))
        .thenThrow(new IllegalArgumentException("Posición inválida"));

    mockMvc.perform(post("/api/drones")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  // --------------------- GETTING DRONES ---------------------
  @Test
  void getDrone_Success_ReturnsDroneDetails() throws Exception {
    Drone mockDrone = buildDrone(VALID_DRONE_ID, "Drone1", Orientation.N, 0, 0);
    when(droneService.getDrone(VALID_DRONE_ID)).thenReturn(mockDrone);

    mockMvc.perform(get("/api/drones/{id}", VALID_DRONE_ID))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.id").value(VALID_DRONE_ID),
            jsonPath("$.name").value("Drone1"));
  }

  @Test
  void getDrone_NotFound_Returns404() throws Exception {
    when(droneService.getDrone(INVALID_DRONE_ID))
        .thenThrow(new NotFoundException("Drone no encontrado"));

    mockMvc.perform(get("/api/drones/{id}", INVALID_DRONE_ID))
        .andExpect(status().isNotFound());
  }

  // --------------------- UPDATING DRONES ---------------------
  @Test
  void updateDrone_ValidRequest_ReturnsOk() throws Exception {
    CreateDroneRequest request = buildValidUpdateRequest();
    Drone mockDrone = buildDrone(VALID_DRONE_ID, "Drone1-Updated", Orientation.E, 5, 5);

    when(droneService.updateDrone(anyLong(), anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
        .thenReturn(mockDrone);

    mockMvc.perform(put("/api/drones/{id}", VALID_DRONE_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.name").value("Drone1-Updated"),
            jsonPath("$.x").value(5),
            jsonPath("$.y").value(5));
  }

  @Test
  void updateDrone_DroneNotFound_Returns404() throws Exception {
    CreateDroneRequest request = buildValidUpdateRequest();

    when(droneService.updateDrone(anyLong(), anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
        .thenThrow(new NotFoundException("Dron no encontrado"));

    mockMvc.perform(put("/api/drones/{id}", INVALID_DRONE_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound());
  }

  @Test
  void updateDrone_PositionConflict_Returns409() throws Exception {
    CreateDroneRequest request = buildValidUpdateRequest();

    when(droneService.updateDrone(anyLong(), anyLong(), anyString(), anyString(), anyInt(), anyInt(), any()))
        .thenThrow(new ConflictException("Posición ocupada"));

    mockMvc.perform(put("/api/drones/{id}", VALID_DRONE_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  // --------------------- DELETING DRONES ---------------------
  @Test
  void deleteDrone_Success_Returns204() throws Exception {
    mockMvc.perform(delete("/api/drones/{id}", VALID_DRONE_ID))
        .andExpect(status().isNoContent());
    verify(droneService).deleteDrone(VALID_DRONE_ID);
  }

  @Test
  void deleteDrone_DroneNotFound_Returns404() throws Exception {
    doThrow(new NotFoundException("Dron no encontrado"))
        .when(droneService).deleteDrone(INVALID_DRONE_ID);

    mockMvc.perform(delete("/api/drones/{id}", INVALID_DRONE_ID))
        .andExpect(status().isNotFound());
  }

  // --------------------- HELPER METHODS ---------------------
  private CreateDroneRequest buildValidUpdateRequest() {
    CreateDroneRequest request = new CreateDroneRequest();
    request.setName("Drone1-Updated");
    request.setModel("X200v2");
    request.setX(5);
    request.setY(5);
    request.setOrientation(Orientation.E);
    return request;
  }
}