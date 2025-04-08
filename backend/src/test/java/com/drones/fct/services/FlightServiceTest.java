package com.drones.fct.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.drones.fct.api.exception.ConflictException;
import com.drones.fct.api.exception.UnsupportedCommandException;
import com.drones.fct.application.FlightService;
import com.drones.fct.domain.model.Drone;
import com.drones.fct.domain.model.Matrix;
import com.drones.fct.domain.model.MovementCommand;
import com.drones.fct.domain.model.Orientation;
import com.drones.fct.domain.repository.DroneRepository;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock
    private DroneRepository droneRepository;

    @InjectMocks
    private FlightService flightService;

    private Drone drone;
    private Matrix matrix;

    @BeforeEach
    void setUp() {
        matrix = Matrix.builder().id(1L).maxX(10).maxY(10).build();
        drone = Drone.builder()
                .id(100L)
                .name("Drone Flight")
                .model("F-Model")
                .x(5)
                .y(5)
                .orientation(Orientation.N)
                .matrix(matrix)
                .build();
    }

    @Test
    void executeCommands_TurnLeft() {
        when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));

        Drone result = flightService.executeCommands(100L, List.of(MovementCommand.TURN_LEFT));
        assertEquals(Orientation.O, result.getOrientation());
    }

    @Test
    void executeCommands_TurnRight() {
        when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));

        Drone result = flightService.executeCommands(100L, List.of(MovementCommand.TURN_RIGHT));
        assertEquals(Orientation.E, result.getOrientation());
    }

    @Test
    void executeCommands_MoveForward_Success() {
        when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));

        when(droneRepository.findByXAndYAndMatrixId(5, 6, 1L)).thenReturn(Collections.emptyList());

        Drone result = flightService.executeCommands(100L, List.of(MovementCommand.MOVE_FORWARD));
        assertEquals(5, result.getX());
        assertEquals(6, result.getY());
    }

    @Test
    void executeCommands_MoveForward_OutOfBounds() {

        drone.setY(10);
        when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));

        ConflictException exception = assertThrows(ConflictException.class,
                () -> flightService.executeCommands(100L, List.of(MovementCommand.MOVE_FORWARD)));
        assertTrue(exception.getMessage().contains("would exit matrix boundaries"));
    }

    @Test
    void executeCommands_UnsupportedCommand() {
        when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));

        UnsupportedCommandException exception = assertThrows(UnsupportedCommandException.class,
                () -> flightService.executeCommands(100L, Collections.singletonList(null)));
        assertTrue(exception.getMessage().contains("Unsupported command"));
    }

    @Test
    void executeCommandsInSequence_Success() {
        when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));
        when(droneRepository.findByXAndYAndMatrixId(anyInt(), anyInt(), anyLong()))
                .thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> flightService.executeCommandsInSequence(List.of(100L),
                List.of(MovementCommand.TURN_RIGHT, MovementCommand.MOVE_FORWARD)));
    }

    // @Test
    // void executeBatchCommands_ConcurrencyConflict() {

    // when(droneRepository.findById(100L)).thenReturn(Optional.of(drone));
    // when(droneRepository.findByXAndYAndMatrixId(anyInt(), anyInt(), anyLong()))
    // .thenReturn(Collections.emptyList());
    // doThrow(new ObjectOptimisticLockingFailureException(Drone.class,
    // drone.getId()))
    // .when(droneRepository).save(drone);

    // ConflictException exception = assertThrows(ConflictException.class, () ->
    // flightService.executeBatchCommands(
    // List.of(new
    // com.drones.fct.api.dto.BatchDroneCommandRequest.DroneCommand(100L,
    // List.of(MovementCommand.MOVE_FORWARD)))));
    // assertTrue(exception.getMessage().contains("Concurrency conflict"));
    // }
}
