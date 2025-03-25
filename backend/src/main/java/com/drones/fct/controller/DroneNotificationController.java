package com.drones.fct.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.drones.fct.dto.DroneDto;

@RestController
public class DroneNotificationController {

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  public void sendDroneUpdate(DroneDto drone) {
    messagingTemplate.convertAndSend("/topic/droneUpdates", drone);
  }

  public void sendNotification(String message) {
    messagingTemplate.convertAndSend("/queue/notifications", message);
  }
}
