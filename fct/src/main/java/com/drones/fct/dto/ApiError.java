package com.drones.fct.dto;

import lombok.Value;

@Value
public class ApiError {
  private String code;
  private String message;
}