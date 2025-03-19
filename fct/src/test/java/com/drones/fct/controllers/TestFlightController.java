package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.drones.fct.controller.FlightController;
import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.MovementCommand;
import com.drones.fct.domain.Orientation;
import com.drones.fct.dto.BatchDroneCommandRequest;
import com.drones.fct.dto.CommandsRequest;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.service.FlightService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(FlightController.class)
class TestFlightController {

  private static final Long VALID_DRONE_ID = 1L;
  private static final int MATRIX_MAX_SIZE = 100;

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private FlightService flightService;

  @Autowired
  private ObjectMapper objectMapper;

  // ============================ executeCommands ============================
  @Test
  void executeCommands_ValidMovementSequence_UpdatesPosition() throws Exception {
    Drone mockDrone = buildDrone(VALID_DRONE_ID, 3, 2, Orientation.E);
    when(flightService.executeCommands(VALID_DRONE_ID, List.of(
        MovementCommand.MOVE_FORWARD,
        MovementCommand.TURN_RIGHT,
        MovementCommand.MOVE_FORWARD))).thenReturn(mockDrone);

    CommandsRequest request = new CommandsRequest();
    request.setCommands(List.of(
        MovementCommand.MOVE_FORWARD,
        MovementCommand.TURN_RIGHT,
        MovementCommand.MOVE_FORWARD));

    mockMvc.perform(post("/api/flights/drone/{droneId}/commands", VALID_DRONE_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.x").value(3),
            jsonPath("$.y").value(2),
            jsonPath("$.orientation").value("E"));
  }

  @Test
  void executeCommands_BoundaryCollision_ThrowsConflict() throws Exception {
    CommandsRequest request = new CommandsRequest();
    request.setCommands(List.of(MovementCommand.MOVE_FORWARD));

    when(flightService.executeCommands(eq(VALID_DRONE_ID), anyList()))
        .thenThrow(new ConflictException("Matrix limit exceeded"));

    mockMvc.perform(post("/api/flights/drone/{droneId}/commands", VALID_DRONE_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  // ========================= executeCommandsInSequence =====================
  @Test
  void executeCommandsInSequence_ConcurrentUpdates_HandlesLocking() throws Exception {
    CommandsRequest request = new CommandsRequest();
    request.setCommands(List.of(MovementCommand.TURN_LEFT));
    List<Long> droneIds = List.of(1L, 2L, 3L);

    doThrow(new ConflictException("Concurrency conflict"))
        .when(flightService).executeCommandsInSequence(anyList(), anyList());

    mockMvc.perform(post("/api/flights/drones/commands")
        .param("droneIds", "1", "2", "3")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  // =========================== executeBatchCommands ========================
  @Test
  void executeBatchCommands_MultiDroneCollision_DetectsConflicts() throws Exception {
    BatchDroneCommandRequest request = new BatchDroneCommandRequest();
    request.setCommands(List.of(
        new BatchDroneCommandRequest.DroneCommand(1L, List.of(MovementCommand.MOVE_FORWARD)),
        new BatchDroneCommandRequest.DroneCommand(2L, List.of(MovementCommand.MOVE_FORWARD))));

    doThrow(new ConflictException("Collision detected"))
        .when(flightService).executeBatchCommands(anyList());

    mockMvc.perform(post("/api/flights/drones/batch-commands")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  @Test
  void executeBatchCommands_LargeScaleOperation_ProcessesAll() throws Exception {
    BatchDroneCommandRequest request = new BatchDroneCommandRequest();
    request.setCommands(IntStream.rangeClosed(1, 1000)
        .mapToObj(i -> new BatchDroneCommandRequest.DroneCommand(
            (long) i,
            List.of(MovementCommand.MOVE_FORWARD))) // <--- Paréntesis de cierre correcto
        .toList());

    mockMvc.perform(post("/api/flights/drones/batch-commands")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isAccepted());
  }

  @Test
  void executeCommands_InvalidOrientationFlow_ThrowsError() throws Exception {
    CommandsRequest request = new CommandsRequest();
    request.setCommands(List.of(MovementCommand.TURN_LEFT, MovementCommand.TURN_LEFT));

    when(flightService.executeCommands(anyLong(), anyList()))
        .thenThrow(new ConflictException("Posición inválida"));

    mockMvc.perform(post("/api/flights/drone/{droneId}/commands", VALID_DRONE_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  // ============================ Helper Methods ============================
  private Drone buildDrone(Long id, int x, int y, Orientation orientation) {
    Matrix matrix = new Matrix();
    matrix.setId(1L);
    matrix.setMaxX(MATRIX_MAX_SIZE);
    matrix.setMaxY(MATRIX_MAX_SIZE);

    return Drone.builder()
        .id(id)
        .name("Drone-" + id)
        .model("X300")
        .x(x)
        .y(y)
        .orientation(orientation)
        .matrix(matrix)
        .build();
  }
}