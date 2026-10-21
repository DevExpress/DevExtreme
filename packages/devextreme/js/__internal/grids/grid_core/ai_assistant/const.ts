export const AI_ASSISTANT_BUTTON_NAME = 'aiAssistantButton';
export const AI_ASSISTANT_ICON_NAME = 'chatsparkleoutline';

export const CLASSES = {
  aiAssistantButton: 'ai-assistant-button',
  aiAssistantConfirmDialog: 'ai-assistant-confirm-dialog',
};

export const AI_ASSISTANT_POPUP_OFFSET = 12;
export const AI_ASSISTANT_CONFIRM_DIALOG_WIDTH = 425;
export const AI_ASSISTANT_CONFIRM_DIALOG_COMPACT_WIDTH = 360;

export const AI_ASSISTANT_AUTHOR_ID = 'assistant';
export const AI_ASSISTANT_AUTHOR = { id: AI_ASSISTANT_AUTHOR_ID };

export enum MessageStatus {
  Pending = 'pending',
  Success = 'success',
  Failure = 'failure',
}

export const DEFAULT_SUCCESS_MESSAGE = 'dxDataGrid-aiAssistantSuccessMessage';
export const DEFAULT_FAILURE_MESSAGE = 'dxDataGrid-aiAssistantErrorMessage';
export const EXECUTION_ABORT_MESSAGE = 'dxDataGrid-aiAssistantExecutionAbortMessage';

// CVE-2023-54404: zod creates an issue per invalid array item, so huge args can exhaust memory.
// Checked on all command args as JSON before parsing; remove once zod fixes arrays without .max().
export const MAX_COMMAND_ARGS_LENGTH = 128 * 1024;
