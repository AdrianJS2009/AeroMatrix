export interface CommandsRequest {
  commands: string;
}

export interface BatchDroneCommand {
  droneId: number;
  commands: string;
}

export interface BatchDroneCommandRequest {
  commands: BatchDroneCommand[];
}
