package com.drones.fct.api.dto;

import lombok.Value;

@Value
public class ApiError {
  private String code;
  private String message;
}
