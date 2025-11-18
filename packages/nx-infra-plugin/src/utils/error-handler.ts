import { logger } from '@nx/devkit';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function getErrorStack(error: unknown): string | undefined {
  return error instanceof Error ? error.stack : undefined;
}

export function logError(message: string, error: unknown): void {
  logger.error(`${message}: ${getErrorMessage(error)}`);
  const stack = getErrorStack(error);
  if (stack) {
    logger.error(stack);
  }
}
