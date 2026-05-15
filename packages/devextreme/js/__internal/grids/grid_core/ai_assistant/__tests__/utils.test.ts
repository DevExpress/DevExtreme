import {
  describe, expect, it,
} from '@jest/globals';
import type { Message } from '@js/ui/chat';

import { AI_ASSISTANT_AUTHOR_ID, MessageStatus } from '../const';
import type { JsonSchema } from '../types';
import {
  expandTypeArraysToAnyOf,
  getMessageStatus,
  hasAbortedCommands,
  hasCommandErrors,
  hoistSchemaRefs,
  isAIMessage,
  isChatOptions,
  isEnabledOption,
  isPopupOptions,
  isTitleOption,
  isUserMessage,
} from '../utils';

describe('isAIMessage', () => {
  it('should return true for message with assistant author id', () => {
    const message = {
      author: { id: AI_ASSISTANT_AUTHOR_ID },
      text: 'response',
    } as Message;

    expect(isAIMessage(message)).toBe(true);
  });

  it('should return false for message with user author id', () => {
    const message = {
      author: { id: 'user', name: 'User' },
      text: 'request',
    } as Message;

    expect(isAIMessage(message)).toBe(false);
  });

  it('should return false for message without author', () => {
    const message = {
      text: 'request',
    } as Message;

    expect(isAIMessage(message)).toBe(false);
  });
});

describe('isUserMessage', () => {
  it('should return true when message author id matches userId', () => {
    const message = {
      author: { id: 'user-1', name: 'User' },
      text: 'request',
    } as Message;

    expect(isUserMessage(message, 'user-1')).toBe(true);
  });

  it('should return false when message author id does not match userId', () => {
    const message = {
      author: { id: 'user-1', name: 'User' },
      text: 'request',
    } as Message;

    expect(isUserMessage(message, 'user-2')).toBe(false);
  });

  it('should return false for AI message', () => {
    const message = {
      author: { id: AI_ASSISTANT_AUTHOR_ID },
      text: 'response',
    } as Message;

    expect(isUserMessage(message, 'user-1')).toBe(false);
  });

  it('should return false for message without author', () => {
    const message = {
      text: 'request',
    } as Message;

    expect(isUserMessage(message, 'user-1')).toBe(false);
  });
});

describe('isEnabledOption', () => {
  it('should return true for enabled option names', () => {
    expect(isEnabledOption('aiAssistant.enabled', true)).toBe(true);
    expect(isEnabledOption('aiAssistant', {
      enabled: false,
      title: 'AI Assistant',
    })).toBe(true);
  });

  it('should return false for non-enabled option names', () => {
    expect(isEnabledOption('aiAssistant.title', 'Title')).toBe(false);
    expect(isEnabledOption('aiAssistant.popup', {})).toBe(false);
    expect(isEnabledOption('aiAssistant', { title: 'Title' })).toBe(false);
    expect(isEnabledOption('aiAssistant', 'string')).toBe(false);
  });
});

describe('isTitleOption', () => {
  it('should return true for title option names', () => {
    expect(isTitleOption('aiAssistant.title', 'New Title')).toBe(true);
    expect(isTitleOption('aiAssistant', {
      title: 'New Title',
      chat: { speechToTextEnabled: false },
    })).toBe(true);
  });

  it('should return false for non-title option names', () => {
    expect(isTitleOption('aiAssistant.enabled', true)).toBe(false);
    expect(isTitleOption('aiAssistant.chat', {})).toBe(false);
    expect(isTitleOption('aiAssistant', { enabled: true })).toBe(false);
    expect(isTitleOption('aiAssistant', 'string')).toBe(false);
  });
});

describe('isPopupOptions', () => {
  it('should return true for popup option names', () => {
    expect(isPopupOptions('aiAssistant.popup', {})).toBe(true);
    expect(isPopupOptions('aiAssistant.popup.width', 400)).toBe(true);
    expect(isPopupOptions('aiAssistant', { popup: { width: 400 } })).toBe(true);
    expect(isPopupOptions('aiAssistant', {
      popup: { width: 400 },
      title: 'AI Assistant',
    })).toBe(true);
  });

  it('should return false for non-popup option names', () => {
    expect(isPopupOptions('aiAssistant.chat', {})).toBe(false);
    expect(isPopupOptions('aiAssistant.enabled', true)).toBe(false);
    expect(isPopupOptions('aiAssistant', { chat: {} })).toBe(false);
    expect(isPopupOptions('aiAssistant', {
      chat: { showAvatar: false },
      title: 'AI Assistant',
    })).toBe(false);
  });
});

