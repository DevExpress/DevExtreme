const fail = (message) => ({ status: 'failure', message });
export const gridCommands = {
  filterValue: {
    description: `Apply a filter to a single column. Pass column (dataField), operator, and value.
Supported operators: "=", "<>", "<", "<=", ">", ">=", "contains", "notcontains", "startswith", "endswith", "anyof".
Date values must be in "YYYY-MM-DDTHH:mm:ss" format (e.g. "2024-05-10T00:00:00").
The "Completion" column is a boolean (task completed or not): use operator "=" with value true for completed tasks, or value false for tasks that are not completed.
To filter a date column by a year and/or month, use operator "anyof" with value as an array of one or more strings in "YYYY" or "YYYY/M" format. Only use "anyof" when the year is known; if the year is missing, omit the action instead of guessing.`,
    schema: {
      type: 'object',
      properties: {
        column: { type: 'string' },
        operator: {
          type: 'string',
          enum: ['=', '<>', '<', '<=', '>', '>=', 'contains', 'notcontains', 'startswith', 'endswith', 'anyof'],
        },
        value: {
          anyOf: [{ type: ['string', 'number', 'boolean'] }, { type: 'array', items: { type: 'string' } }],
        },
      },
      required: ['column', 'operator', 'value'],
    },
    execute(grid, args, rawText) {
      const columnLookup = getColumnOrFail(grid, args.column ?? '');
      if (columnLookup.failure || !columnLookup.column) {
        return columnLookup.failure ?? fail(`I couldn't find a DataGrid column named '${args.column ?? ''}'.`);
      }
      const column = columnLookup.column;
      const columnName = column.dataField ?? column.name ?? args.column ?? '';
      const isDateColumn = column.dataType === 'date' || column.dataType === 'datetime';
      let value = args.value;
      if (columnName === 'Completion' && typeof value !== 'boolean') {
        const normalized = String(value).trim().toLowerCase();
        value = value === 100 || ['true', 'completed', 'yes', '100'].includes(normalized);
      }
      if (isDateColumn && typeof value === 'string') {
        const parsedDate = new Date(value);
        if (!Number.isNaN(parsedDate.getTime())) {
          value = parsedDate;
        }
      }
      if (args.operator === 'anyof' && isDateColumn && Array.isArray(value)) {
        const mentionedYears = new Set(String(rawText ?? '').match(/\b\d{4}\b/g) ?? []);
        const hasUnrecognizedYear = value.some((entry) => !mentionedYears.has(String(entry).split('/')[0]));
        if (hasUnrecognizedYear) {
          return fail('No field or column exists with such a name, or the entered value is invalid.');
        }
      }
      try {
        const newCondition = [columnName, args.operator ?? '=', value];
        const nextValue = combineFilterConditions(grid.option('filterValue'), newCondition);
        grid.option('filterValue', nextValue);
        return {
          status: 'success',
          message: `Filtered by '${column.caption ?? args.column}'.`,
        };
      } catch {
        return fail(`I couldn't apply that filter to '${column.caption ?? args.column}'. Check that the value matches the column's type.`);
      }
    },
  },
  clearFilter: {
    description: 'Clear all filters on the grid.',
    schema: { type: 'object', properties: {} },
    execute(grid) {
      try {
        grid.clearFilter();
        return { status: 'success', message: 'Filter cleared.' };
      } catch {
        return fail("I couldn't clear the DataGrid's filters.");
      }
    },
  },
  sorting: {
    description: 'Sort a column ascending or descending. Pass sortOrder "none" to remove sorting from this column only.',
    schema: {
      type: 'object',
      properties: {
        column: { type: 'string' },
        sortOrder: { type: 'string', enum: ['asc', 'desc', 'none'] },
      },
      required: ['column', 'sortOrder'],
    },
    execute(grid, args) {
      const columnLookup = getColumnOrFail(grid, args.column ?? '');
      if (columnLookup.failure || !columnLookup.column) {
        return columnLookup.failure ?? fail(`I couldn't find a DataGrid column named '${args.column ?? ''}'.`);
      }
      const column = columnLookup.column;
      const order = args.sortOrder ?? 'asc';
      const caption = column.caption ?? args.column ?? '';
      try {
        grid.columnOption(args.column ?? '', 'sortOrder', order === 'none' ? undefined : order);
        return {
          status: 'success',
          message: order === 'none' ? `Cleared sorting on '${caption}'.` : `Sorted by '${caption}' (${order === 'asc' ? 'ascending' : 'descending'}).`,
        };
      } catch {
        return fail(`I couldn't sort by '${caption}'.`);
      }
    },
  },
  clearSorting: {
    description: 'Remove sorting from all columns.',
    schema: { type: 'object', properties: {} },
    execute(grid) {
      try {
        grid.clearSorting();
        return { status: 'success', message: 'Sorting cleared.' };
      } catch {
        return fail("I couldn't clear the DataGrid's sorting.");
      }
    },
  },
  columnsVisibility: {
    description: 'Show or hide a column.',
    schema: {
      type: 'object',
      properties: {
        column: { type: 'string' },
        visible: { type: 'boolean' },
      },
      required: ['column', 'visible'],
    },
    execute(grid, args) {
      const columnLookup = getColumnOrFail(grid, args.column ?? '');
      if (columnLookup.failure || !columnLookup.column) {
        return columnLookup.failure ?? fail(`I couldn't find a DataGrid column named '${args.column ?? ''}'.`);
      }
      const column = columnLookup.column;
      const caption = column.caption ?? args.column ?? '';
      try {
        grid.columnOption(args.column ?? '', 'visible', args.visible ?? false);
        return {
          status: 'success',
          message: args.visible ? `Showed column '${caption}'.` : `Hid column '${caption}'.`,
        };
      } catch {
        return fail(`I couldn't change the visibility of '${caption}'.`);
      }
    },
  },
};
export function getFilterConditions(filterValue) {
  if (!Array.isArray(filterValue)) {
    return [];
  }
  return Array.isArray(filterValue[0])
    ? filterValue.filter(Array.isArray)
    : [filterValue];
}
export function combineFilterConditions(existing, next) {
  const conditions = getFilterConditions(existing).filter(([column, operator]) => column !== next[0] || operator !== next[1]);
  conditions.push(next);
  return conditions.length === 1
    ? conditions[0]
    : conditions.flatMap((condition, index) => (index === 0 ? [condition] : ['and', condition]));
}
export function getColumnOrFail(grid, columnName) {
  const column = grid.columnOption(columnName);
  if (!column) {
    return {
      column: null,
      failure: {
        status: 'failure',
        message: `I couldn't find a DataGrid column named '${columnName}'.`,
      },
    };
  }
  return { column, failure: null };
}
export function buildGridResponseSchema() {
  const branches = Object.entries(gridCommands).map(([name, command]) => ({
    type: 'object',
    properties: {
      name: { type: 'string', enum: [name] },
      args: command.schema,
    },
    required: ['name', 'args'],
  }));
  return {
    type: 'object',
    properties: {
      actions: {
        type: 'array',
        description: 'List of grid commands to execute, in order.',
        items: { anyOf: branches },
      },
    },
    required: ['actions'],
  };
}
export function buildGridPromptSection(columnNames) {
  const commandDescriptions = Object.entries(gridCommands)
    .map(([name, command]) => `- '${name}': ${command.description}`)
    .join('\n');
  return `GRID: translate any part of the request that affects the task grid into one or more grid commands (the "actions" array).
Available columns (dataField): ${columnNames.join(', ')}.
CRITICAL RULE: a column mentioned in the request must clearly correspond to one of the available columns above (matching by meaning is fine, e.g. "due date" -> "DueDate"). If it does not — even if it superficially looks like it could be a column name — you must NOT invent or substitute the closest-sounding available column. Instead, still emit the action using the column name exactly as written in the request, so the app can report that the column wasn't found — never replace it with a different, existing column just to make the action valid.
Example: request "filter the ZXQ column by foo" - ZXQ matches no available column, so emit {"column": "ZXQ", ...} as-is (it will correctly fail as "column not found") - do NOT emit an action for 'Subject' or any other real column instead.
The "Completion" column is a boolean: true means the task is completed, false means it is not. To filter for 'completed' tasks, use {'column': 'Completion', 'operator': '=', 'value': true}. To filter for 'not completed' tasks, use {'column': 'Completion', 'operator': '=', 'value': false}.
Available grid commands:
${commandDescriptions}`;
}
export function getGridColumnNames(grid) {
  return grid.option('columns').map((column) => String(column.dataField));
}
export function applyGridActions(grid, actions, rawText) {
  return actions.map((action) => {
    const command = gridCommands[action.name];
    if (!command) {
      return fail(`I don't know how to do '${action.name}'.`);
    }
    return command.execute(grid, action.args ?? {}, rawText);
  });
}
