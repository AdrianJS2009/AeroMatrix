package com.drones.fct.controllers;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.drones.fct.controller.MatrixController;
import com.drones.fct.domain.Matrix;
import com.drones.fct.dto.CreateMatrixRequest;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.service.MatrixService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(MatrixController.class)
class TestMatrixController {

  private static final Long VALID_MATRIX_ID = 1L;
  private static final Long INVALID_MATRIX_ID = 999L;
  private static final int MAX_SIZE = 100;

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private MatrixService matrixService;

  @Autowired
  private ObjectMapper objectMapper;

  // ============================ createMatrix ============================
  @Test
  void createMatrix_ValidRequest_ReturnsCreated() throws Exception {
    CreateMatrixRequest request = new CreateMatrixRequest(MAX_SIZE, MAX_SIZE);
    Matrix mockMatrix = buildMatrix(VALID_MATRIX_ID, MAX_SIZE, MAX_SIZE);

    when(matrixService.createMatrix(anyInt(), anyInt())).thenReturn(mockMatrix);

    mockMvc.perform(post("/api/matrices-flight/create")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpectAll(
            status().isCreated(),
            jsonPath("$.id").value(VALID_MATRIX_ID),
            jsonPath("$.maxX").value(MAX_SIZE),
            jsonPath("$.maxY").value(MAX_SIZE));
  }

  // ============================ getMatrix ============================
  @Test
  void getMatrix_ValidId_ReturnsMatrix() throws Exception {
    Matrix mockMatrix = buildMatrix(VALID_MATRIX_ID, MAX_SIZE, MAX_SIZE);
    when(matrixService.getMatrix(VALID_MATRIX_ID)).thenReturn(mockMatrix);

    mockMvc.perform(get("/api/matrices-flight/get/{id}", VALID_MATRIX_ID))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.maxX").value(MAX_SIZE),
            jsonPath("$.maxY").value(MAX_SIZE));
  }

  @Test
  void getMatrix_NotFound_Returns404() throws Exception {
    when(matrixService.getMatrix(INVALID_MATRIX_ID))
        .thenThrow(new NotFoundException("Matrix not found"));

    mockMvc.perform(get("/api/matrices-flight/get/{id}", INVALID_MATRIX_ID))
        .andExpect(status().isNotFound());
  }

  // ============================ updateMatrix ============================
  @Test
  void updateMatrix_ValidRequest_ReturnsUpdatedMatrix() throws Exception {
    CreateMatrixRequest request = new CreateMatrixRequest(200, 200);
    Matrix updatedMatrix = buildMatrix(VALID_MATRIX_ID, 200, 200);

    when(matrixService.updateMatrix(eq(VALID_MATRIX_ID), anyInt(), anyInt()))
        .thenReturn(updatedMatrix);

    mockMvc.perform(put("/api/matrices-flight/update/{id}", VALID_MATRIX_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.maxX").value(200),
            jsonPath("$.maxY").value(200));
  }

  @Test
  void updateMatrix_WithDrones_ThrowsConflict() throws Exception {
    CreateMatrixRequest request = new CreateMatrixRequest(50, 50);

    when(matrixService.updateMatrix(eq(VALID_MATRIX_ID), anyInt(), anyInt()))
        .thenThrow(new ConflictException("Matrix has active drones"));

    mockMvc.perform(put("/api/matrices-flight/update/{id}", VALID_MATRIX_ID)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  // ============================ deleteMatrix ============================
  @Test
  void deleteMatrix_Success_Returns204() throws Exception {
    mockMvc.perform(delete("/api/matrices-flight/delete/{id}", VALID_MATRIX_ID))
        .andExpect(status().isNoContent());
  }

  @Test
  void deleteMatrix_WithDrones_ThrowsConflict() throws Exception {
    doThrow(new ConflictException("Matrix contains drones"))
        .when(matrixService).deleteMatrix(VALID_MATRIX_ID);

    mockMvc.perform(delete("/api/matrices-flight/delete/{id}", VALID_MATRIX_ID))
        .andExpect(status().isConflict());
  }

  // ============================ Helper Methods ============================
  private Matrix buildMatrix(Long id, int maxX, int maxY) {
    return Matrix.builder()
        .id(id)
        .maxX(maxX)
        .maxY(maxY)
        .build();
  }
}