describe('isChatOptions', () => {
  it('should return true for chat option names', () => {
    expect(isChatOptions('aiAssistant.chat', {})).toBe(true);
    expect(isChatOptions('aiAssistant.chat.showAvatar', false)).toBe(true);
    expect(isChatOptions('aiAssistant', { chat: { showAvatar: false } })).toBe(true);
    expect(isChatOptions('aiAssistant', {
      chat: { speechToTextEnabled: false },
      title: 'AI Assistant',
    })).toBe(true);
  });

  it('should return false for non-chat option names', () => {
    expect(isChatOptions('aiAssistant.popup', {})).toBe(false);
    expect(isChatOptions('aiAssistant.enabled', true)).toBe(false);
    expect(isChatOptions('aiAssistant', { popup: {} })).toBe(false);
    expect(isChatOptions('aiAssistant', {
      popup: { width: 400 },
      title: 'AI Assistant',
    })).toBe(false);
  });
});

describe('hasCommandErrors', () => {
  it('should return true when commands contain failure status', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'failure' as const, message: 'Failed' },
    ];

    expect(hasCommandErrors(commands)).toBe(true);
  });

  it('should return false when all commands are successful', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
    ];

    expect(hasCommandErrors(commands)).toBe(false);
  });

  it('should return false when commands is undefined', () => {
    expect(hasCommandErrors(undefined)).toBe(false);
  });

  it('should return false when commands contain only aborted status', () => {
    const commands = [
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(hasCommandErrors(commands)).toBe(false);
  });
});

describe('hasAbortedCommands', () => {
  it('should return true when commands contain aborted status', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(hasAbortedCommands(commands)).toBe(true);
  });

  it('should return false when no commands are aborted', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'failure' as const, message: 'Failed' },
    ];

    expect(hasAbortedCommands(commands)).toBe(false);
  });

  it('should return false when commands is undefined', () => {
    expect(hasAbortedCommands(undefined)).toBe(false);
  });
});

describe('getMessageStatus', () => {
  it('should return Success when all commands are successful', () => {
    const commands = [
      { status: 'success' as const, message: 'Sorted' },
      { status: 'success' as const, message: 'Filtered' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Success);
  });

  it('should return Failure when commands contain errors', () => {
    const commands = [
      { status: 'success' as const, message: 'Sorted' },
      { status: 'failure' as const, message: 'Failed to filter' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Failure);
  });

  it('should return Failure when commands contain aborted items', () => {
    const commands = [
      { status: 'success' as const, message: 'Sorted' },
      { status: 'aborted' as const, message: 'Filter was aborted' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Failure);
  });

  it('should return Failure when commands contain both errors and aborted items', () => {
    const commands = [
      { status: 'failure' as const, message: 'Failed' },
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Failure);
  });

  it('should return Success when commands array is empty', () => {
    expect(getMessageStatus([])).toBe(MessageStatus.Success);
  });
});

describe('expandTypeArraysToAnyOf', () => {
  it('returns undefined for undefined input', () => {
    expect(expandTypeArraysToAnyOf(undefined)).toBeUndefined();
  });

  it('returns schema unchanged when type is a plain string', () => {
    const schema: JsonSchema = { type: 'string' };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({ type: 'string' });
  });

  it('returns schema unchanged when there is no type field', () => {
    const schema: JsonSchema = { enum: ['a', 'b'] };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({ enum: ['a', 'b'] });
  });

  it('converts array-style type to anyOf', () => {
    const schema: JsonSchema = { type: ['string', 'number'] };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      anyOf: [{ type: 'string' }, { type: 'number' }],
    });
  });

  it('preserves sibling fields when converting type array', () => {
    const schema: JsonSchema = {
      type: ['string', 'null'],
      description: 'A value',
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      description: 'A value',
    });
  });

  it('converts type array with a single element', () => {
    const schema: JsonSchema = { type: ['string'] };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      anyOf: [{ type: 'string' }],
    });
  });

  it('recurses into properties', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        value: { type: ['string', 'number', 'boolean', 'null'] },
      },
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      type: 'object',
      properties: {
        value: {
          anyOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'null' },
          ],
        },
      },
    });
  });

  it('recurses into anyOf array', () => {
    const schema: JsonSchema = {
      anyOf: [
        { type: ['string', 'null'] },
        { type: 'number' },
      ],
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      anyOf: [
        { anyOf: [{ type: 'string' }, { type: 'null' }] },
        { type: 'number' },
      ],
    });
  });

  it('recurses into items (object)', () => {
    const schema: JsonSchema = {
      type: 'array',
      items: { type: ['string', 'number'] },
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      type: 'array',
      items: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    });
  });

  it('recurses into items (array of schemas)', () => {
    const schema: JsonSchema = {
      type: 'array',
      items: [
        { type: ['string', 'number'] },
        { type: 'boolean' },
      ],
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      type: 'array',
      items: [
        { anyOf: [{ type: 'string' }, { type: 'number' }] },
        { type: 'boolean' },
      ],
    });
  });

  it('recurses into $defs', () => {
    const schema: JsonSchema = {
      type: 'object',
      $defs: {
        myType: { type: ['string', 'null'] },
      },
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      type: 'object',
      $defs: {
        myType: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
    });
  });

  it('handles deeply nested structures', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        filter: {
          anyOf: [
            {
              type: 'object',
              properties: {
                value: { type: ['string', 'number', 'boolean', 'null'] },
              },
            },
          ],
        },
      },
    };
    expect(expandTypeArraysToAnyOf(schema)).toEqual({
      type: 'object',
      properties: {
        filter: {
          anyOf: [
            {
              type: 'object',
              properties: {
                value: {
                  anyOf: [
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'boolean' },
                    { type: 'null' },
                  ],
                },
              },
            },
          ],
        },
      },
    });
  });

  it('does not mutate the original schema', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        x: { type: ['string', 'number'] },
      },
    };
    const original = JSON.parse(JSON.stringify(schema));
    expandTypeArraysToAnyOf(schema);
    expect(schema).toEqual(original);
  });
});

