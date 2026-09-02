const gridCommands = {
  filterValue: {
    description:
      "Apply a filter to a single column. Pass column (dataField), operator, and value. " +
      'Supported operators: "=", "<>", "<", "<=", ">", ">=", "contains", "notcontains", "startswith", "endswith", "anyof". ' +
      'Date values must be in "YYYY-MM-DDTHH:mm:ss" format (e.g. "2024-05-10T00:00:00"). ' +
      'The "Completion" column is a boolean (task completed or not): use operator "=" with value true for ' +
      "completed tasks, or value false for tasks that are not completed. " +
      "To filter a date column by a year and/or month (the same thing the grid's own header filter does " +
      'when you pick a year then a month), use operator "anyof" with value as an array of one or more ' +
      'strings in "YYYY" (whole year, e.g. "2023") or "YYYY/M" (whole month, month is 1-12 with no leading ' +
      'zero, e.g. "2023/5" for May 2023) format, e.g. {"column": "DueDate", "operator": "anyof", "value": ' +
      '["2023/5"]} for "May 2023". Only use "anyof" when the year is known; if the year is missing and ' +
      'cannot be inferred from elsewhere in the request (e.g. plain "in May" with no year anywhere), do ' +
      "not guess it - omit this action entirely instead of adding it with a made-up year.",
    schema: {
      type: "object",
      properties: {
        column: { type: "string" },
        operator: {
          type: "string",
          enum: [
            "=",
            "<>",
            "<",
            "<=",
            ">",
            ">=",
            "contains",
            "notcontains",
            "startswith",
            "endswith",
            "anyof",
          ],
        },
        value: {
          anyOf: [
            { type: ["string", "number", "boolean"] },
            { type: "array", items: { type: "string" } },
          ],
        },
      },
      required: ["column", "operator", "value"],
    },
    execute(grid, args, rawText) {
      const { column, failure } = getColumnOrFail(grid, args.column);
      if (failure) return failure;

      const caption = column.caption ?? args.column;
      let { value } = args;

      if (args.column === "Completion" && typeof value !== "boolean") {
        const normalized = String(value).trim().toLowerCase();
        value =
          value === 100 ||
          ["true", "completed", "yes", "100"].includes(normalized);
      }

      if (
        (column.dataType === "date" || column.dataType === "datetime") &&
        typeof value === "string"
      ) {
        const parsedDate = new Date(value);
        if (!Number.isNaN(parsedDate.getTime())) {
          value = parsedDate;
        }
      }

      if (args.operator === "anyof" && Array.isArray(value)) {
        const mentionedYears = new Set(
          String(rawText ?? "").match(/\b\d{4}\b/g),
        );
        const hasUngroundedYear = value.some(
          (entry) => !mentionedYears.has(String(entry).split("/")[0]),
        );

        if (hasUngroundedYear) {
          return {
            status: "failure",
            message: `No field or column exists with such a name, or the entered value is invalid.`,
          };
        }
      }

      try {
        grid.option("filterValue", [args.column, args.operator, value]);
        return {
          status: "success",
          message: `Filtered by "${caption}".`,
        };
      } catch {
        return {
          status: "failure",
          message: `I couldn't apply that filter to "${caption}". Check that the value matches the column's type.`,
        };
      }
    },
  },

  clearFilter: {
    description: "Clear all filters on the grid.",
    schema: { type: "object", properties: {} },
    execute(grid) {
      try {
        grid.clearFilter();
        return { status: "success", message: "Filter cleared." };
      } catch {
        return {
          status: "failure",
          message: "I couldn't clear the DataGrid's filters.",
        };
      }
    },
  },

  sorting: {
    description:
      'Sort a column ascending or descending. Pass sortOrder "none" to remove sorting from this column only.',
    schema: {
      type: "object",
      properties: {
        column: { type: "string" },
        sortOrder: { type: "string", enum: ["asc", "desc", "none"] },
      },
      required: ["column", "sortOrder"],
    },
    execute(grid, args) {
      const { column, failure } = getColumnOrFail(grid, args.column);
      if (failure) return failure;

      const caption = column.caption ?? args.column;

      try {
        grid.columnOption(
          args.column,
          "sortOrder",
          args.sortOrder === "none" ? undefined : args.sortOrder,
        );

        const message =
          args.sortOrder === "none"
            ? `Cleared sorting on "${caption}".`
            : `Sorted by "${caption}" (${args.sortOrder === "asc" ? "ascending" : "descending"}).`;

        return { status: "success", message };
      } catch {
        return {
          status: "failure",
          message: `I couldn't sort by "${caption}".`,
        };
      }
    },
  },

  clearSorting: {
    description: "Remove sorting from all columns.",
    schema: { type: "object", properties: {} },
    execute(grid) {
      try {
        grid.clearSorting();
        return { status: "success", message: "Sorting cleared." };
      } catch {
        return {
          status: "failure",
          message: "I couldn't clear the DataGrid's sorting.",
        };
      }
    },
  },

  columnsVisibility: {
    description: "Show or hide a column.",
    schema: {
      type: "object",
      properties: {
        column: { type: "string" },
        visible: { type: "boolean" },
      },
      required: ["column", "visible"],
    },
    execute(grid, args) {
      const { column, failure } = getColumnOrFail(grid, args.column);
      if (failure) return failure;

      const caption = column.caption ?? args.column;

      try {
        grid.columnOption(args.column, "visible", args.visible);
        return {
          status: "success",
          message: args.visible
            ? `Showed column "${caption}".`
            : `Hid column "${caption}".`,
        };
      } catch {
        return {
          status: "failure",
          message: `I couldn't change the visibility of "${caption}".`,
        };
      }
    },
  },
};

