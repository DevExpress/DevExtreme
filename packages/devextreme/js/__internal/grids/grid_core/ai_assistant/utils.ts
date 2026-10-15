import messageLocalization from '@js/common/core/localization/message';
import type { ResponseStatus } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import { isObject } from '@js/core/utils/type';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Message } from '@js/ui/chat';
import { custom } from '@js/ui/dialog';
import { current, isCompact, isFluent } from '@js/ui/themes';
import { themeLength } from '@ts/core/utils/theme_length';
import type { BaseDialog, DialogParams } from '@ts/ui/dialog';
import type { z } from 'zod';

import {
  AI_ASSISTANT_AUTHOR_ID,
  AI_ASSISTANT_CONFIRM_DIALOG_COMPACT_WIDTH,
  AI_ASSISTANT_CONFIRM_DIALOG_WIDTH,
} from './const';
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

export const getMessageStatus = (commands: CommandResult[]): ResponseStatus => {
  if (hasCommandErrors(commands) || hasAbortedCommands(commands)) {
    return 'failure';
  }

  return 'success';
};

export const makeOpenAICompatible = (
  { jsonSchema }: { jsonSchema: z.core.JSONSchema.BaseSchema },
): void => {
  if (jsonSchema.type === 'object' && jsonSchema.properties) {
    const propertyNames = Object.keys(jsonSchema.properties);

    if (propertyNames.length > 0) {
      jsonSchema.required = propertyNames;
    }

    jsonSchema.additionalProperties ??= false;
  }
};

/**
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

/** Recursively collects all `$ref` string values from a schema node. */
const collectAllRefs = (node: unknown, refs: Set<string>): void => {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectAllRefs(item, refs);
    }
    return;
  }

  const obj = node as Record<string, unknown>;

  if (typeof obj.$ref === 'string') {
    refs.add(obj.$ref);
  }

  for (const value of Object.values(obj)) {
    collectAllRefs(value, refs);
  }
};

/** Recursively rewrites `$ref` values using an `oldRef → newRef` mapping. Mutates in place. */
const rewriteRefs = (
  node: unknown,
  refMap: Map<string, string>,
): void => {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      rewriteRefs(item, refMap);
    }
    return;
  }

  const obj = node as Record<string, unknown>;

  if (typeof obj.$ref === 'string') {
    const newRef = refMap.get(obj.$ref);

    if (newRef) {
      obj.$ref = newRef;
    }
  }

  for (const value of Object.values(obj)) {
    rewriteRefs(value, refMap);
  }
};

/**
 * Extracts all `$ref` targets from each sub-schema, moves them into a
 * merged top-level `$defs` map, and rewrites every `$ref` to point to
 * `#/$defs/<prefix>_<name>`.
 *
 * OpenAI Structured Outputs requires every `$ref` to resolve against
 * `$defs` at the **root** of the schema. This utility rewrites local
 * references so the combined schema stays valid.
 *
 * **Mutates** the input items in place and returns the merged `$defs`.
 */
export const hoistSchemaRefs = (
  items: { prefix: string; schema: JsonSchema }[],
): JsonSchema => {
  const mergedDefs: JsonSchema = {};

  for (const { prefix, schema } of items) {
    const refs = new Set<string>();
    collectAllRefs(schema, refs);

    if (refs.size === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const refMap = new Map<string, string>();

    for (const ref of refs) {
      const baseName = ref.slice('#/$defs/'.length);
      const prefixedName = `${prefix}_${baseName}`;
      const newRef = `#/$defs/${prefixedName}`;

      refMap.set(ref, newRef);

      const resolved = (schema.$defs as JsonSchema | undefined)?.[baseName];

      if (resolved && typeof resolved === 'object') {
        mergedDefs[prefixedName] = JSON.parse(
          JSON.stringify(resolved),
        );
      }
    }

    if (schema.$defs) {
      delete schema.$defs;
    }

    rewriteRefs(schema, refMap);

    for (const prefixedName of new Set(refMap.values())) {
      const defName = prefixedName.slice('#/$defs/'.length);
      rewriteRefs(mergedDefs[defName], refMap);
    }
  }

  return mergedDefs;
};

const getApplyButtonConfig = (): ButtonProperties => {
  if (isFluent(current())) {
    return {
      stylingMode: 'outlined',
      type: 'normal',
    };
  }

  return {};
};

const getCancelButtonConfig = (): ButtonProperties => {
  if (isFluent(current())) {
    return {
      stylingMode: 'contained',
      type: 'default',
    };
  }

  return {};
};

const getConfirmDialogWidth = (gridElement?: Element | dxElementWrapper): number => {
  const fromTheme = themeLength(gridElement, '--dx-grid-ai-confirm-dialog-width');

  if (fromTheme !== undefined) {
    return fromTheme;
  }
  if (isCompact(current())) {
    return AI_ASSISTANT_CONFIRM_DIALOG_COMPACT_WIDTH;
  }

  return AI_ASSISTANT_CONFIRM_DIALOG_WIDTH;
};

export const createConfirmDialog = (
  options?: DialogParams,
  gridElement?: Element | dxElementWrapper,
): BaseDialog => custom({
  messageHtml: messageLocalization.format('dxDataGrid-aiAssistantAbortConfirmText'),
  showTitle: false,
  dragEnabled: false,
  width: getConfirmDialogWidth(gridElement),
  buttons: [
    {
      text: messageLocalization.format('No'),
      onClick: (): boolean => false,
      ...getCancelButtonConfig(),
    },
    {
      text: messageLocalization.format('Yes'),
      onClick: (): boolean => true,
      ...getApplyButtonConfig(),
    },
  ],
  ...options,
}) as BaseDialog;
