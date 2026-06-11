import { SPEECH_TO_TEXT_CLASS } from '@ts/ui/speech_to_text/speech_to_text';
import { TEXTAREA_CLASS } from '@ts/ui/text_area';

export const DEFAULT_POPUP_OPTIONS = {
  width: 400,
  minWidth: 400,
  minHeight: 480,
  visible: false,
  shading: false,
  showCloseButton: true,
  useFlatToolbarButtons: true,
  useDefaultToolbarButtons: false,
};

export const DEFAULT_CHAT_OPTIONS = {
  showAvatar: false,
  showDayHeaders: false,
  showMessageTimestamp: false,
  showUserAvatar: false,
  speechToTextEnabled: true,
};

export const CLASSES = {
  aiChat: 'dx-ai-chat',
  aiDialog: 'dx-aidialog',
  aiChatContent: 'dx-ai-chat__content',
  aiChatEmptyImage: 'dx-ai-chat__empty-image',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  messageIcon: 'dx-ai-chat__message-icon',
  messageContent: 'dx-ai-chat__message-content',
  messageHeader: 'dx-ai-chat__message-header',
  messageStatus: 'dx-ai-chat__message-status',
  actionList: 'dx-ai-chat__action-list',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
  actionListItemError: 'dx-ai-chat__action-list-item--error',
  actionListItemAborted: 'dx-ai-chat__action-list-item--aborted',
  actionListItemIcon: 'dx-ai-chat__action-list-item-icon',
  actionListItemText: 'dx-ai-chat__action-list-item-text',
  messageErrorText: 'dx-ai-chat__message-error-text',
  messageHeaderRow: 'dx-ai-chat__message-header-row',
  messageRegenerateButton: 'dx-ai-chat__message-regenerate-button',
  messageProgressBar: 'dx-ai-chat__message-progressbar',
  clearChatButton: 'dx-ai-chat__clear-button',
  disabled: 'dx-ai-chat--disabled',
  textArea: TEXTAREA_CLASS,
  speechToTextButton: SPEECH_TO_TEXT_CLASS,
};

export const CLEAR_CHAT_ICON = 'clearhistory';
export const REGENERATE_ICON = 'restore';

export const SUCCESS_ITEM_EMOJI = '\u2705';
export const ERROR_ITEM_EMOJI = '\u274C';
export const ABORTED_ITEM_EMOJI = '\u26A0\uFE0F';