describe('hoistSchemaRefs', () => {
  it('returns empty object when no schemas have $ref', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: { x: { type: 'string' } },
    };

    const result = hoistSchemaRefs([{ prefix: 'test', schema }]);

    expect(result).toEqual({});
    expect(schema.$defs).toBeUndefined();
  });

  it('returns empty object for empty input array', () => {
    expect(hoistSchemaRefs([])).toEqual({});
  });

  describe('$defs-based refs', () => {
    it('hoists $defs and removes them from the sub-schema', () => {
      const schema: JsonSchema = {
        type: 'object',
        $defs: {
          MyType: { type: 'string' },
        },
        properties: {
          value: { $ref: '#/$defs/MyType' },
        },
      };

      const result = hoistSchemaRefs([
        { prefix: 'test', schema },
      ]);

      expect(result).toEqual({
        test_MyType: { type: 'string' },
      });
      expect(schema.$defs).toBeUndefined();
      const props = schema.properties as JsonSchema;
      expect(props.value).toEqual({
        $ref: '#/$defs/test_MyType',
      });
    });

    it('rewrites $ref inside $defs themselves', () => {
      const schema: JsonSchema = {
        type: 'object',
        $defs: {
          Expr: {
            anyOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  child: { $ref: '#/$defs/Expr' },
                },
              },
            ],
          },
        },
        properties: {
          root: { $ref: '#/$defs/Expr' },
        },
      };

      const result = hoistSchemaRefs([
        { prefix: 'filter', schema },
      ]);

      expect(result).toEqual({
        filter_Expr: {
          anyOf: [
            { type: 'string' },
            {
              type: 'object',
              properties: {
                child: { $ref: '#/$defs/filter_Expr' },
              },
            },
          ],
        },
      });
      const props = schema.properties as JsonSchema;
      expect(props.root).toEqual({
        $ref: '#/$defs/filter_Expr',
      });
    });

    it('avoids collisions via prefix', () => {
      const schemaA: JsonSchema = {
        type: 'object',
        $defs: { Shared: { type: 'number' } },
        properties: { a: { $ref: '#/$defs/Shared' } },
      };
      const schemaB: JsonSchema = {
        type: 'object',
        $defs: { Shared: { type: 'string' } },
        properties: { b: { $ref: '#/$defs/Shared' } },
      };

      const result = hoistSchemaRefs([
        { prefix: 'sortA', schema: schemaA },
        { prefix: 'sortB', schema: schemaB },
      ]);

      expect(result).toEqual({
        sortA_Shared: { type: 'number' },
        sortB_Shared: { type: 'string' },
      });
      const propsA = schemaA.properties as JsonSchema;
      const propsB = schemaB.properties as JsonSchema;
      expect(propsA.a).toEqual({
        $ref: '#/$defs/sortA_Shared',
      });
      expect(propsB.b).toEqual({
        $ref: '#/$defs/sortB_Shared',
      });
    });

    it('handles schemas with multiple $defs entries', () => {
      const schema: JsonSchema = {
        type: 'object',
        $defs: {
          TypeA: { type: 'string' },
          TypeB: { type: 'number' },
        },
        properties: {
          a: { $ref: '#/$defs/TypeA' },
          b: { $ref: '#/$defs/TypeB' },
        },
      };

      const result = hoistSchemaRefs([
        { prefix: 'sort', schema },
      ]);

      expect(result).toEqual({
        sort_TypeA: { type: 'string' },
        sort_TypeB: { type: 'number' },
      });
      const props = schema.properties as JsonSchema;
      expect(props.a).toEqual({
        $ref: '#/$defs/sort_TypeA',
      });
      expect(props.b).toEqual({
        $ref: '#/$defs/sort_TypeB',
      });
    });
  });

  describe('inline-path refs', () => {
    it('hoists an inline $ref to root-level $defs', () => {
      const schema: JsonSchema = {
        type: 'object',
        properties: {
          expr: {
            anyOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  child: { $ref: '#/properties/expr' },
                },
              },
            ],
          },
        },
      };

      const result = hoistSchemaRefs([
        { prefix: 'test', schema },
      ]);

      expect(result.test_properties_expr).toBeDefined();

      const props = schema.properties as JsonSchema;
      const exprNode = props.expr as JsonSchema;
      const branches = exprNode.anyOf as JsonSchema[];
      expect(branches[1].properties).toEqual({
        child: { $ref: '#/$defs/test_properties_expr' },
      });
    });

    it('handles recursive inline $ref', () => {
      const schema: JsonSchema = {
        type: 'object',
        properties: {
          expression: {
            anyOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      type: { type: 'string', const: 'basic' },
                      field: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                  {
                    type: 'object',
                    properties: {
                      type: { type: 'string', const: 'combined' },
                      left: { $ref: '#/properties/expression/anyOf/0' },
                      right: { $ref: '#/properties/expression/anyOf/0' },
                    },
                    additionalProperties: false,
                  },
                ],
              },
              { type: 'null' },
            ],
          },
        },
      };

      const result = hoistSchemaRefs([
        { prefix: 'filter', schema },
      ]);

      const defName = 'filter_properties_expression_anyOf_0';
      expect(result[defName]).toBeDefined();

      const props = schema.properties as JsonSchema;
      const exprNode = props.expression as JsonSchema;
      const exprAnyOf = exprNode.anyOf as JsonSchema[];
      const innerAnyOf = exprAnyOf[0].anyOf as JsonSchema[];
      expect(innerAnyOf[1].properties).toEqual(
        expect.objectContaining({
          left: { $ref: `#/$defs/${defName}` },
          right: { $ref: `#/$defs/${defName}` },
        }),
      );

      const hoistedDef = result[defName] as JsonSchema;
      const hoistedInner = hoistedDef.anyOf as JsonSchema[];
      const hoistedProps = hoistedInner[1].properties as JsonSchema;
      expect(hoistedProps.left).toEqual({
        $ref: `#/$defs/${defName}`,
      });
      expect(hoistedProps.right).toEqual({
        $ref: `#/$defs/${defName}`,
      });
    });
  });

  it('skips schemas without $ref', () => {
    const schemaWithRefs: JsonSchema = {
      type: 'object',
      $defs: { Foo: { type: 'boolean' } },
      properties: { x: { $ref: '#/$defs/Foo' } },
    };
    const schemaWithout: JsonSchema = {
      type: 'object',
      properties: { y: { type: 'string' } },
    };

    const result = hoistSchemaRefs([
      { prefix: 'a', schema: schemaWithRefs },
      { prefix: 'b', schema: schemaWithout },
    ]);

    expect(result).toEqual({
      a_Foo: { type: 'boolean' },
    });
    expect(schemaWithout).toEqual({
      type: 'object',
      properties: { y: { type: 'string' } },
    });
  });

  it('rewrites deeply nested $ref in arrays', () => {
    const schema: JsonSchema = {
      type: 'object',
      $defs: {
        Item: { type: 'string' },
      },
      properties: {
        list: {
          type: 'array',
          items: {
            anyOf: [
              { $ref: '#/$defs/Item' },
              { type: 'null' },
            ],
          },
        },
      },
    };

    const result = hoistSchemaRefs([
      { prefix: 'p', schema },
    ]);

    expect(result).toEqual({ p_Item: { type: 'string' } });

    const props = schema.properties as JsonSchema;
    const listNode = props.list as JsonSchema;
    const items = listNode.items as JsonSchema;
    const itemsAnyOf = items.anyOf as JsonSchema[];
    expect(itemsAnyOf[0]).toEqual({ $ref: '#/$defs/p_Item' });
  });
});
