package com.drones.fct.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.drones.fct.dto.ApiError;

class ExceptionTests {

  @Test
  void testConflictException() {
    ConflictException ex = new ConflictException("Conflict occurred");
    assertEquals("Conflict occurred", ex.getMessage());
  }

  @Test
  void testNotFoundException() {
    NotFoundException ex = new NotFoundException("Not found");
    assertEquals("Not found", ex.getMessage());
  }

  @Test
  void testUnsupportedCommandException() {
    UnsupportedCommandException ex = new UnsupportedCommandException("Command not supported");
    assertEquals("Command not supported", ex.getMessage());
  }

  @Test
  void testHandleNotFound() {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    NotFoundException ex = new NotFoundException("Not found");
    ResponseEntity<ApiError> response = handler.handleNotFound(ex);
    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("NOT_FOUND", response.getBody().getCode());
    assertEquals("Not found", response.getBody().getMessage());
  }

  @Test
  void testHandleConflict() {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    ConflictException ex = new ConflictException("Conflict occurred");
    ResponseEntity<ApiError> response = handler.handleConflict(ex);
    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("CONFLICT", response.getBody().getCode());
    assertEquals("Conflict occurred", response.getBody().getMessage());
  }

  @Test
  void testHandleBadRequest() {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    IllegalArgumentException ex = new IllegalArgumentException("Bad request");
    ResponseEntity<ApiError> response = handler.handleBadRequest(ex);
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("BAD_REQUEST", response.getBody().getCode());
    assertEquals("Bad request", response.getBody().getMessage());
  }

  @Test
  void testHandleValidationExceptions() {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    BindException bindException = new BindException(new Object(), "objectName");
    MethodParameter methodParameter = new MethodParameter(this.getClass().getDeclaredMethods()[0], -1);
    MethodArgumentNotValidException ex = new MethodArgumentNotValidException(methodParameter, bindException);

    ResponseEntity<ApiError> response = handler.handleValidationExceptions(ex);
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("VALIDATION_ERROR", response.getBody().getCode());
    assertEquals("Validation error", response.getBody().getMessage());
  }

  @Test
  void testHandleUnsupportedCommand() {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    UnsupportedCommandException ex = new UnsupportedCommandException("Command not supported");
    ResponseEntity<ApiError> response = handler.handleUnsupportedCommand(ex);
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("BAD_REQUEST", response.getBody().getCode());
    assertEquals("Command not supported", response.getBody().getMessage());
  }
}
