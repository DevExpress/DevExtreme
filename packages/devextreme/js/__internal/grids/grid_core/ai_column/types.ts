import type { GenerateColumnCommandParams, GenerateColumnCommandResult, RequestCallbacks } from '@js/common/ai-integration';

export type GenerateColumnCommandExecutor = (
  params: GenerateColumnCommandParams,
  callbacks: RequestCallbacks<GenerateColumnCommandResult>,
) => () => void;
