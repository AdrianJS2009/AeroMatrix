package com.drones.fct;

import java.util.Scanner;

public class CommandProcessor {
  private GridManager gridManager;
  private Scanner scanner;

  public CommandProcessor(GridManager gridManager) {
    this.gridManager = gridManager;
    this.scanner = new Scanner(System.in);
  }

  public void processCommands() {
    int x = 0, y = 0;
    while (true) {
      System.out.println("Introduzca alguno de los siguientes comandos (TURN_LEFT, TURN_RIGHT, MOVE_FORWARDS, EXIT): ");
      String command = scanner.nextLine().toUpperCase();
      switch (command) {
        case "TURN_LEFT":
          gridManager.turnLeft(x, y);
          break;
        case "TURN_RIGHT":
          gridManager.turnRight(x, y);
          break;
        case "MOVE_FORWARDS":
          gridManager.moveForwards(x, y);
          // Update de las coords
          int[] newCoordinates = gridManager.getDroneCoordinates();
          x = newCoordinates[0];
          y = newCoordinates[1];
          break;
        case "EXIT":
          System.out.println("Saliendo...");
          return;
        default:
          System.out.println("Comando inválido o no reconocido.");
          continue;
      }
      gridManager.drawGrid();
    }
  }
}
