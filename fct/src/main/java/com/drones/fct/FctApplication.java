package com.drones.fct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FctApplication {

	public static void main(String[] args) {
		SpringApplication.run(FctApplication.class, args);

		// Prueba de pintar cuadricula y un dron junto con movimiento
		GridManager gridManager = new GridManager();
		gridManager.placeDrone(0, 0, 'N');
		gridManager.drawGrid();

		CommandProcessor commandProcessor = new CommandProcessor(gridManager);
		commandProcessor.processCommands();
	}
}
