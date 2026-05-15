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

/** Resolves a JSON Pointer (e.g. `#/properties/expr/anyOf/0`) within a schema. */
const resolveJsonPointer = (
  schema: JsonSchema,
  pointer: string,
): unknown => {
  if (!pointer.startsWith('#/')) {
    return undefined;
  }

  const segments = pointer.slice(2).split('/');
  let current: unknown = schema;

  for (const segment of segments) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
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
 * Derives a definition name from a `$ref` path.
 *
 * `#/$defs/MyType` → `"MyType"`,
 * `#/properties/expression/anyOf/0` → `"properties_expression_anyOf_0"`
 */
const defNameFromRef = (ref: string): string => {
  if (ref.startsWith('#/$defs/')) {
    return ref.slice(8);
  }

  return ref.slice(2).replace(/\//g, '_');
};

/**
 * Extracts all `$ref` targets from each sub-schema, moves them into a
 * merged top-level `$defs` map, and rewrites every `$ref` to point to
 * `#/$defs/<prefix>_<name>`.
 *
 * Handles both `$defs`-based (`$ref: "#/$defs/Foo"`) and inline-path
 * (`$ref: "#/properties/expression/anyOf/0"`) references that
 * `zodToJsonSchema` may produce.
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
      const baseName = defNameFromRef(ref);
      const prefixedName = `${prefix}_${baseName}`;
      const newRef = `#/$defs/${prefixedName}`;

      refMap.set(ref, newRef);

      const resolved = ref.startsWith('#/$defs/')
        ? (schema.$defs as JsonSchema | undefined)?.[baseName]
        : resolveJsonPointer(schema, ref);

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
