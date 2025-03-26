package com.drones.fct.service;

import java.util.List;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.MovementCommand;
import com.drones.fct.dto.BatchDroneCommandRequest;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.exception.NotFoundException;
import com.drones.fct.exception.UnsupportedCommandException;
import com.drones.fct.repository.DroneRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FlightService {

  private final DroneRepository droneRepository;

  public Drone executeCommands(Long droneId, List<MovementCommand> commands) {
    if (commands == null || commands.isEmpty()) {
      throw new IllegalArgumentException("Command list must not be empty.");
    }
    Drone drone = droneRepository.findById(droneId)
        .orElseThrow(() -> new NotFoundException("Drone ID " + droneId + " not found"));

    for (MovementCommand cmd : commands) {
      if (cmd == null) {
        throw new UnsupportedCommandException("Unsupported command: null");
      }
      switch (cmd) {
        case TURN_LEFT -> turnLeft(drone);
        case TURN_RIGHT -> turnRight(drone);
        case MOVE_FORWARD -> moveForward(drone);
        default -> throw new UnsupportedCommandException("Unsupported command: " + cmd);
      }
    }
    return drone;
  }

  public void executeCommandsInSequence(List<Long> droneIds, List<MovementCommand> commands) {
    for (Long droneId : droneIds) {
      executeCommands(droneId, commands);
    }
  }

  @Transactional
  public void executeBatchCommands(List<BatchDroneCommandRequest.DroneCommand> commands) {
    for (BatchDroneCommandRequest.DroneCommand cmd : commands) {
      if (cmd.getCommands() == null || cmd.getCommands().isEmpty()) {
        throw new IllegalArgumentException("Drone " + cmd.getDroneId() + " has no commands to execute.");
      }
      if (!droneRepository.existsById(cmd.getDroneId())) {
        throw new NotFoundException("Drone ID " + cmd.getDroneId() + " not found in batch request.");
      }
      try {
        Drone drone = executeCommands(cmd.getDroneId(), cmd.getCommands());
        checkGlobalCollisions(drone);
      } catch (ObjectOptimisticLockingFailureException e) {
        throw new ConflictException("Concurrency conflict on drone " + cmd.getDroneId());
      }
    }
  }

  private void turnLeft(Drone drone) {
    drone.setOrientation(drone.getOrientation().turnLeft());
  }

  private void turnRight(Drone drone) {
    drone.setOrientation(drone.getOrientation().turnRight());
  }

  private void moveForward(Drone drone) {
    int x = drone.getX();
    int y = drone.getY();
    Matrix matrix = drone.getMatrix();

    switch (drone.getOrientation()) {
      case N -> y++;
      case S -> y--;
      case E -> x++;
      case O -> x--;
    }

    // Matrix limits validation
    if (x < 0 || x > matrix.getMaxX() || y < 0 || y > matrix.getMaxY()) {
      throw new ConflictException(
          "Drone " + drone.getId() + " would exit matrix boundaries. "
              + "New position: (" + x + "," + y + "), "
              + "Matrix limits: (0-" + matrix.getMaxX() + ", 0-" + matrix.getMaxY() + ")");
    }

    // Drone collision validation
    List<Drone> others = droneRepository.findByXAndYAndMatrixId(x, y, matrix.getId());
    if (!others.isEmpty() && (others.size() > 1 || !others.get(0).getId().equals(drone.getId()))) {
      throw new ConflictException(
          "Collision detected between drone " + drone.getId()
              + " and drone " + others.get(0).getId()
              + " at position (" + x + "," + y + ")");
    }

    drone.setX(x);
    drone.setY(y);
  }

  public void checkGlobalCollisions(Drone drone) {
    List<Drone> dronesInSamePosition = droneRepository.findByXAndYAndMatrixId(
        drone.getX(), drone.getY(), drone.getMatrix().getId());
    dronesInSamePosition.forEach(other -> {
      if (!other.getId().equals(drone.getId())) {
        throw new ConflictException(
            "Collision detected between drone " + drone.getId()
                + " and drone " + other.getId());
      }
    });
  }
}