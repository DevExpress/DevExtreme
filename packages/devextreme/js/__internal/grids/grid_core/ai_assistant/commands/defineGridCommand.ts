import type { GridCommand } from '@ts/grids/grid_core/ai_assistant/types';
import type { ZodObject, ZodRawShape } from 'zod';

export function defineGridCommand<TSchema extends ZodObject<ZodRawShape>>(
  command: GridCommand<TSchema>,
): GridCommand<TSchema> {
  return command;
}
