package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

import com.drones.fct.controller.MatrixController;
import com.drones.fct.domain.Matrix;
import com.drones.fct.dto.CreateMatrixRequest;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.service.MatrixService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(MatrixController.class)
class MatrixControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private MatrixService matrixService;

  @MockBean
  private DroneRepository droneRepository;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void createMatrix_ReturnsCreated() throws Exception {
    CreateMatrixRequest request = new CreateMatrixRequest();
    request.setMaxX(10);
    request.setMaxY(10);

    Matrix matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    when(matrixService.createMatrix(any(Integer.class), any(Integer.class))).thenReturn(matrix);

    mockMvc.perform(post("/api/matrices")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.maxX").value(10))
        .andExpect(jsonPath("$.maxY").value(10));
  }

  @Test
  void getMatrix_ReturnsMatrix() throws Exception {
    Matrix matrix = Matrix.builder().id(2L).maxX(15).maxY(15).build();
    when(matrixService.getMatrix(2L)).thenReturn(matrix);

    mockMvc.perform(get("/api/matrices/2"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(2))
        .andExpect(jsonPath("$.maxX").value(15));
  }

  @Test
  void deleteMatrix_ReturnsNoContent() throws Exception {
    when(matrixService.getMatrix(3L)).thenReturn(Matrix.builder().id(3L).maxX(10).maxY(10).build());
    mockMvc.perform(delete("/api/matrices/3"))
        .andExpect(status().isNoContent());
  }

  @Test
  void listMatrices_ReturnsList() throws Exception {
    Matrix matrix1 = Matrix.builder().id(1L).maxX(10).maxY(10).build();
    Matrix matrix2 = Matrix.builder().id(2L).maxX(15).maxY(15).build();
    when(matrixService.listMatrices()).thenReturn(List.of(matrix1, matrix2));

    mockMvc.perform(get("/api/matrices"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2));
  }
}
