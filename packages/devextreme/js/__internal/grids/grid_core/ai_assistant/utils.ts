import { isObject } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';

import { AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import type { AIMessage, CommandResult, JsonSchema } from './types';

export const isAIMessage = (
  message: Message,
): message is AIMessage => message.author?.id === AI_ASSISTANT_AUTHOR_ID;

export const isUserMessage = (
  message: Message,
  userId: string,
): boolean => message.author?.id === userId;

export const isEnabledOption = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.enabled')
  || (optionName === 'aiAssistant' && isObject(value) && 'enabled' in value);

export const isTitleOption = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.title')
  || (optionName === 'aiAssistant' && isObject(value) && 'title' in value);

export const isPopupOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.popup')
  || (optionName === 'aiAssistant' && isObject(value) && 'popup' in value);

export const isChatOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.chat')
  || (optionName === 'aiAssistant' && isObject(value) && 'chat' in value);

export const hasCommandErrors = (
  commands: CommandResult[] | undefined,
): boolean => !!commands?.some(({ status }) => status === 'failure');

export const hasAbortedCommands = (
  commands: CommandResult[] | undefined,
): boolean => !!commands?.some(({ status }) => status === 'aborted');

export const getMessageStatus = (commands: CommandResult[]): MessageStatus => {
  if (hasCommandErrors(commands) || hasAbortedCommands(commands)) {
    return MessageStatus.Failure;
  }

  return MessageStatus.Success;
};

/**
 * Recursively converts JSON Schema array-style `type`
 * (e.g. `{"type": ["string", "number"]}`) to the equivalent `anyOf` form
 * (e.g. `{"anyOf": [{"type": "string"}, {"type": "number"}]}`).
 *
 * Some structured-output APIs do not support array-style `type` fields
 * and require explicit `anyOf` instead.
 */
export const expandTypeArraysToAnyOf = (
  schema: JsonSchema | undefined,
): JsonSchema | undefined => {
  const SCHEMA_TRAVERSAL_KEYS = [
    'properties', 'items', 'anyOf', 'oneOf', 'allOf',
    'additionalProperties', 'additionalItems', '$defs', 'definitions',
  ] as const;

  const SCHEMA_MAP_KEYS = new Set(['properties', '$defs', 'definitions']);

  const transformNested = (key: string, value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => expandTypeArraysToAnyOf(item as JsonSchema));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    if (SCHEMA_MAP_KEYS.has(key)) {
      return Object.fromEntries(
        Object.entries(value as JsonSchema).map(
          ([k, v]) => [k, expandTypeArraysToAnyOf(v as JsonSchema)],
        ),
      );
    }

    return expandTypeArraysToAnyOf(value as JsonSchema);
  };

  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const result: JsonSchema = { ...schema };

  if (Array.isArray(result.type)) {
    const { type, ...rest } = result;

    return {
      anyOf: (type as string[]).map((t) => ({ type: t })),
      ...rest,
    };
  }

  for (const key of SCHEMA_TRAVERSAL_KEYS) {
    if (key in result) {
      result[key] = transformNested(key, result[key]);
    }
  }

  return result;
};
