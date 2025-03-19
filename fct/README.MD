# 🚁 Proyecto de Gestión de Drones

## 📋 Tabla de Contenidos

- [Cómo Clonar y Ejecutar la Aplicación](#-cómo-clonar-y-ejecutar-la-aplicación)
- [Arquitectura y Patrones de Diseño](#-arquitectura-y-patrones-de-diseño)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)

---

## 🛠️ Cómo Clonar y Ejecutar la Aplicación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/AdrianJS2009/proyecto-drones.git
   cd proyecto-drones
   ```

2. **Configurar la base de datos:**

   - MYSQL instalado y en ejecución.
   - Crea una base de datos llamada `dronesdb`.

3. **Configurar las propiedades de la aplicación:**

   - Edita el archivo `src/main/resources/application.properties` con las credenciales de tu base de datos.

   ```bash
    spring.datasource.url=jdbc:mysql://localhost:3306/dronesdb
    spring.datasource.username=
    spring.datasource.password=
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```

4. **Ejecutar la aplicación:**

   ```bash
   ./mvnw spring-boot:run
   ```

---

## 🏛️ Arquitectura y Patrones de Diseño

El proyecto sigue una combinación de **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal**, organizado en capas con responsabilidades:

### 1. **Domain-Driven Design (DDD)**

- **Dominio Central**:
  - Entidades como `Drone` y `Matrix` (en `domain/`) encapsulan la lógica crítica del negocio.
  - Enums como `Orientation` y `MovementCommand` definen reglas del dominio (ej: direcciones válidas).
- **Agregados**:
  - `Matrix` actúa como raíz de agregado, gestionando la relación con los drones asociados.

### 2. **Arquitectura Hexagonal **

- **Núcleo del Dominio**:
  - Las entidades y servicios de dominio (`DroneService`, `FlightService`) son independientes de infraestructura.
- **Repositories**:
  - Interfaces como `DroneRepository` definen cómo interactúa el núcleo con el exterior.
- **Adaptadores**:
  - `DroneController` y `MatrixController` adaptan peticiones HTTP
  - `DroneRepository` (JPA) implementa acceso a datos sin acoplar el dominio a una BD específica.

### 3. **Patrones Clave**

- **Repository**:
  - Abstrae el acceso a datos (`DroneRepository`, `MatrixRepository`)
- **Service**:
  - Servicios como `FlightService` coordinan operaciones complejas
- **DTO (Data Transfer Object)**:
  - Clases como `DroneDto` desacoplan la API de las entidades internas.
- **Manejo Centralizado de Errores**:
  - `GlobalExceptionHandler` unifica el manejo de excepciones usando `@ControllerAdvice`.

---

## 🏗️ Estructura del Proyecto

```plaintext
src/
├── main/
│   ├── java/com/drones/
│   │   ├── domain/         # 🧠 Entidades y reglas de negocio
│   │   ├── application/    # ⚙️ Servicios y casos de uso
│   │   ├── infrastructure/ # 🔌 Adaptadores externos
│   │   ├── api/            # 🌍 Controladores y DTOs para la API REST
│   └── resources/          # Configuración y propiedades
└── test/
    └── java/com/drones/fct/
        ├── service/            # Pruebas unitarias de servicios
        ├── controller/         # Pruebas de integración de controladores
        ├── repository/         # Pruebas de repositorios JPA
        ├── exception/          # Pruebas de manejo de errores
```

---

## 🌐 Endpoints de la API

### Matrices

- **Crear una matriz:**

  ```http
  POST /api/matrices-flight/create
  ```

  ```json
  {
    "maxX": 10,
    "maxY": 10
  }
  ```

- **Obtener una matriz por ID:**

  ```http
  GET /api/matrices-flight/get/{id}
  ```

- **Actualizar una matriz:**

  ```http
  PUT /api/matrices-flight/update/{id}
  ```

  ```json
  {
    "maxX": 15,
    "maxY": 15
  }
  ```

- **Eliminar una matriz:**

  ```http
  DELETE /api/matrices-flight/delete/{id}
  ```

### Drones

- **Crear un dron:**

  ```http
  POST /api/drones
  ```

  ```json
  {
    "matrixId": 1,
    "name": "Drone1",
    "model": "ModelX",
    "x": 0,
    "y": 0,
    "orientation": "N"
  }
  ```

- **Obtener un dron por ID:**

  ```http
  GET /api/drones/{droneId}
  ```

- **Actualizar un dron:**

  ```http
  PUT /api/drones/{droneId}
  ```

  ```json
  {
    "name": "Drone1",
    "model": "ModelX",
    "x": 1,
    "y": 1,
    "orientation": "E"
  }
  ```

- **Eliminar un dron:**

  ```http
  DELETE /api/drones/{droneId}
  ```

### Vuelos

- **Ejecutar comandos en un dron:**

  ```http
  POST /api/flights/drone/{droneId}/commands
  ```

  ```json
  {
    "commands": ["TURN_LEFT", "MOVE_FORWARD"]
  }
  ```

- **Ejecutar comandos en secuencia en varios drones:**

  ```http
  POST /api/flights/drones/commands
  ```

  ```json
  {
    "droneIds": [1, 2],
    "commands": ["TURN_LEFT", "MOVE_FORWARD"]
  }
  ```

- **Ejecutar múltiples secuencias de comandos en múltiples drones:**

  ```http
  POST /api/flights/drones/batch-commands
  ```

  ```json
  {
    "commands": [
      {
        "droneId": 1,
        "commands": ["TURN_LEFT", "MOVE_FORWARD"]
      },
      {
        "droneId": 2,
        "commands": ["TURN_RIGHT", "MOVE_FORWARD"]
      }
    ]
  }
  ```

---

## 🗄️ Configuración de la Base de Datos

Asegúrate de tener MySQL instalado y ejecutándose. Configura las credenciales de la base de datos en el archivo `src/main/resources/application.properties`:

```properties
# MYSQL
spring.datasource.url=jdbc:mysql://localhost:3306/dronesdb
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```
