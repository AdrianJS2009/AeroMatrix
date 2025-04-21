# 🚁 AeroMatrix

## 📋 Table of Contents

- [How to Clone and Run the Application](#-how-to-clone-and-run-the-application)
- [Architecture and Design Patterns](#-architecture-and-design-patterns)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Configuration](#-database-configuration)

---

## 🛠️ How to Clone and Run the Application

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AdrianJS2009/AeroMatrix.git
   cd Proyecto_FCT
   ```

2. **Set up the database:**

   - Ensure MySQL is installed and running.
   - Create a database named `dronesdb`.

3. **Configure the application properties:**

   - Edit the file `src/main/resources/application.properties` with your database credentials.

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/dronesdb
   spring.datasource.username=
   spring.datasource.password=
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```

4. **Run the application:**

   ```bash
   ./mvnw spring-boot:run
   ```

---


---

## 🚀 How to Run the Frontend (Angular)

The frontend is built with **Angular 18** and uses **PrimeNG 19** for UI components.

### 📦 Install dependencies

Make sure you have Node.js and Angular CLI installed. Then run:

```bash
cd frontend
npm install
```

### ▶️ Run the development server

```bash
ng serve
```

The application will be available at [http://localhost:4200](http://localhost:4200)

### 🌐 Environment Configuration

You can edit the environment variables in:

```bash
src/environments/environment.ts
```

Make sure the backend API URL is correctly set if needed for development.

## 🏛️ Architecture and Design Patterns

The project follows a combination of **Domain-Driven Design (DDD)** and **Hexagonal Architecture**, organized in layers with clear responsibilities:

### 1. Domain-Driven Design (DDD)

- **Core Domain**:
  - Entities like `Drone` and `Matrix` (in `domain/`) encapsulate core business logic.
  - Enums like `Orientation` and `MovementCommand` define domain rules (e.g., valid directions).
- **Aggregates**:
  - `Matrix` acts as the aggregate root, managing its associated drones.

### 2. Hexagonal Architecture

- **Domain Core**:
  - Entities and services (`DroneService`, `FlightService`) are independent of infrastructure.
- **Repositories**:
  - Interfaces like `DroneRepository` define how the core interacts with the outside world.
- **Adapters**:
  - `DroneController` and `MatrixController` adapt HTTP requests.
  - `DroneRepository` (JPA) provides data access without coupling to specific DB.

### 3. Key Patterns

- **Repository**:
  - Abstracts data access (`DroneRepository`, `MatrixRepository`)
- **Service**:
  - Services like `FlightService` coordinate complex operations
- **DTO (Data Transfer Object)**:
  - Classes like `DroneDto` decouple API from internal entities.
- **Centralized Error Handling**:
  - `GlobalExceptionHandler` handles exceptions using `@ControllerAdvice`.

---

## 🏗️ Project Structure

```plaintext
Proyecto_FCT/
├── backend/
│   └── src/
│       ├── main/
│       │   ├── java/com/drones/fct/
│       │   │   ├── api/
│       │   │   │   ├── controller/       # 🌍 REST Controllers
│       │   │   │   ├── dto/              # 📦 Data Transfer Objects
│       │   │   │   └── exception/        # 🚨 Custom exceptions and global handlers
│       │   │   ├── application/          # 🧠 Application services and orchestrators
│       │   │   ├── domain/
│       │   │   │   ├── model/            # 🧬 Domain entities (Aggregates, VOs)
│       │   │   │   └── repository/       # 🗃️ Domain repository interfaces
│       │   │   ├── infrastructure/
│       │   │   │   └── config/           # ⚙️ Spring and application configuration
│       │   │   └── FctApplication.java   # 🚀 Main Spring Boot application class
│       │   └── resources/
│       │       └── static/
│       │           └── custom/           # 🖼️ Custom static resources (if any)
│       └── test/java/com/drones/fct/
│           ├── controllers/              # 🧪 Integration tests for controllers
│           ├── domain/                   # 🧪 Domain model unit tests
│           ├── dto/                      # 🧪 DTO mapping and validation tests
│           ├── exception/                # 🧪 Exception handling tests
│           ├── repositories/             # 🧪 Repository layer tests
│           ├── resources/                # 🧪 Test-specific configuration/resources
│           └── services/                 # 🧪 Application/service layer tests
│
├── frontend/
│   ├── app/
│   │   ├── about/                      # ℹ️ About page module
│   │   ├── analytics/                  # 📊 Analytics and statistics
│   │   ├── config/                     # ⚙️ App configuration
│   │   ├── core/
│   │   │   └── services/               # 🔧 Core services (interceptors, guards, etc.)
│   │   ├── drones/
│   │   │   ├── components/
│   │   │   │   ├── dron-list/          # 📃 List of drones
│   │   │   │   ├── drone-form/         # 📝 Drone creation/edit form
│   │   │   │   └── drone-matrix/       # 🗺️ Matrix with drone positions
│   │   │   ├── models/                 # 📦 Drone-related models
│   │   │   └── services/               # 📡 Drone API communication
│   │   ├── features/                   # 🌟 Additional feature modules
│   │   ├── flights/
│   │   │   ├── components/             # ✈️ UI components for flight management
│   │   │   └── services/               # ✈️ Flight service API logic
│   │   ├── landing-page/              # 🏠 Landing or home page
│   │   ├── layout/
│   │   │   ├── header/                 # 🧭 Top navigation
│   │   │   ├── shell/                  # 💠 Shell layout wrapper
│   │   │   └── sidebar/                # 📚 Sidebar navigation
│   │   ├── matrices/
│   │   │   ├── components/
│   │   │   │   ├── matrix-form/        # 📐 Create/edit matrix form
│   │   │   │   └── matrix-list/        # 📋 Matrix listing UI
│   │   │   ├── models/                 # 📦 Matrix-related models
│   │   │   └── services/               # 📡 Matrix service API logic
│   │   ├── not-found/                 # ❌ 404 Not Found page
│   │   ├── settings/                  # ⚙️ Application settings
│   │   ├── shared/                    # ♻️ Shared components, directives, pipes
│   │   └── support/                   # 💬 Help and support
│   ├── assets/
│   │   ├── i18n/                      # 🌍 Translations for i18n
│   │   └── themes/                    # 🎨 Theme customization
│   │       ├── lara-dark-blue/
│   │       └── lara-light-blue/
│   └── environments/                 # 🌐 Environment config files# ⚡ Vite build configuration
```

---

## 🌐 API Endpoints

### 🧱 Matrices

- **List all matrices**
  ```http
  GET /api/matrices
  ```

- **Create a matrix**
  ```http
  POST /api/matrices
  ```

  ```json
  {
    "maxX": 10,
    "maxY": 10
  }
  ```

- **Get matrix by ID**
  ```http
  GET /api/matrices/{matrixId}
  ```

- **Update a matrix**
  ```http
  PUT /api/matrices/{matrixId}
  ```

  ```json
  {
    "maxX": 15,
    "maxY": 15
  }
  ```

- **Delete a matrix**
  ```http
  DELETE /api/matrices/{matrixId}
  ```

---

### 🚁 Drones

- **List all drones**
  ```http
  GET /api/drones
  ```

- **Create a drone**
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

- **Get drone by ID**
  ```http
  GET /api/drones/{droneId}
  ```

- **Update a drone**
  ```http
  PUT /api/drones/{droneId}
  ```

  ```json
  {
    "matrixId": 1,
    "name": "Drone1",
    "model": "ModelX",
    "x": 1,
    "y": 1,
    "orientation": "E"
  }
  ```

- **Delete a drone**
  ```http
  DELETE /api/drones/{droneId}
  ```

---

### ✈️ Flights

- **Execute a sequence of commands on a single drone**
  ```http
  POST /api/flights/drones/{droneId}/commands
  ```

  ```json
  {
    "commands": ["TURN_LEFT", "MOVE_FORWARD"]
  }
  ```

- **Execute the same sequence on multiple drones**
  ```http
  POST /api/flights/drones/commands?droneIds=1&droneIds=2
  ```

  ```json
  {
    "commands": ["TURN_LEFT", "MOVE_FORWARD"]
  }
  ```

- **Execute different sequences on multiple drones**
  ```http
  POST /api/flights/batch-commands
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

## 🗄️ Database Configuration

Make sure to configure your `application.properties` or `application.yml` with the correct database credentials. See [How to Clone and Run the Application](#-how-to-clone-and-run-the-application) for more info.
