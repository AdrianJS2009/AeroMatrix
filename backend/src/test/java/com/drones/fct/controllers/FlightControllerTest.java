package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.drones.fct.api.controller.FlightController;
import com.drones.fct.api.dto.CommandsRequest;
import com.drones.fct.application.FlightService;
import com.drones.fct.domain.model.Drone;
import com.drones.fct.domain.model.Matrix;
import com.drones.fct.domain.model.MovementCommand;
import com.drones.fct.domain.model.Orientation;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(FlightController.class)
class FlightControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private FlightService flightService;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void executeCommands_ReturnsDroneDto() throws Exception {
    CommandsRequest request = new CommandsRequest();
    request.setCommands(List.of(MovementCommand.TURN_RIGHT, MovementCommand.MOVE_FORWARD));

    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    Drone drone = Drone.builder()
        .id(50L)
        .name("Drone Flight")
        .model("Model F")
        .x(5)
        .y(6)
        .orientation(Orientation.E)
        .matrix(matrix)
        .build();

    when(flightService.executeCommands(any(Long.class), any(List.class))).thenReturn(drone);

    mockMvc.perform(post("/api/flights/drones/50/commands")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(50))
        .andExpect(jsonPath("$.orientation").value("E"));
  }

  @Test
  void executeCommandsInSequence_ReturnsNoContent() throws Exception {
    CommandsRequest request = new CommandsRequest();
    request.setCommands(List.of(MovementCommand.MOVE_FORWARD));

    mockMvc.perform(post("/api/flights/drones/commands?droneIds=50,51")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk());
  }

  @Test
  void executeBatchCommands_ReturnsAccepted() throws Exception {
    String batchJson = """
        {
          "commands": [
            {
              "droneId": 60,
              "commands": ["TURN_LEFT", "MOVE_FORWARD"]
            },
            {
              "droneId": 61,
              "commands": ["TURN_RIGHT", "MOVE_FORWARD"]
            }
          ]
        }
        """;

    mockMvc.perform(post("/api/flights/batch-commands")
        .contentType(MediaType.APPLICATION_JSON)
        .content(batchJson))
        .andExpect(status().isAccepted());
  }
}
