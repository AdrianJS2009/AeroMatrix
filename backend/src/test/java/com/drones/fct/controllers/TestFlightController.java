package com.drones.fct.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import com.drones.fct.domain.Drone;
import com.drones.fct.domain.Matrix;
import com.drones.fct.domain.MovementCommand;
import com.drones.fct.domain.Orientation;
import com.drones.fct.dto.BatchDroneCommandRequest;
import com.drones.fct.exception.ConflictException;
import com.drones.fct.repository.DroneRepository;
import com.drones.fct.service.FlightService;

@ExtendWith(MockitoExtension.class)
class TestFlightService {

        @Mock
        private DroneRepository droneRepository;

        @InjectMocks
        private FlightService flightService;

        private static final Long DRONE_ID = 1L;
        private static final Long OTHER_DRONE_ID = 2L;
        private Drone drone;
        private Matrix matrix;

        @BeforeEach
        void setUp() {
                matrix = new Matrix(10, 10);
                matrix.setId(1L);

                drone = Drone.builder()
                                .id(DRONE_ID)
                                .x(5)
                                .y(5)
                                .orientation(Orientation.N)
                                .matrix(matrix)
                                .build();
        }

        @Test
        void executeCommands_SingleTurnLeft_ChangesOrientation() {
                when(droneRepository.findById(DRONE_ID)).thenReturn(Optional.of(drone));

                Drone result = flightService.executeCommands(DRONE_ID, List.of(MovementCommand.TURN_LEFT));

                assertEquals(Orientation.O, result.getOrientation());
                verify(droneRepository).save(drone);
        }

        @Test
        void executeCommands_MoveForward_UpdatesPosition() {
                when(droneRepository.findById(DRONE_ID)).thenReturn(Optional.of(drone));
                when(droneRepository.findByXAndYAndMatrixId(5, 6, 1L)).thenReturn(Collections.emptyList());

                Drone result = flightService.executeCommands(DRONE_ID, List.of(MovementCommand.MOVE_FORWARD));

                assertEquals(5, result.getX());
                assertEquals(6, result.getY());
                verify(droneRepository).save(drone);
        }

        @Test
        void executeCommands_MoveOutOfBounds_ThrowsConflict() {
                drone.setY(10);
                when(droneRepository.findById(DRONE_ID)).thenReturn(Optional.of(drone));

                ConflictException exception = assertThrows(ConflictException.class,
                                () -> flightService.executeCommands(DRONE_ID, List.of(MovementCommand.MOVE_FORWARD)));
                assertEquals("Expected conflict message", exception.getMessage());
        }

        @Test
        void executeCommands_CollisionDetection_ThrowsConflict() {
                Drone otherDrone = Drone.builder().id(OTHER_DRONE_ID).x(5).y(6).matrix(matrix).build();
                when(droneRepository.findById(DRONE_ID)).thenReturn(Optional.of(drone));
                when(droneRepository.findByXAndYAndMatrixId(5, 6, 1L)).thenReturn(List.of(otherDrone));

                assertThrows(ConflictException.class,
                                () -> flightService.executeCommands(DRONE_ID, List.of(MovementCommand.MOVE_FORWARD)));
        }

        @Test
        void executeBatchCommands_WithConcurrencyConflict_ThrowsException() {
                BatchDroneCommandRequest.DroneCommand cmd = new BatchDroneCommandRequest.DroneCommand(DRONE_ID,
                                List.of(MovementCommand.MOVE_FORWARD));

                when(droneRepository.findById(DRONE_ID))
                                .thenThrow(new ObjectOptimisticLockingFailureException(Drone.class, DRONE_ID));

                assertThrows(ConflictException.class,
                                () -> flightService.executeBatchCommands(List.of(cmd)));
        }

        @Test
        void checkGlobalCollisions_AfterMove_DetectsConflict() {
                Drone otherDrone = Drone.builder().id(OTHER_DRONE_ID).x(5).y(5).matrix(matrix).build();
                when(droneRepository.findByXAndYAndMatrixId(5, 5, 1L)).thenReturn(List.of(drone, otherDrone));

                assertThrows(ConflictException.class,
                                () -> flightService.checkGlobalCollisions(drone));
        }

        @Test
        void executeCommandsInSequence_MultipleDrones_UpdatesAll() {
                Drone secondDrone = Drone.builder()
                                .id(OTHER_DRONE_ID)
                                .x(3)
                                .y(3)
                                .orientation(Orientation.E)
                                .matrix(matrix)
                                .build();
                when(droneRepository.findById(DRONE_ID)).thenReturn(Optional.of(drone));
                when(droneRepository.findById(OTHER_DRONE_ID)).thenReturn(Optional.of(secondDrone));

                flightService.executeCommandsInSequence(
                                List.of(DRONE_ID, OTHER_DRONE_ID),
                                List.of(MovementCommand.TURN_RIGHT));

                verify(droneRepository, times(2)).save(any());
        }
}