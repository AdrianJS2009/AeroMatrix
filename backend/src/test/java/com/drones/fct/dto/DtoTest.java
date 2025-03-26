// package com.drones.fct.dto;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertTrue;

// import java.util.List;

// import org.junit.jupiter.api.Test;

// import com.drones.fct.domain.MovementCommand;
// import com.drones.fct.domain.Orientation;
// import com.fasterxml.jackson.databind.ObjectMapper;

// class DtoTest {

// private final ObjectMapper objectMapper = new ObjectMapper();

// @Test
// void testApiError() throws Exception {
// ApiError error = new ApiError("ERROR_CODE", "Error message");
// String json = objectMapper.writeValueAsString(error);
// assertTrue(json.contains("ERROR_CODE"));
// ApiError deserialized = objectMapper.readValue(json, ApiError.class);
// assertEquals(error.getCode(), deserialized.getCode());
// assertEquals(error.getMessage(), deserialized.getMessage());
// }

// @Test
// void testCommandsRequest() throws Exception {
// CommandsRequest request = new CommandsRequest();
// request.setCommands(List.of(MovementCommand.MOVE_FORWARD,
// MovementCommand.TURN_LEFT));
// String json = objectMapper.writeValueAsString(request);
// assertTrue(json.contains("MOVE_FORWARD"));
// CommandsRequest deserialized = objectMapper.readValue(json,
// CommandsRequest.class);
// assertEquals(request.getCommands(), deserialized.getCommands());
// }

// @Test
// void testBatchDroneCommandRequest() throws Exception {
// BatchDroneCommandRequest.DroneCommand command1 = new
// BatchDroneCommandRequest.DroneCommand(1L,
// List.of(MovementCommand.TURN_RIGHT));
// BatchDroneCommandRequest dto = new BatchDroneCommandRequest();
// dto.setCommands(List.of(command1));
// String json = objectMapper.writeValueAsString(dto);
// BatchDroneCommandRequest deserialized = objectMapper.readValue(json,
// BatchDroneCommandRequest.class);
// assertNotNull(deserialized.getCommands());
// assertEquals(1, deserialized.getCommands().size());
// assertEquals(1L, deserialized.getCommands().get(0).getDroneId());
// assertEquals(List.of(MovementCommand.TURN_RIGHT),
// deserialized.getCommands().get(0).getCommands());
// }

// @Test
// void testCreateMatrixRequest() throws Exception {
// CreateMatrixRequest request = new CreateMatrixRequest();
// request.setMaxX(20);
// request.setMaxY(30);
// String json = objectMapper.writeValueAsString(request);
// CreateMatrixRequest deserialized = objectMapper.readValue(json,
// CreateMatrixRequest.class);
// assertEquals(20, deserialized.getMaxX());
// assertEquals(30, deserialized.getMaxY());
// }

// @Test
// void testDroneDto() throws Exception {
// DroneDto dto = new DroneDto();
// dto.setId(10L);
// dto.setName("Drone Test");
// dto.setModel("Model A");
// dto.setX(5);
// dto.setY(5);
// dto.setOrientation(Orientation.E);
// dto.setMatrixId(1L);
// String json = objectMapper.writeValueAsString(dto);
// DroneDto deserialized = objectMapper.readValue(json, DroneDto.class);
// assertEquals(dto.getId(), deserialized.getId());
// assertEquals(dto.getName(), deserialized.getName());
// assertEquals(dto.getModel(), deserialized.getModel());
// assertEquals(dto.getX(), deserialized.getX());
// assertEquals(dto.getY(), deserialized.getY());
// assertEquals(dto.getOrientation(), deserialized.getOrientation());
// assertEquals(dto.getMatrixId(), deserialized.getMatrixId());
// }

// @Test
// void testSimpleResponse() throws Exception {
// SimpleResponse response = new SimpleResponse("Success");
// String json = objectMapper.writeValueAsString(response);
// SimpleResponse deserialized = objectMapper.readValue(json,
// SimpleResponse.class);
// assertEquals("Success", deserialized.getMessage());
// }

// @Test
// void testUpdateDroneRequest() throws Exception {
// UpdateDroneRequest request = new UpdateDroneRequest(1L, "Drone Updated",
// "Model B", 6, 7, Orientation.N);
// String json = objectMapper.writeValueAsString(request);
// UpdateDroneRequest deserialized = objectMapper.readValue(json,
// UpdateDroneRequest.class);
// assertEquals(request.getMatrixId(), deserialized.getMatrixId());
// assertEquals(request.getName(), deserialized.getName());
// assertEquals(request.getModel(), deserialized.getModel());
// assertEquals(request.getX(), deserialized.getX());
// assertEquals(request.getY(), deserialized.getY());
// assertEquals(request.getOrientation(), deserialized.getOrientation());
// }

// @Test
// void testMatrixDto() throws Exception {
// MatrixDto dto = new MatrixDto();
// dto.setId(5L);
// dto.setMaxX(100);
// dto.setMaxY(100);
// // Para este test, se asigna una lista vacía de drones.
// dto.setDrones(List.of());
// String json = objectMapper.writeValueAsString(dto);
// MatrixDto deserialized = objectMapper.readValue(json, MatrixDto.class);
// assertEquals(dto.getId(), deserialized.getId());
// assertEquals(dto.getMaxX(), deserialized.getMaxX());
// assertEquals(dto.getMaxY(), deserialized.getMaxY());
// assertNotNull(deserialized.getDrones());
// }

// @Test
// void testUpdateMatrixRequest() throws Exception {
// UpdateMatrixRequest request = new UpdateMatrixRequest(50, 60);
// String json = objectMapper.writeValueAsString(request);
// UpdateMatrixRequest deserialized = objectMapper.readValue(json,
// UpdateMatrixRequest.class);
// assertEquals(50, deserialized.getMaxX());
// assertEquals(60, deserialized.getMaxY());
// }
// }
