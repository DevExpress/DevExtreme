import { describe, expect, it } from '@jest/globals';
import { coreCommands } from '@ts/grids/grid_core/ai_assistant/commands/index';
import { GridCommands } from '@ts/grids/grid_core/ai_assistant/grid_commands';
import type { GridCommand, JsonSchema, ResponseSchemaBranch } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/types';

import { dataGridCommands } from '../commands/index';

const expectedFilterScalarValue: JsonSchema = {
  anyOf: [
    {
      type: 'string',
      description: 'A plain string value. Date values should be in "YYYY-MM-DDTHH:mm:ss" format (e.g. "2024-05-10T00:00:00", "2024-05-10T14:30:00"). The time part is always required. The "Z" suffix or timezone offset should not be appended unless the user explicitly requests it.',
    },
    {
      type: 'number',
      description: 'A numeric filter value.',
    },
    {
      type: 'boolean',
      description: 'A boolean filter value.',
    },
    {
      type: 'null',
      description: 'A null filter value.',
    },
  ],
};

const expectedSummaryItemBaseProperties: JsonSchema = {
  column: {
    type: 'string',
  },
  summaryType: {
    type: 'string',
    enum: ['sum', 'min', 'max', 'avg', 'count'],
  },
  showInColumn: {
    anyOf: [
      {
        type: 'string',
      },
      {
        type: 'null',
      },
    ],
  },
  displayFormat: {
    anyOf: [
      {
        type: 'string',
      },
      {
        type: 'null',
      },
    ],
  },
};

const expectedArgsByCommand: Record<string, JsonSchema> = {
  columnsPinning: {
    type: 'object',
    properties: {
      dataField: {
        type: 'string',
      },
      fixed: {
        type: 'boolean',
      },
      fixedPosition: {
        anyOf: [
          {
            type: 'string',
            enum: ['left', 'right'],
          },
          {
            type: 'null',
          },
        ],
      },
    },
    required: ['dataField', 'fixed', 'fixedPosition'],
    additionalProperties: false,
  },
  columnsReorder: {
    type: 'object',
    properties: {
      dataField: {
        type: 'string',
      },
      visibleIndex: {
        type: 'integer',
        minimum: 0,
      },
    },
    required: ['dataField', 'visibleIndex'],
    additionalProperties: false,
  },
  columnsResize: {
    type: 'object',
    properties: {
      dataField: {
        type: 'string',
      },
      width: {
        anyOf: [
          {
            type: 'number',
          },
          {
            type: 'string',
          },
        ],
      },
    },
    required: ['dataField', 'width'],
    additionalProperties: false,
  },
  columnsVisibility: {
    type: 'object',
    properties: {
      dataField: {
        type: 'string',
      },
      visible: {
        type: 'boolean',
      },
    },
    required: ['dataField', 'visible'],
    additionalProperties: false,
  },
  clearFilter: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  filterValue: {
    type: 'object',
    properties: {
      expression: {
        anyOf: [
          {
            type: 'object',
            properties: {
              rootId: {
                type: 'string',
              },
              nodes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    expr: {
                      anyOf: [
                        {
                          type: 'object',
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['basic'],
                            },
                            field: {
                              type: 'string',
                            },
                            operator: {
                              type: 'string',
                              enum: ['=', '<>', '<', '<=', '>', '>=', 'contains', 'notcontains', 'startswith', 'endswith'],
                            },
                            value: expectedFilterScalarValue,
                          },
                          required: ['type', 'field', 'operator', 'value'],
                          additionalProperties: false,
                        },
                        {
                          type: 'object',
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['basic'],
                            },
                            field: {
                              type: 'string',
                            },
                            operator: {
                              type: 'string',
                              enum: ['anyof', 'noneof'],
                            },
                            value: {
                              type: 'array',
                              items: expectedFilterScalarValue,
                            },
                          },
                          required: ['type', 'field', 'operator', 'value'],
                          additionalProperties: false,
                        },
                        {
                          type: 'object',
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['combined'],
                            },
                            combiner: {
                              type: 'string',
                              enum: ['and', 'or'],
                            },
                            leftId: {
                              type: 'string',
                            },
                            rightId: {
                              type: 'string',
                            },
                          },
                          required: ['type', 'combiner', 'leftId', 'rightId'],
                          additionalProperties: false,
                        },
                        {
                          type: 'object',
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['negated'],
                            },
                            expressionId: {
                              type: 'string',
                            },
                          },
                          required: ['type', 'expressionId'],
                          additionalProperties: false,
                        },
                      ],
                    },
                  },
                  required: ['id', 'expr'],
                  additionalProperties: false,
                },
                minItems: 1,
              },
            },
            required: ['rootId', 'nodes'],
            additionalProperties: false,
          },
          {
            type: 'null',
          },
        ],
      },
    },
    required: ['expression'],
    additionalProperties: false,
  },
  focusRowByIndex: {
    type: 'object',
    properties: {
      index: {
        type: 'integer',
        minimum: 0,
      },
    },
    required: ['index'],
    additionalProperties: false,
  },
  focusRowByKey: {
    type: 'object',
    properties: {
      key: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
          {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                },
                value: {
                  anyOf: [
                    {
                      type: 'string',
                    },
                    {
                      type: 'number',
                    },
                  ],
                },
              },
              required: ['field', 'value'],
              additionalProperties: false,
            },
          },
        ],
      },
    },
    required: ['key'],
    additionalProperties: false,
  },
  pageIndex: {
    type: 'object',
    properties: {
      pageIndex: {
        type: 'integer',
        minimum: 0,
      },
    },
    required: ['pageIndex'],
    additionalProperties: false,
  },
  pageSize: {
    type: 'object',
    properties: {
      pageSize: {
        type: 'integer',
        minimum: 0,
      },
    },
    required: ['pageSize'],
    additionalProperties: false,
  },
  paging: {
    type: 'object',
    properties: {
      enabled: {
        type: 'boolean',
      },
    },
    required: ['enabled'],
    additionalProperties: false,
  },
  searching: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
    },
    required: ['text'],
    additionalProperties: false,
  },
  clearSelection: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  deselectAll: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  selectAll: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  selectionByIndexes: {
    type: 'object',
    properties: {
      indexes: {
        type: 'array',
        items: {
          type: 'integer',
          minimum: 1,
        },
        minItems: 1,
      },
      mode: {
        type: 'string',
        enum: ['select', 'deselect'],
      },
      scope: {
        type: 'string',
        enum: ['allPages', 'page'],
      },
    },
    required: ['indexes', 'mode', 'scope'],
    additionalProperties: false,
  },
  selectByKeys: {
    type: 'object',
    properties: {
      keys: {
        type: 'array',
        items: {
          anyOf: [
            {
              type: 'string',
            },
            {
              type: 'number',
            },
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  value: {
                    anyOf: [
                      {
                        type: 'string',
                      },
                      {
                        type: 'number',
                      },
                    ],
                  },
                },
                required: ['field', 'value'],
                additionalProperties: false,
              },
            },
          ],
        },
      },
      preserve: {
        type: 'boolean',
      },
    },
    required: ['keys', 'preserve'],
    additionalProperties: false,
  },
  clearSorting: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  sorting: {
    type: 'object',
    properties: {
      dataField: {
        type: 'string',
      },
      sortOrder: {
        type: 'string',
        enum: ['asc', 'desc', 'none'],
      },
    },
    required: ['dataField', 'sortOrder'],
    additionalProperties: false,
  },
  grouping: {
    type: 'object',
    properties: {
      dataField: {
        type: 'string',
      },
      groupIndex: {
        anyOf: [
          {
            type: 'integer',
            minimum: 0,
          },
          {
            type: 'null',
          },
        ],
      },
    },
    required: ['dataField', 'groupIndex'],
    additionalProperties: false,
  },
  clearGrouping: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  summary: {
    type: 'object',
    properties: {
      totalItems: {
        type: 'array',
        items: {
          type: 'object',
          properties: expectedSummaryItemBaseProperties,
          required: ['column', 'summaryType', 'showInColumn', 'displayFormat'],
          additionalProperties: false,
        },
      },
      groupItems: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ...expectedSummaryItemBaseProperties,
            showInGroupFooter: {
              anyOf: [
                {
                  type: 'boolean',
                },
                {
                  type: 'null',
                },
              ],
            },
            alignByColumn: {
              anyOf: [
                {
                  type: 'boolean',
                },
                {
                  type: 'null',
                },
              ],
            },
          },
          required: ['column', 'summaryType', 'showInColumn', 'displayFormat', 'showInGroupFooter', 'alignByColumn'],
          additionalProperties: false,
        },
      },
    },
    required: ['totalItems', 'groupItems'],
    additionalProperties: false,
  },
  clearSummary: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
};

