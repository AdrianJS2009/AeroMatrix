package com.drones.fct.exception;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.drones.fct.dto.ApiError;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiError> handleNotFound(NotFoundException ex) {
    ApiError error = new ApiError("NOT_FOUND", ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ApiError> handleConflict(ConflictException ex) {
    ApiError error = new ApiError("CONFLICT", ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException ex) {
    ApiError error = new ApiError("BAD_REQUEST", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex) {
    String errorMessage = ex.getBindingResult().getAllErrors().stream()
        .map(DefaultMessageSourceResolvable::getDefaultMessage)
        .findFirst()
        .orElse("Validation error");

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiError("VALIDATION_ERROR", errorMessage));
  }

  @ExceptionHandler(UnsupportedCommandException.class)
  public ResponseEntity<ApiError> handleUnsupportedCommand(UnsupportedCommandException ex) {
    ApiError error = new ApiError("BAD_REQUEST", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiError> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {

    String message = "Invalid input: " + extractEnumError(ex);
    ApiError error = new ApiError("BAD_REQUEST", message);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  private String extractEnumError(HttpMessageNotReadableException ex) {
    String msg = ex.getLocalizedMessage();

    if (msg != null && msg.contains("not one of the values accepted for Enum class")) {
      return "Value provided is not valid. Accepted values are: N, S, E, O.";
    }
    return "Malformed JSON request.";
  }

  public ResponseEntity<ApiError> handleAllUncaughtExceptions(Exception ex) {
    ApiError error = new ApiError("INTERNAL_SERVER_ERROR", "Unexpected error occurred: " + ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }

}