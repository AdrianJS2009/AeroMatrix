package com.drones.fct.exception;

public class UnsupportedCommandException extends RuntimeException {
  public UnsupportedCommandException(String message) {
    super(message);
  }
}