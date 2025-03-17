package com.tareafct.tareafct;

/* Cada dron incluira:
 * 
 * id
 * nombre del dron
 * modelo del dron (por ej R3487-1)
 * x,y: coordenadas iniciales del dron
 * orden: cadena de sintrucciones de movimiento usando enumerados
*/

public class Dron {

  private int id;
  private String nombre;
  private String modelo;
  private int x;
  private int y;
  private Orden orden;

  public Dron(int id, String nombre, String modelo, int x, int y, Orden orden) {
    this.id = id;
    this.nombre = nombre;
    this.modelo = modelo;
    this.x = x;
    this.y = y;
    this.orden = orden;
  }

  public int getId() {
    return id;
  }

  public String getNombre() {
    return nombre;
  }

  public String getModelo() {
    return modelo;
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public Orden getOrden() {
    return orden;
  }

  public void setId(int id) {
    this.id = id;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public void setModelo(String modelo) {
    this.modelo = modelo;
  }

  public void setX(int x) {
    this.x = x;
  }

  public void setY(int y) {
    this.y = y;
  }

  public void setOrden(Orden orden) {
    this.orden = orden;
  }

  public enum Orden {
    TURN_LEFT,
    TURN_RIGHT,
    MOVE_FORWARDS,
    EXIT
  }

  @Override
  public String toString() {
    return "Dron{" +
        "id=" + id +
        ", nombre='" + nombre + '\'' +
        ", modelo='" + modelo + '\'' +
        ", x=" + x +
        ", y=" + y +
        ", orden='" + orden + '\'' +
        '}';
  }
}
