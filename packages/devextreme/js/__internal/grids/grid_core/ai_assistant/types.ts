export interface CommandResponse {
  commands: Command[];
}

export interface Command {
  name: string;
  args: Record<string, unknown>;
}

export interface InternalRequestCallbacks {
  onComplete?: (finalResponse: CommandResponse) => void;
  onError?: (error: Error) => void;
}

export interface ProcessedCommand {
  status: 'success' | 'error';
  message: string;
}

export type ProcessedCommands = ProcessedCommand[];
