import { isObject } from '@js/core/utils/type';

export const isEnabledOption = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.enabled')
  || (optionName === 'aiAssistant' && isObject(value) && 'enabled' in value);

export const isTitleOption = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.title')
  || (optionName === 'aiAssistant' && isObject(value) && 'title' in value);

export const isPopupOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.popup')
  || (optionName === 'aiAssistant' && isObject(value) && 'popup' in value);

export const isChatOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.chat')
  || (optionName === 'aiAssistant' && isObject(value) && 'chat' in value);