const buildResponseSchema = (commands: GridCommand[]): JsonSchema => {
  const gridCommands = new GridCommands({} as InternalGrid, commands);

  return gridCommands.buildResponseSchema();
};

const getArgsByCommand = (schema: JsonSchema): Record<string, JsonSchema | undefined> => {
  const { actions } = schema.properties as {
    actions: { items: { anyOf: ResponseSchemaBranch['branch'][] } };
  };

  return Object.fromEntries(actions.items.anyOf.map(
    (branch) => [branch.properties.name.enum[0], branch.properties.args],
  ));
};

const dataGridCommandNames = Object.keys(expectedArgsByCommand);
const treeListCommandNames = coreCommands.map(({ name }) => name);

describe('Response schema', () => {
  describe('DataGrid commands', () => {
    const schema = buildResponseSchema([...coreCommands, ...dataGridCommands]);
    const argsByCommand = getArgsByCommand(schema);

    it.each(dataGridCommandNames)('should build args schema for the "%s" command', (commandName) => {
      expect(argsByCommand[commandName]).toEqual(expectedArgsByCommand[commandName]);
    });

    it('should build args for all commands', () => {
      expect(Object.keys(argsByCommand)).toEqual(dataGridCommandNames);
    });

    it('should not build root $defs', () => {
      expect(schema.$defs).toBeUndefined();
    });
  });

  describe('TreeList commands', () => {
    const schema = buildResponseSchema(coreCommands);
    const argsByCommand = getArgsByCommand(schema);

    it.each(treeListCommandNames)('should build args schema for the "%s" command', (commandName) => {
      expect(argsByCommand[commandName]).toEqual(expectedArgsByCommand[commandName]);
    });

    it('should not build root $defs', () => {
      expect(schema.$defs).toBeUndefined();
    });
  });
});
