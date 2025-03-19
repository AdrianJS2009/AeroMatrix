package com.drones.fct.exceptions; // Asegúrate de que el paquete sea correcto

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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
import com.drones.fct.domain.Orientation;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.service.DroneService;

@WebMvcTest(DroneController.class)
class TestGlobalExceptionHandler {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private DroneService droneService;

  @Test
  void handleNotFound_ReturnsProperResponse() throws Exception {
    when(droneService.getDrone(999L)).thenThrow(new NotFoundException("No existe"));

    mockMvc.perform(get("/api/drones/999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error").value("NOT_FOUND"))
        .andExpect(jsonPath("$.message").value("No existe"));
  }

  @Test
  void handleIllegalArgument_ReturnsBadRequest() throws Exception {
    when(droneService.createDrone(any(Long.class), any(String.class), any(String.class), any(Integer.class),
        any(Integer.class), any(Orientation.class)))
        .thenThrow(new IllegalArgumentException("Posición inválida"));

    mockMvc.perform(post("/api/drones")
        .content("{}")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error").value("BAD_REQUEST"));
  }
}