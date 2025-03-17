package com.tareafct.tareafct;

/* Un robot dron debe asegurar un vuelo autonomo continuio, evitando colisiones con otros drones en la misma formacio
 * la ubicacion y orientacion de cada dron se representan mediante coordenadas e e y, acompañadas de una letra que indica
 * uno de los puntos cardinales, el area de vuelo esta dividida en una cuadricula virtual para simplificar la navegacion
 * y el control de movimientos. Algunos ejemplos de vuelo son "0, 0, N", el dron esta en la esquina inferior izquierda
 * con sentido de vuelo hacia el norte, o "2, 3, S", el dron esta en las coordenadsa 2,3 con sentido de vuelo en direccion sur
 * La cuadricula Y se extiende en sentido vertical y la X en sentido horizontal, Y contiene de 0 a 4 y X de 0 a 4, se dibuja la cuadricula por consola
 * el dron se dibujara en el espacio de la cadricula correspondiente como N S O E segun su orientacion.
*/

public class GridManager {

  private static final int GRID_SIZE = 5;
  private static final char EMPTY_CELL = ' ';
  private static final char DRONE_CELL = 'D';

  private char[][] grid = new char[GRID_SIZE][GRID_SIZE];

  public GridManager() {
    for (int i = 0; i < GRID_SIZE; i++) {
      for (int j = 0; j < GRID_SIZE; j++) {
        grid[i][j] = EMPTY_CELL;
      }
    }
  }

  // Dibujar grid
  public void drawGrid() {
    System.out.print("  ");
    for (int x = 0; x < GRID_SIZE; x++) {
      System.out.print(x + " ");
    }
    System.out.println();

    for (int y = GRID_SIZE - 1; y >= 0; y--) {
      System.out.print(y + " ");
      for (int x = 0; x < GRID_SIZE; x++) {
        char cell = grid[x][y];
        if (cell == EMPTY_CELL) {
          System.out.print("· ");
        } else {
          System.out.print(cell + " ");
        }
      }
      System.out.println();
    }
  }

  public void placeDrone(int x, int y, char orientation) {
    grid[x][y] = DRONE_CELL;
    switch (orientation) {
      case 'N':
        grid[x][y] = 'N';
        break;
      case 'S':
        grid[x][y] = 'S';
        break;
      case 'E':
        grid[x][y] = 'E';
        break;
      case 'O':
        grid[x][y] = 'O';
        break;
    }
  }

  public int[] getDroneCoordinates() {
    int[] coordinates = new int[2];
    for (int x = 0; x < GRID_SIZE; x++) {
      for (int y = 0; y < GRID_SIZE; y++) {
        if (grid[x][y] == 'N' || grid[x][y] == 'S' || grid[x][y] == 'E' || grid[x][y] == 'O') {
          coordinates[0] = x;
          coordinates[1] = y;
          return coordinates;
        }
      }
    }
    return coordinates;
  }

  public void moveDrone(int x, int y, char orientation) {
    grid[x][y] = DRONE_CELL;
    switch (orientation) {
      case 'N':
        grid[x][y] = 'N';
        break;
      case 'S':
        grid[x][y] = 'S';
        break;
      case 'E':
        grid[x][y] = 'E';
        break;
      case 'W':
        grid[x][y] = 'O';
        break;
    }
  }

  public void removeDrone(int x, int y) {
    grid[x][y] = EMPTY_CELL;
  }

  public boolean isDroneInPosition(int x, int y) {
    return grid[x][y] == DRONE_CELL;
  }

  public boolean isDroneInPosition(int x, int y, char orientation) {
    switch (orientation) {
      case 'N':
        return grid[x][y] == 'N';
      case 'S':
        return grid[x][y] == 'S';
      case 'E':
        return grid[x][y] == 'E';
      case 'W':
        return grid[x][y] == 'W';
    }
    return false;
  }

  public void turnLeft(int x, int y) {
    char currentOrientation = grid[x][y];
    switch (currentOrientation) {
      case 'N':
        grid[x][y] = 'O';
        break;
      case 'O':
        grid[x][y] = 'S';
        break;
      case 'S':
        grid[x][y] = 'E';
        break;
      case 'E':
        grid[x][y] = 'N';
        break;
    }
  }

  public void turnRight(int x, int y) {
    char currentOrientation = grid[x][y];
    switch (currentOrientation) {
      case 'N':
        grid[x][y] = 'E';
        break;
      case 'E':
        grid[x][y] = 'S';
        break;
      case 'S':
        grid[x][y] = 'O';
        break;
      case 'O':
        grid[x][y] = 'N';
        break;
    }
  }

  public void moveForwards(int x, int y) {
    char currentOrientation = grid[x][y];
    grid[x][y] = EMPTY_CELL;
    switch (currentOrientation) {
      case 'N':
        y = (y + 1) % GRID_SIZE;
        break;
      case 'S':
        y = (y - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case 'E':
        x = (x + 1) % GRID_SIZE;
        break;
      case 'O':
        x = (x - 1 + GRID_SIZE) % GRID_SIZE;
        break;
    }
    grid[x][y] = currentOrientation;
  }

}
