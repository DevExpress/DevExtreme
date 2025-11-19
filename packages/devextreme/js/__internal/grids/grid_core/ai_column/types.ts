import type {
  GenerateGridColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';

export type InternalRequestCallbacks = RequestCallbacks<GenerateGridColumnCommandResult> & {
  onRequestSending: (needToShowLoadPanel: boolean) => void;
};
