import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { ExecuteGridAssistantAction } from '@js/common/ai-integration';
import { logger } from '@ts/core/utils/m_console';
import { z } from 'zod';

import type { InternalGrid } from '../../m_types';
import { GridCommands } from '../grid_commands';
import type {
  CommandCallbacks,
  CommandResult,
  CustomizeResponseText,
  GridCommand,
  JsonSchema,
  ResponseSchemaBranch,
} from '../types';

interface SchemaShape {
  $schema?: string;
  type: string;
  required: string[];
  additionalProperties: boolean;
  properties: {
    actions: {
      type: string;
      description: string;
      items: { anyOf: ResponseSchemaBranch['branch'][] };
    };
  };
}

const createMockComponent = (): InternalGrid => ({}) as InternalGrid;

const createMockCommand = (
  name: string,
  overrides: Partial<GridCommand> = {},
): GridCommand => ({
  name,
  description: `Test command: ${name}`,
  schema: z.object({}),
  execute: (
    _component: InternalGrid,
    { success }: CommandCallbacks,
  ) => (): Promise<CommandResult> => Promise.resolve(success()),
  ...overrides,
});

describe('GridCommands', () => {
  describe('constructor', () => {
    it('should accept an empty commands array', () => {
      const component = createMockComponent();

      expect(() => new GridCommands(component, [])).not.toThrow();
    });

    it('should store component for use by executeCommands', async () => {
      const component = createMockComponent();
      const executeSpy = jest.fn(
        (
          _comp: InternalGrid,
          { success }: CommandCallbacks,
        ) => (): Promise<CommandResult> => Promise.resolve(success('done')),
      );
      const command = createMockCommand('test', { execute: executeSpy });
      const gridCommands = new GridCommands(component, [command]);

      await gridCommands.executeCommands([{ name: 'test', args: {} }]);

      expect(executeSpy).toHaveBeenCalledWith(
        component,
        expect.objectContaining({
          success: expect.any(Function),
          failure: expect.any(Function),
        }),
      );
    });

    it('should store commands in an internal registry indexed by name', () => {
      const component = createMockComponent();
      const commandA = createMockCommand('commandA');
      const commandB = createMockCommand('commandB');
      const gridCommands = new GridCommands(
        component,
        [commandA, commandB],
      );

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const commandNames = schema.properties.actions.items.anyOf.map(
        (branch) => branch.properties.name.enum[0],
      );

      expect(commandNames).toEqual(['commandA', 'commandB']);
    });

    it('should log a console error if duplicate command names are provided', () => {
      const component = createMockComponent();
      const command1 = createMockCommand('duplicate');
      const command2 = createMockCommand('duplicate');
      const loggerSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
      // eslint-disable-next-line no-new
      new GridCommands(component, [command1, command2]);

      expect(loggerSpy).toHaveBeenCalledWith('Duplicate command name: "duplicate"');
      loggerSpy.mockRestore();
    });
  });

  describe('success helper', () => {
    it('should return CommandResult with status success and default message when called without argument', async () => {
      const component = createMockComponent();
      const command = createMockCommand('test', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success()),
      });
      const gridCommands = new GridCommands(component, [command]);

      const results = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);

      expect(results[0].status).toBe('success');
      expect(typeof results[0].message).toBe('string');
    });

    it('should return CommandResult with status success and custom message', async () => {
      const component = createMockComponent();
      const command = createMockCommand('test', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success('Custom msg')),
      });
      const gridCommands = new GridCommands(component, [command]);

      const results = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);

      expect(results[0]).toEqual({
        status: 'success',
        message: 'Custom msg',
      });
    });
  });

  describe('failure helper', () => {
    it('should return CommandResult with status failure and default message when called without argument', async () => {
      const component = createMockComponent();
      const command = createMockCommand('test', {
        execute: (_comp, { failure }) => (): Promise<CommandResult> => Promise.resolve(failure()),
      });
      const gridCommands = new GridCommands(component, [command]);

      const results = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);

      expect(results[0].status).toBe('failure');
      expect(typeof results[0].message).toBe('string');
    });

    it('should return CommandResult with status failure and custom message', async () => {
      const component = createMockComponent();
      const command = createMockCommand('test', {
        execute: (_comp, { failure }) => (): Promise<CommandResult> => Promise.resolve(failure('Custom msg')),
      });
      const gridCommands = new GridCommands(component, [command]);

      const results = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);

      expect(results[0]).toEqual({
        status: 'failure',
        message: 'Custom msg',
      });
    });
  });

  describe('buildResponseSchema', () => {
    it('should return valid JSON Schema object without $schema field', () => {
      const gridCommands = new GridCommands(createMockComponent(), []);
      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;

      expect(schema.$schema).toBeUndefined();
      expect(schema.type).toBe('object');
      expect(schema.required).toEqual(['actions']);
      expect(schema.additionalProperties).toBe(false);
    });

    it('should have anyOf with one branch per registered command', () => {
      const commandA = createMockCommand('commandA');
      const commandB = createMockCommand('commandB');
      const gridCommands = new GridCommands(
        createMockComponent(),
        [commandA, commandB],
      );

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const { anyOf } = schema.properties.actions.items;

      expect(anyOf).toHaveLength(2);
    });

    it('should include description from GridCommand.description in each branch', () => {
      const command = createMockCommand('sorting', {
        description: 'Apply sorting to one or more columns',
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const branch = schema.properties.actions.items.anyOf[0];

      expect(branch.description).toBe('Apply sorting to one or more columns');
    });

    it('should have name.enum with exactly one command name in each branch', () => {
      const command = createMockCommand('sorting');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const branch = schema.properties.actions.items.anyOf[0];

      expect(branch.properties.name).toEqual({
        type: 'string',
        enum: ['sorting'],
      });
    });

    it('should have args with command schema including additionalProperties false', () => {
      const command = createMockCommand('test', {
        schema: z.object({
          dataField: z.string(),
          sortOrder: z.enum(['asc', 'desc']),
        }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const args = schema.properties.actions.items.anyOf[0].properties.args as JsonSchema;

      expect(args.type).toBe('object');
      expect(args.additionalProperties).toBe(false);
      expect(args.required).toEqual(['dataField', 'sortOrder']);
      expect(args.properties).toBeDefined();
    });

    it('should set additionalProperties false on every object level', () => {
      const command = createMockCommand('test');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;

      // Root level
      expect(schema.additionalProperties).toBe(false);
      // Branch level
      const branch = schema.properties.actions.items.anyOf[0];
      expect(branch.additionalProperties).toBe(false);
      // Args level
      expect((branch.properties.args as JsonSchema).additionalProperties).toBe(false);
    });

    it('should not have anyOf at root schema level', () => {
      const command = createMockCommand('test');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as Record<string, unknown>;

      expect(schema.anyOf).toBeUndefined();
      expect(schema.oneOf).toBeUndefined();
      expect(schema.allOf).toBeUndefined();
    });

    it('should return empty anyOf with no commands registered', () => {
      const gridCommands = new GridCommands(createMockComponent(), []);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const { anyOf } = schema.properties.actions.items;

      expect(anyOf).toEqual([]);
    });

    it('should produce empty args schema for no-arg commands', () => {
      const command = createMockCommand('clearSorting');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const args = schema.properties.actions.items.anyOf[0].properties.args as JsonSchema;

      expect(args.type).toBe('object');
      expect(args.additionalProperties).toBe(false);
      expect(args.properties).toEqual({});
    });

    it('should produce different schemas for different command registries', () => {
      const gc1 = new GridCommands(createMockComponent(), [
        createMockCommand('commandA'),
      ]);
      const gc2 = new GridCommands(createMockComponent(), [
        createMockCommand('commandB'),
      ]);

      const schema1 = gc1.buildResponseSchema() as unknown as SchemaShape;
      const schema2 = gc2.buildResponseSchema() as unknown as SchemaShape;

      const names1 = schema1.properties.actions.items.anyOf.map(
        (b) => b.properties.name.enum[0],
      );
      const names2 = schema2.properties.actions.items.anyOf.map(
        (b) => b.properties.name.enum[0],
      );

      expect(names1).toEqual(['commandA']);
      expect(names2).toEqual(['commandB']);
    });

    it('should produce correct required array for commands with required fields', () => {
      const command = createMockCommand('test', {
        schema: z.object({
          field1: z.string(),
          field2: z.number().optional(),
        }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as unknown as SchemaShape;
      const args = schema.properties.actions.items.anyOf[0].properties.args as JsonSchema;

      // openai target makes all fields required (optional becomes nullable)
      expect(args.required).toEqual(['field1', 'field2']);
    });

    it('should hoist $defs to root level for commands with recursive schemas (z.lazy)', () => {
      const recursiveSchema: z.ZodType<{ child: unknown } | string> = z.lazy(() => z.union([
        z.string(),
        z.object({ child: recursiveSchema }).strict(),
      ]));

      const command = createMockCommand('recursive', {
        schema: z.object({ expr: recursiveSchema }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as Record<string, unknown>;

      // $defs should exist at root level
      expect(schema.$defs).toBeDefined();
      expect(typeof schema.$defs).toBe('object');

      // No $defs should remain nested inside the branch args
      const props = schema.properties as Record<string, unknown>;
      const actions = props.actions as Record<string, unknown>;
      const items = actions.items as Record<string, unknown>;
      const branches = items.anyOf as Record<string, unknown>[];
      const branchProps = branches[0].properties as Record<string, unknown>;
      const args = branchProps.args as Record<string, unknown>;
      expect(args.$defs).toBeUndefined();

      // All $ref values in the schema should resolve to keys in root $defs
      const defs = schema.$defs as Record<string, unknown>;
      const allRefs: string[] = [];
      const collectRefs = (obj: unknown): void => {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) { obj.forEach(collectRefs); return; }
        const record = obj as Record<string, unknown>;
        if (typeof record.$ref === 'string') allRefs.push(record.$ref);
        Object.values(record).forEach(collectRefs);
      };
      collectRefs(schema);

      for (const ref of allRefs) {
        const match = /^#\/\$defs\/(.+)$/.exec(ref);
        expect(match).not.toBeNull();
        if (match) {
          expect(defs[match[1]]).toBeDefined();
        }
      }
    });

    it('should not add $defs to root when no command uses $ref', () => {
      const command = createMockCommand('simple', {
        schema: z.object({ value: z.string() }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const schema = gridCommands.buildResponseSchema() as Record<string, unknown>;

      expect(schema.$defs).toBeUndefined();
    });

    it('should rewrite all inline $ref to #/$defs/ for recursive schemas', () => {
      const filterOps = z.enum(['=', '<>', 'contains']);
      const basicExpr = z.object({
        type: z.literal('basic'),
        field: z.string(),
        op: filterOps,
        value: z.union([z.string(), z.number(), z.null()]),
      }).strict();
      const exprSchema: z.ZodType<unknown> = z.lazy(() => z.union([
        basicExpr,
        z.object({
          type: z.literal('combined'),
          left: exprSchema,
          combiner: z.enum(['and', 'or']),
          right: exprSchema,
        }).strict(),
      ]));
      const filterCommand = createMockCommand('filterValue', {
        schema: z.object({
          expression: exprSchema.nullable(),
        }).strict(),
      });
      const gridCommands = new GridCommands(
        createMockComponent(),
        [filterCommand],
      );

      const schema = gridCommands.buildResponseSchema();
      const json = JSON.stringify(schema);

      // No $ref should contain inline paths
      expect(json).not.toMatch(/"\$ref"\s*:\s*"#\/properties\//);

      // $defs should be at root
      expect(schema.$defs).toBeDefined();
    });
  });

  describe('validateResponse', () => {
    it('should return true for valid response with known command names and correct args', () => {
      const command = createMockCommand('test', {
        schema: z.object({ value: z.string() }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [{ name: 'test', args: { value: 'hello' } }],
      );

      expect(result).toBe(true);
    });

    it('should return false if any action has an unknown name', () => {
      const command = createMockCommand('known');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [{ name: 'unknown', args: {} }],
      );

      expect(result).toBe(false);
    });

    it('should return false if any action name is not a string', () => {
      const gridCommands = new GridCommands(createMockComponent(), [
        createMockCommand('test'),
      ]);

      expect(gridCommands.validate(
        [{ name: 123 as unknown as string, args: {} }],
      )).toBe(false);

      expect(gridCommands.validate(
        [{ name: true as unknown as string, args: {} }],
      )).toBe(false);
    });

    it('should return false if any action name is an empty string', () => {
      const gridCommands = new GridCommands(createMockComponent(), [
        createMockCommand('test'),
      ]);

      const result = gridCommands.validate(
        [{ name: '', args: {} }],
      );

      expect(result).toBe(false);
    });

    it('should return false if any action is missing name or args', () => {
      const gridCommands = new GridCommands(createMockComponent(), [
        createMockCommand('test'),
      ]);

      expect(gridCommands.validate(
        [{ args: {} }] as unknown as ExecuteGridAssistantAction[],
      )).toBe(false);

      expect(gridCommands.validate(
        [{ name: 'test' }] as unknown as ExecuteGridAssistantAction[],
      )).toBe(false);
    });

    it('should return false if any action args is null', () => {
      const gridCommands = new GridCommands(createMockComponent(), [
        createMockCommand('test'),
      ]);

      const result = gridCommands.validate(
        [{ name: 'test', args: null as unknown as Record<string, unknown> }],
      );

      expect(result).toBe(false);
    });

    it('should return false if any action args has wrong types for required properties', () => {
      const command = createMockCommand('test', {
        schema: z.object({ value: z.string() }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [{ name: 'test', args: { value: 123 } }],
      );

      expect(result).toBe(false);
    });

    it('should return false if any action args is missing required properties', () => {
      const command = createMockCommand('test', {
        schema: z.object({ value: z.string() }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [{ name: 'test', args: {} }],
      );

      expect(result).toBe(false);
    });

    it('should return false if any action args contains extra properties', () => {
      const command = createMockCommand('test', {
        schema: z.object({ value: z.string() }),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [{ name: 'test', args: { value: 'ok', extra: true } }],
      );

      expect(result).toBe(false);
    });

    it('should return true for an empty actions array', () => {
      const gridCommands = new GridCommands(createMockComponent(), []);

      const result = gridCommands.validate([]);

      expect(result).toBe(true);
    });

    it('should return true for no-arg commands when args is empty object', () => {
      const command = createMockCommand('clearFilter');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [{ name: 'clearFilter', args: {} }],
      );

      expect(result).toBe(true);
    });

    it('should reject entire response on first mismatch', () => {
      const command = createMockCommand('valid');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const result = gridCommands.validate(
        [
          { name: 'valid', args: {} },
          { name: 'invalid', args: {} },
        ],
      );

      expect(result).toBe(false);
    });
  });

  describe('executeCommands', () => {
    it('should return empty array for empty commands', async () => {
      const gridCommands = new GridCommands(createMockComponent(), []);

      const results = await gridCommands.executeCommands([]);

      expect(results).toEqual([]);
    });

    it('should execute commands in the order provided', async () => {
      const executionOrder: string[] = [];

      const commandA = createMockCommand('a', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          executionOrder.push('a');
          return Promise.resolve(success());
        },
      });
      const commandB = createMockCommand('b', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          executionOrder.push('b');
          return Promise.resolve(success());
        },
      });
      const commandC = createMockCommand('c', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          executionOrder.push('c');
          return Promise.resolve(success());
        },
      });
      const gridCommands = new GridCommands(
        createMockComponent(),
        [commandA, commandB, commandC],
      );

      await gridCommands.executeCommands([
        { name: 'a', args: {} },
        { name: 'b', args: {} },
        { name: 'c', args: {} },
      ]);

      expect(executionOrder).toEqual(['a', 'b', 'c']);
    });

    it('should await each command before starting the next', async () => {
      const executionOrder: string[] = [];

      const commandA = createMockCommand('a', {
        execute: (_comp, { success }) => async (): Promise<CommandResult> => {
          // eslint-disable-next-line no-restricted-globals
          await new Promise((resolve) => { setTimeout(resolve, 50); });
          executionOrder.push('a');
          return success();
        },
      });
      const commandB = createMockCommand('b', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          executionOrder.push('b');
          return Promise.resolve(success());
        },
      });
      const gridCommands = new GridCommands(
        createMockComponent(),
        [commandA, commandB],
      );

      await gridCommands.executeCommands([
        { name: 'a', args: {} },
        { name: 'b', args: {} },
      ]);

      expect(executionOrder).toEqual(['a', 'b']);
    });

    it('should return one CommandResult per executed command', async () => {
      const commandA = createMockCommand('a');
      const commandB = createMockCommand('b');
      const gridCommands = new GridCommands(
        createMockComponent(),
        [commandA, commandB],
      );

      const results = await gridCommands.executeCommands([
        { name: 'a', args: {} },
        { name: 'b', args: {} },
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('success');
      expect(results[1].status).toBe('success');
    });

    it('should produce failure result when executor throws synchronously', async () => {
      const command = createMockCommand('throwing', {
        execute: () => (): Promise<CommandResult> => {
          throw new Error('sync error');
        },
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const results = await gridCommands.executeCommands([
        { name: 'throwing', args: {} },
      ]);

      expect(results[0].status).toBe('failure');
    });

    it('should produce failure result when async executor rejects', async () => {
      const command = createMockCommand('rejecting', {
        execute: () => (): Promise<CommandResult> => Promise.reject(new Error('async error')),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const results = await gridCommands.executeCommands([
        { name: 'rejecting', args: {} },
      ]);

      expect(results[0].status).toBe('failure');
    });

    it('should log "Error executing command" when executor throws', async () => {
      const error = new Error('something went wrong');
      const command = createMockCommand('failing', {
        execute: () => (): Promise<CommandResult> => Promise.reject(error),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);
      const loggerSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});

      await gridCommands.executeCommands([
        { name: 'failing', args: {} },
      ]);

      expect(loggerSpy).toHaveBeenCalledWith('Error executing command "failing":', error);
      loggerSpy.mockRestore();
    });

    it('should throw for unknown command name', async () => {
      const gridCommands = new GridCommands(createMockComponent(), [
        createMockCommand('known'),
      ]);

      await expect(
        gridCommands.executeCommands([{ name: 'unknown', args: {} }]),
      ).rejects.toThrow('Unknown command: unknown');
    });

    it('should reset _executing after unknown command throw so subsequent calls work', async () => {
      const command = createMockCommand('known');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      await expect(
        gridCommands.executeCommands([{ name: 'unknown', args: {} }]),
      ).rejects.toThrow();

      const results = await gridCommands.executeCommands([
        { name: 'known', args: {} },
      ]);

      expect(results[0].status).toBe('success');
    });

    it('should throw if called while another executeCommands is in progress', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const blockingCommand = createMockCommand('blocking', {
        execute: (_comp, { success }) => async (): Promise<CommandResult> => {
          await expect(
            gridCommands.executeCommands([]),
          ).rejects.toThrow('executeCommands is already in progress');
          return success();
        },
      });

      gridCommands = new GridCommands(component, [blockingCommand]);

      await gridCommands.executeCommands([
        { name: 'blocking', args: {} },
      ]);
    });

    it('should allow subsequent calls after first call completes', async () => {
      const command = createMockCommand('test');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const results1 = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);
      const results2 = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);

      expect(results1[0].status).toBe('success');
      expect(results2[0].status).toBe('success');
    });

    it('should record success and failure statuses correctly', async () => {
      const successCommand = createMockCommand('ok', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success()),
      });
      const failCommand = createMockCommand('fail', {
        execute: (_comp, { failure }) => (): Promise<CommandResult> => Promise.resolve(failure()),
      });
      const gridCommands = new GridCommands(
        createMockComponent(),
        [successCommand, failCommand],
      );

      const results = await gridCommands.executeCommands([
        { name: 'ok', args: {} },
        { name: 'fail', args: {} },
      ]);

      expect(results[0].status).toBe('success');
      expect(results[1].status).toBe('failure');
    });
  });

  describe('abort', () => {
    it('should stop execution mid-way and return partial results plus one aborted entry', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const first = createMockCommand('first', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          gridCommands.abort();
          return Promise.resolve(success('first done'));
        },
      });
      const second = createMockCommand('second');
      const third = createMockCommand('third');

      gridCommands = new GridCommands(component, [first, second, third]);

      const results = await gridCommands.executeCommands([
        { name: 'first', args: {} },
        { name: 'second', args: {} },
        { name: 'third', args: {} },
      ]);

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({ status: 'success', message: 'first done' });
      expect(results[1].status).toBe('aborted');
    });

    it('should be idempotent - calling multiple times has no additional effect', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const first = createMockCommand('first', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          gridCommands.abort();
          gridCommands.abort();
          gridCommands.abort();
          return Promise.resolve(success());
        },
      });
      const second = createMockCommand('second');

      gridCommands = new GridCommands(component, [first, second]);

      const results = await gridCommands.executeCommands([
        { name: 'first', args: {} },
        { name: 'second', args: {} },
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('success');
      expect(results[1].status).toBe('aborted');
    });

    it('should only add one aborted entry for the first skipped command', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const first = createMockCommand('first', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          gridCommands.abort();
          return Promise.resolve(success());
        },
      });
      const second = createMockCommand('second');
      const third = createMockCommand('third');
      const fourth = createMockCommand('fourth');

      gridCommands = new GridCommands(
        component,
        [first, second, third, fourth],
      );

      const results = await gridCommands.executeCommands([
        { name: 'first', args: {} },
        { name: 'second', args: {} },
        { name: 'third', args: {} },
        { name: 'fourth', args: {} },
      ]);

      expect(results).toHaveLength(2);
      expect(results[1].status).toBe('aborted');
    });

    it('should reset _aborted on next successful executeCommands start', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const abortSimulation = createMockCommand('abort', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          gridCommands.abort();
          return Promise.resolve(success());
        },
      });
      const normal = createMockCommand('normal');

      gridCommands = new GridCommands(component, [abortSimulation, normal]);

      // First call: abort triggered during execution
      const results1 = await gridCommands.executeCommands([
        { name: 'abort', args: {} },
        { name: 'normal', args: {} },
      ]);
      expect(results1[1].status).toBe('aborted');

      // Second call: _aborted was reset, runs normally
      const results2 = await gridCommands.executeCommands([
        { name: 'normal', args: {} },
      ]);
      expect(results2[0].status).toBe('success');
    });

    it('should not reset _aborted when concurrent call is rejected by reentrancy guard', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const blockingCommand = createMockCommand('blocking', {
        execute: (_comp, { success }) => async (): Promise<CommandResult> => {
          gridCommands.abort();
          try {
            await gridCommands.executeCommands([]);
          } catch {
            // Expected: reentrancy rejection
          }
          return success();
        },
      });
      const nextCommand = createMockCommand('next');

      gridCommands = new GridCommands(component, [blockingCommand, nextCommand]);

      const results = await gridCommands.executeCommands([
        { name: 'blocking', args: {} },
        { name: 'next', args: {} },
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('success');
      expect(results[1].status).toBe('aborted');
    });
  });

  describe('isExecuting', () => {
    it('should return false before executeCommands is called', () => {
      const gridCommands = new GridCommands(createMockComponent(), []);

      expect(gridCommands.isExecuting()).toBe(false);
    });

    it('should return false after executeCommands completes', async () => {
      const gridCommands = new GridCommands(createMockComponent(), []);

      await gridCommands.executeCommands([]);

      expect(gridCommands.isExecuting()).toBe(false);
    });

    it('should return true while executeCommands is in progress', async () => {
      const component = createMockComponent();
      let capturedIsExecuting = false;
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const executeSpy = jest.fn((
        _comp: InternalGrid,
        { success }: CommandCallbacks,
      ) => (): Promise<CommandResult> => {
        capturedIsExecuting = gridCommands.isExecuting();
        return Promise.resolve(success());
      });
      const spyCommand = createMockCommand('spy', {
        execute: executeSpy,
      });
      gridCommands = new GridCommands(component, [spyCommand]);

      await gridCommands.executeCommands([
        { name: 'spy', args: {} },
      ]);

      expect(capturedIsExecuting).toBe(true);
    });

    it('should return false after abort-induced exit', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const abortSimulation = createMockCommand('abort', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          gridCommands.abort();
          return Promise.resolve(success());
        },
      });
      const next = createMockCommand('next');

      gridCommands = new GridCommands(component, [abortSimulation, next]);

      await gridCommands.executeCommands([
        { name: 'abort', args: {} },
        { name: 'next', args: {} },
      ]);

      expect(gridCommands.isExecuting()).toBe(false);
    });

    it('should not change isExecuting state when concurrent call is rejected', async () => {
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;
      let isExecutingAfterRejection = true;

      const blockingCommand = createMockCommand('blocking', {
        execute: (_comp, { success }) => async (): Promise<CommandResult> => {
          try {
            await gridCommands.executeCommands([]);
          } catch {
            isExecutingAfterRejection = gridCommands.isExecuting();
          }
          return success();
        },
      });

      gridCommands = new GridCommands(component, [blockingCommand]);

      await gridCommands.executeCommands([
        { name: 'blocking', args: {} },
      ]);

      // isExecuting should still be true during the outer call
      expect(isExecutingAfterRejection).toBe(true);
      // After completion, it's false
      expect(gridCommands.isExecuting()).toBe(false);
    });
  });

  describe('customizeResponseText', () => {
    it('should use default messages when customizeResponseText is not provided', async () => {
      const command = createMockCommand('test', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success('default msg')),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const results = await gridCommands.executeCommands([
        { name: 'test', args: {} },
      ]);

      expect(results[0].message).toBe('default msg');
    });

    it('should call customizeResponseText once per executed command with correct args', async () => {
      const customizeSpy = jest.fn<CustomizeResponseText>(() => undefined);
      const command = createMockCommand('test');
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      await gridCommands.executeCommands(
        [
          { name: 'test', args: { key: 'val1' } },
          { name: 'test', args: { key: 'val2' } },
        ],
        customizeSpy,
      );

      expect(customizeSpy).toHaveBeenCalledTimes(2);
      expect(customizeSpy).toHaveBeenNthCalledWith(1, 'test', { key: 'val1' });
      expect(customizeSpy).toHaveBeenNthCalledWith(2, 'test', { key: 'val2' });
    });

    it('should replace both messages when returning { success, failure }', async () => {
      const customizeResponseText: CustomizeResponseText = () => ({
        success: 'Custom success',
        failure: 'Custom failure',
      });

      const successCommand = createMockCommand('ok', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success('default')),
      });
      const failCommand = createMockCommand('fail', {
        execute: (_comp, { failure }) => (): Promise<CommandResult> => Promise.resolve(failure('default')),
      });
      const gridCommands = new GridCommands(
        createMockComponent(),
        [successCommand, failCommand],
      );

      const results = await gridCommands.executeCommands(
        [
          { name: 'ok', args: {} },
          { name: 'fail', args: {} },
        ],
        customizeResponseText,
      );

      expect(results[0].message).toBe('Custom success');
      expect(results[1].message).toBe('Custom failure');
    });

    it('should only replace success message when returning { success } and keep default failure', async () => {
      const customizeResponseText: CustomizeResponseText = () => ({
        success: 'Custom success',
      });

      const failCommand = createMockCommand('fail', {
        execute: (_comp, { failure }) => (): Promise<CommandResult> => Promise.resolve(failure('default failure')),
      });
      const gridCommands = new GridCommands(createMockComponent(), [failCommand]);

      const results = await gridCommands.executeCommands(
        [{ name: 'fail', args: {} }],
        customizeResponseText,
      );

      expect(results[0].message).toBe('default failure');
    });

    it('should only replace failure message when returning { failure } and keep default success', async () => {
      const customizeResponseText: CustomizeResponseText = () => ({
        failure: 'Custom failure',
      });

      const successCommand = createMockCommand('ok', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success('default success')),
      });
      const gridCommands = new GridCommands(createMockComponent(), [successCommand]);

      const results = await gridCommands.executeCommands(
        [{ name: 'ok', args: {} }],
        customizeResponseText,
      );

      expect(results[0].message).toBe('default success');
    });

    it('should leave default message when customizeResponseText returns undefined', async () => {
      const customizeResponseText: CustomizeResponseText = () => undefined;

      const command = createMockCommand('test', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => Promise.resolve(success('original')),
      });
      const gridCommands = new GridCommands(createMockComponent(), [command]);

      const results = await gridCommands.executeCommands(
        [{ name: 'test', args: {} }],
        customizeResponseText,
      );

      expect(results[0].message).toBe('original');
    });

    it('should not call customizeResponseText for aborted entry', async () => {
      const customizeSpy = jest.fn<CustomizeResponseText>(() => ({
        success: 'custom',
      }));
      const component = createMockComponent();
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let gridCommands: GridCommands;

      const abortSimulation = createMockCommand('abort', {
        execute: (_comp, { success }) => (): Promise<CommandResult> => {
          gridCommands.abort();
          return Promise.resolve(success());
        },
      });
      const skipped = createMockCommand('skipped');

      gridCommands = new GridCommands(component, [abortSimulation, skipped]);

      const results = await gridCommands.executeCommands(
        [
          { name: 'abort', args: {} },
          { name: 'skipped', args: {} },
        ],
        customizeSpy,
      );

      expect(customizeSpy).toHaveBeenCalledTimes(1);
      expect(customizeSpy).toHaveBeenCalledWith('abort', {});
      expect(results[1].status).toBe('aborted');
    });

    it('should not call customizeResponseText when no commands are executed', async () => {
      const customizeSpy = jest.fn<CustomizeResponseText>(() => undefined);
      const gridCommands = new GridCommands(createMockComponent(), []);

      await gridCommands.executeCommands([], customizeSpy);

      expect(customizeSpy).not.toHaveBeenCalled();
    });
  });
});