function getColumnOrFail(grid, columnName) {
  const column = grid.columnOption(columnName);

  if (!column) {
    return {
      column: null,
      failure: {
        status: "failure",
        message: `I couldn't find a DataGrid column named "${columnName}".`,
      },
    };
  }

  return { column, failure: null };
}

function buildGridResponseSchema() {
  const branches = Object.entries(gridCommands).map(([name, cmd]) => ({
    type: "object",
    properties: {
      name: { type: "string", enum: [name] },
      args: cmd.schema,
    },
    required: ["name", "args"],
  }));

  return {
    type: "object",
    properties: {
      actions: {
        type: "array",
        description: "List of grid commands to execute, in order.",
        items: { anyOf: branches },
      },
    },
    required: ["actions"],
  };
}

function buildGridPromptSection(columnNames) {
  const commandDescriptions = Object.entries(gridCommands)
    .map(([name, cmd]) => `- "${name}": ${cmd.description}`)
    .join("\n");

  return [
    'GRID: translate any part of the request that affects the task grid into one or more grid commands (the "actions" array).',
    `Available columns (dataField): ${columnNames.join(", ")}.`,
    "CRITICAL RULE: a column mentioned in the request must clearly correspond to one of the available " +
      'columns above (matching by meaning is fine, e.g. "due date" -> "DueDate"). If it does not - even ' +
      "if it superficially looks like it could be a column name - you must NOT invent or substitute the " +
      "closest-sounding available column. Instead, still emit the action using the column name exactly " +
      "as written in the request, so the app can report that the column wasn't found - never replace it " +
      "with a different, existing column just to make the action valid.",
    'Example: request "filter the ZXQ column by foo" - ZXQ matches no available column, so emit ' +
      '{"column": "ZXQ", ...} as-is (it will correctly fail as "column not found") - do NOT emit an ' +
      'action for "Subject" or any other real column instead.',
    'The "Completion" column is a boolean: true means the task is completed, false means it is not. ' +
      'To filter for "completed" tasks, use {"column": "Completion", "operator": "=", "value": true}. ' +
      'To filter for "not completed" tasks, use {"column": "Completion", "operator": "=", "value": false}.',
    "Available grid commands:",
    commandDescriptions,
  ].join("\n");
}

function getGridColumnNames(gridInstance) {
  return gridInstance.getVisibleColumns().map((col) => col.dataField);
}

function applyGridActions(grid, actions, rawText) {
  return actions.map((action) => {
    const command = gridCommands[action.name];

    if (!command) {
      return {
        status: "failure",
        message: `I don't know how to do "${action.name}".`,
      };
    }

    return command.execute(grid, action.args ?? {}, rawText);
  });
}
