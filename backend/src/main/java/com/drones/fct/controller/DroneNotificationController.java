package com.drones.fct.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.drones.fct.dto.DroneDto;

//TODO: Implementar WS en la logica de negocio y front

@RestController
public class DroneNotificationController {

  private final SimpMessagingTemplate messagingTemplate;

  public DroneNotificationController(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  public void sendDroneUpdate(DroneDto drone) {
    messagingTemplate.convertAndSend("/topic/droneUpdates", drone);
  }

  public void sendNotification(String message) {
    messagingTemplate.convertAndSend("/queue/notifications", message);
  }
}
