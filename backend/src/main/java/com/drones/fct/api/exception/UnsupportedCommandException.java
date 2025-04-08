package com.drones.fct.api.exception;

public class UnsupportedCommandException extends RuntimeException {
  public UnsupportedCommandException(String message) {
    super(message);
  }
}
