$(() => {
  DevExpress.config({
    editorStylingMode: 'filled',
  });

  DevExpress.config({
    floatingActionButtonConfig: {
      position: {
        my: 'right bottom',
        at: 'right bottom',
        of: '#grid-container',
        offset: '-16 -16',
      },
    },
  });

  DevExpress.localization.loadMessages({
    en: {
      'dxChat-textareaPlaceholder': 'Enter a prompt...',
    },
  });

  let chatInstance;
  let clearButtonInstance;
  let formInstance;
  let gridInstance;

  const toastInstance = $('#toast')
    .dxToast({
      displayTime: 600,
      closeOnClick: true,
      message: 'Form data is saved.',
      type: 'success',
      position: {
        of: '#form-container',
        at: 'bottom center',
        my: 'bottom center',
        offset: '0 -20',
      },
    })
    .dxToast('instance');

  function pushMessage(message) {
    chatInstance
      .getDataSource()
      .store()
      .push([
        {
          type: 'insert',
          data: {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            ...message,
          },
        },
      ]);
  }

  function setDisabled(disabled) {
    chatInstance.option('disabled', disabled);
  }

  function updateClearButtonState() {
    const items = chatInstance.getDataSource().items();
    clearButtonInstance?.option('disabled', items.length === 0);
  }

  function clearChat() {
    const store = chatInstance.getDataSource().store();

    store.clear();
    chatInstance.getDataSource().reload();
    updateClearButtonState();
  }

  function handleUserMessage(message) {
    setDisabled(true);

    const finish = () => {
      setDisabled(false);
      updateClearButtonState();
    };

    const routed = routeMessage(message.text, {
      form: formInstance,
      gridInstance,
      aiIntegration,
      pushMessage,
    });

    routed.finally(finish);
  }

  const popupInstance = $('#aiAssistantContainer')
    .dxPopup({
      title: 'AI Assistant',
      wrapperAttr: {
        class: 'chat-popup',
      },
      width: 400,
      height: '90%',
      dragEnabled: true,
      resizeEnabled: true,
      showCloseButton: true,
      shading: false,
      visible: false,
      onHiding() {
        fabBtn.option('visible', true);
      },
      onShowing() {
        fabBtn.option('visible', false);
      },
      position: {
        my: 'right top',
        at: 'right top',
        of: '.demo-container',
        offset: '-20 20',
      },
      toolbarItems: [
        {
          widget: 'dxButton',
          toolbar: 'top',
          location: 'after',
          cssClass: CLASSES.clearChatButton,
          options: {
            icon: 'clearhistory',
            disabled: true,
            hint: 'Clear chat',
            onClick: () => clearChat(),
            onInitialized: (e) => {
              clearButtonInstance = e.component;
            },
          },
        },
      ],
      contentTemplate($container) {
        const $chatContainer = $('<div>')
          .addClass('ai-chat-content')
          .appendTo($container);

        $chatContainer.dxChat({
          height: '100%',
          showAvatar: false,
          width: 'auto',
          dataSource: {
            store: new DevExpress.data.ArrayStore({ key: 'id' }),
          },
          reloadOnChange: true,
          user: { id: 'user' },
          showUserName: false,
          speechToTextEnabled: true,
          suggestions: {
            items: [
              { text: 'Show Completed Tasks', prompt: 'Show Completed Tasks' },
              {
                text: 'Change State to Texas',
                prompt: 'Change State to Texas',
              },
            ],
            onItemClick(e) {
              const { prompt } = e.itemData;
              const message = {
                id: Date.now() + Math.random(),
                timestamp: new Date(),
                author: { id: 'user' },
                text: prompt,
              };

              pushMessage(message);
              handleUserMessage(message);
            },
          },
          emptyViewTemplate(_data, container) {
            const $icon = $('<div>').addClass(
              'dx-chat-messagelist-empty-image dx-ai-chat__empty-image',
            );
            const $message = $('<div>')
              .addClass('ai-chat-empty-message')
              .text(emptyViewMessage);
            const $prompt = $('<div>')
              .addClass('ai-chat-empty-prompt')
              .html(emptyViewPrompt);

            $(container).append($icon).append($message).append($prompt);
          },
          onMessageEntered(e) {
            handleUserMessage(e.message);
          },
          onInitialized(e) {
            chatInstance = e.component;
          },
        });
      },
    })
    .dxPopup('instance');

  const aiIntegration = createAiIntegration();

  formInstance = $('#form-container')
    .dxForm({
      formData: employee,
      colCount: 3,
      labelLocation: 'top',
      onOptionChanged: (e) => {
        if (e.name === 'isDirty') {
          const saveButton = formInstance.getButton('Save');
          saveButton.option('disabled', !e.value);
        }
      },
      aiIntegration,
      items: [
        {
          dataField: 'Prefix',
          label: { text: 'Title' },
          editorType: 'dxSelectBox',
          editorOptions: { items: titles, searchEnabled: true },
          aiOptions: {
            instruction:
              'Only fill this field with one of the allowed values (Mr., Mrs., Ms.) if a ' +
              'title is explicitly mentioned in the text. Never use this field for any part ' +
              "of a person's name.",
          },
        },
        {
          dataField: 'FirstName',
          label: { text: 'First Name' },
          aiOptions: {
            instruction:
              "Only fill this field if the text clearly refers to a person's given name. " +
              'Never use grid/task-related words like Subject, Priority, Status, Due Date, ' +
              'Completion, or generic verbs like sort/filter/show as a name.',
          },
        },
        {
          dataField: 'LastName',
          label: { text: 'Last Name' },
          aiOptions: {
            instruction:
              "If the text gives a full person name (e.g. 'customer name', 'employee name') " +
              'without separately labeled first/last names, use only the first word as First ' +
              'Name and the rest of the name as Last Name.',
          },
        },
        {
          dataField: 'Position',
          editorType: 'dxSelectBox',
          editorOptions: { items: positions, searchEnabled: true },
          aiOptions: {
            instruction:
              'Only fill this field with one of the allowed job position values if the text ' +
              "explicitly refers to the employee's own job title/role.",
          },
        },
        {
          dataField: 'State',
          editorType: 'dxSelectBox',
          editorOptions: { items: states, searchEnabled: true },
          aiOptions: {
            instruction:
              'Only fill this field with one of the allowed US state values if the text ' +
              "explicitly refers to the employee's home/office state",
          },
        },
        {
          dataField: 'BirthDate',
          editorType: 'dxDateBox',
          editorOptions: { displayFormat: 'M/d/yyyy' },
          aiOptions: {
            instruction:
              "Only fill this field if the text explicitly refers to the employee's own birth " +
              'date or date of birth.',
          },
        },
        {
          itemType: 'button',
          name: 'Save',
          colSpan: 3,
          cssClass: 'save-button',
          buttonOptions: {
            text: 'Save',
            type: 'default',
            disabled: true,
            useSubmitBehavior: true,
            width: '120px',
            onClick: () => {
              toastInstance.show();
            },
          },
        },
      ],
    })
    .dxForm('instance');

  gridInstance = $('#grid-container')
    .dxDataGrid({
      dataSource: tasks,
      keyExpr: 'ID',
      showBorders: true,
      filterRow: { visible: true },
      headerFilter: { visible: true },
      filterSyncEnabled: true,
      columns: [
        { dataField: 'Subject', width: 250 },
        { dataField: 'StartDate', dataType: 'date' },
        { dataField: 'DueDate', dataType: 'date' },
        {
          dataField: 'Priority',
          caption: 'Priority',
          cellTemplate: (container, options) => {
            $('<div>')
              .css({
                background: colors[options.value],
                borderRadius: '24px',
                padding: '2px 8px',
                display: 'inline-block',
                textAlign: 'center',
              })
              .text(options.value)
              .appendTo(container);
          },
        },
        {
          dataField: 'Completion',
          caption: 'Completed',
          alignment: 'center',
          dataType: 'boolean',
          editorOptions: {
            elementAttr: {
              'aria-label': 'Completed',
            },
          },
          calculateCellValue: (rowData) => rowData.Completion === 100,
          calculateFilterExpression(filterValue, selectedFilterOperation) {
            const wantsCompleted =
              selectedFilterOperation === '<>' ? !filterValue : !!filterValue;
            const rawCompletion = (rowData) => rowData.Completion;
            return wantsCompleted
              ? [rawCompletion, '=', 100]
              : [rawCompletion, '<', 100];
          },
        },
      ],
    })
    .dxDataGrid('instance');

  let fabBtn = $('#ai-fab')
    .dxSpeedDialAction({
      icon: 'sparkle',
      label: 'AI Assistant',
      onClick() {
        popupInstance.toggle();
      },
    })
    .dxSpeedDialAction('instance');
});

class ChatCommandError extends Error {}

function getFormFieldOptions(form) {
  return (form.option('items') || [])
    .filter((item) => item.dataField)
    .map((item) => ({
      dataField: item.dataField,
      label: item.label?.text ?? item.dataField,
    }));
}

function applyFormClearAction(form, formAction) {
  if (!formAction || formAction.type === 'smart_paste') return null;

  if (formAction.type === 'clear_all') {
    try {
      form.clear();
      return { status: 'success', message: 'Cleared all Form fields.' };
    } catch {
      return {
        status: 'failure',
        message: "I couldn't clear the form.",
      };
    }
  }

  if (formAction.type === 'clear_field') {
    const isKnownField = getFormFieldOptions(form).some((f) => f.dataField === formAction.field);

    if (!isKnownField) {
      return {
        status: 'failure',
        message: `I couldn't find a field named '${formAction.field}' to clear.`,
      };
    }

    form.updateData(formAction.field, null);

    return { status: 'success', message: `Cleared ${formAction.field}.` };
  }

  return null;
}

function formatAiResultDetails(form, aiResult) {
  const labelByField = new Map(getFormFieldOptions(form).map((f) => [f.dataField, f.label]));

  return Object.keys(aiResult)
    .map((field) => labelByField.get(field) ?? field)
    .join(', ');
}

function applyFormSmartPaste(form, text) {
  return new Promise((resolve) => {
    let settled = false;
    let timedOut = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      form.off('smartPasted', handleSmartPasted);
      resolve(result);
    };

    const handleSmartPasted = (e) => {
      if (timedOut) {
        return;
      }

      const aiResult = e.aiResult ?? {};
      const fieldCount = Object.keys(aiResult).length;
      finish(
        fieldCount > 0
          ? { status: 'success', message: `Updated the form (${formatAiResultDetails(form, aiResult)}).` }
          : {
            status: 'failure',
            message: "I couldn't find any Form fields matching the request.",
          },
      );
    };

    const timeoutId = setTimeout(() => {
      timedOut = true;
      finish({
        status: 'failure',
        message: "I couldn't process your request. Please try rephrasing it.",
      });
    }, SMART_PASTE_TIMEOUT_MS);

    form.on('smartPasted', handleSmartPasted);

    try {
      form.smartPaste(text);
    } catch {
      finish({
        status: 'failure',
        message: "I couldn't process your request. Please try rephrasing it.",
      });
    }
  });
}

function getFilterConditions(filterValue) {
  if (!Array.isArray(filterValue)) return [];
  return Array.isArray(filterValue[0]) ? filterValue.filter(Array.isArray) : [filterValue];
}

function combineFilterConditions(existingFilterValue, newCondition) {
  const conditions = getFilterConditions(existingFilterValue).filter((condition) => condition[0] !== newCondition[0]);
  conditions.push(newCondition);

  return conditions.length === 1 ? conditions[0] : conditions.flatMap((condition, index) => (index === 0 ? [condition] : ['and', condition]));
}

const gridCommands = {
  filterValue: {
    description: `Apply a filter to a single column. Pass column (dataField), operator, and value.
Supported operators: "=", "<>", "<", "<=", ">", ">=", "contains", "notcontains", "startswith", "endswith", "anyof".
Date values must be in "YYYY-MM-DDTHH:mm:ss" format (e.g. "2024-05-10T00:00:00").
The "Completion" column is a boolean (task completed or not): use operator "=" with value true for completed tasks, or value false for tasks that are not completed.
To filter a date column by a year and/or month (the same thing the grid's own header filter does when you pick a year then a month), use operator "anyof" with value as an array of one or more strings in "YYYY" (whole year, e.g. "2023") or "YYYY/M" (whole month, month is 1-12 with no leading zero, e.g. "2023/5" for May 2023) format, e.g. {"column": "DueDate", "operator": "anyof", "value": ["2023/5"]} for "May 2023". Only use "anyof" when the year is known; if the year is missing and cannot be inferred from elsewhere in the request (e.g. plain "in May" with no year anywhere), do not guess it - omit this action entirely instead of adding it with a made-up year.`,
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
      const { column, failure } = getColumnOrFail(grid, args.column);
      if (failure) return failure;

      const caption = column.caption ?? args.column;
      let { value } = args;

      if (args.column === 'Completion' && typeof value !== 'boolean') {
        const normalized = String(value).trim().toLowerCase();
        value = value === 100 || ['true', 'completed', 'yes', '100'].includes(normalized);
      }

      if ((column.dataType === 'date' || column.dataType === 'datetime') && typeof value === 'string') {
        const parsedDate = new Date(value);
        if (!Number.isNaN(parsedDate.getTime())) {
          value = parsedDate;
        }
      }

      if (args.operator === 'anyof' && Array.isArray(value)) {
        const mentionedYears = new Set(String(rawText ?? '').match(/\b\d{4}\b/g));
        const hasUnrecognizedYear = value.some((entry) => !mentionedYears.has(String(entry).split('/')[0]));

        if (hasUnrecognizedYear) {
          return {
            status: 'failure',
            message: 'No field or column exists with such a name, or the entered value is invalid.',
          };
        }
      }

      try {
        const newCondition = [args.column, args.operator, value];
        grid.option('filterValue', combineFilterConditions(grid.option('filterValue'), newCondition));
        return {
          status: 'success',
          message: `Filtered by '${caption}'.`,
        };
      } catch {
        return {
          status: 'failure',
          message: `I couldn't apply that filter to '${caption}'. Check that the value matches the column's type.`,
        };
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
        return {
          status: 'failure',
          message: "I couldn't clear the DataGrid's filters.",
        };
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
      const { column, failure } = getColumnOrFail(grid, args.column);
      if (failure) return failure;

      const caption = column.caption ?? args.column;

      try {
        grid.columnOption(args.column, 'sortOrder', args.sortOrder === 'none' ? undefined : args.sortOrder);

        const message = args.sortOrder === 'none' ? `Cleared sorting on '${caption}'.` : `Sorted by '${caption}' (${args.sortOrder === 'asc' ? 'ascending' : 'descending'}).`;

        return { status: 'success', message };
      } catch {
        return {
          status: 'failure',
          message: `I couldn't sort by '${caption}'.`,
        };
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
        return {
          status: 'failure',
          message: "I couldn't clear the DataGrid's sorting.",
        };
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
      const { column, failure } = getColumnOrFail(grid, args.column);
      if (failure) return failure;

      const caption = column.caption ?? args.column;

      try {
        grid.columnOption(args.column, 'visible', args.visible);
        return {
          status: 'success',
          message: args.visible ? `Showed column '${caption}'.` : `Hid column '${caption}'.`,
        };
      } catch {
        return {
          status: 'failure',
          message: `I couldn't change the visibility of '${caption}'.`,
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
        status: 'failure',
        message: `I couldn't find a DataGrid column named '${columnName}'.`,
      },
    };
  }

  return { column, failure: null };
}

function buildGridResponseSchema() {
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

function buildGridPromptSection(columnNames) {
  const commandDescriptions = Object.entries(gridCommands)
    .map(([name, command]) => `- '${name}': ${command.description}`)
    .join('\n');

  return `GRID: translate any part of the request that affects the task grid into one or more grid commands (the "actions" array).
Available columns (dataField): ${columnNames.join(', ')}.
CRITICAL RULE: a column mentioned in the request must clearly correspond to one of the available columns above (matching by meaning is fine, e.g. "due date" -> "DueDate"). If it does not - even if it superficially looks like it could be a column name - you must NOT invent or substitute the closest-sounding available column. Instead, still emit the action using the column name exactly as written in the request, so the app can report that the column wasn't found - never replace it with a different, existing column just to make the action valid.
Example: request "filter the ZXQ column by foo" - ZXQ matches no available column, so emit {"column": "ZXQ", ...} as-is (it will correctly fail as "column not found") - do NOT emit an action for 'Subject' or any other real column instead.
The "Completion" column is a boolean: true means the task is completed, false means it is not. To filter for 'completed' tasks, use {'column': 'Completion', 'operator': '=', 'value': true}. To filter for 'not completed' tasks, use {'column': 'Completion', 'operator': '=', 'value': false}.
Available grid commands:
${commandDescriptions}`;
}

function getGridColumnNames(gridInstance) {
  return gridInstance.option('columns').map((col) => col.dataField);
}

function applyGridActions(grid, actions, rawText) {
  return actions.map((action) => {
    const command = gridCommands[action.name];

    if (!command) {
      return {
        status: 'failure',
        message: `I don't know how to do '${action.name}'.`,
      };
    }

    return command.execute(grid, action.args ?? {}, rawText);
  });
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);

  try {
    return JSON.parse(match[0]);
  } catch {
    throw new ChatCommandError(
      '❌ I received an unexpected response from the AI service. Please rephrase your request and try again.',
    );
  }
}

function executeAiCommand(text, aiIntegration) {
  return new Promise((resolve, reject) => {
    aiIntegration.execute(
      { text },
      {
        onComplete: (finalResponse) => {
          try {
            resolve(extractJson(finalResponse));
          } catch (error) {
            reject(error);
          }
        },
        onError: reject,
      },
    );
  });
}

function buildGridSystemPrompt(columnNames) {
  return `You control a task DataGrid on this page.
This page ALSO has a separate employee/customer profile form (fields like name, title/prefix, position, state, birth date) that is handled elsewhere - it is NOT part of this grid.
Figure out what the user's request is about and translate ONLY the part that is clearly about the task grid into the matching commands described below.
Do NOT create a grid action just because a value could technically fit a text column (e.g. 'Subject'). If the request is about the profile form (e.g. mentions a person's name, title, job position, state, or birth date), leave that part out of 'actions' entirely - even if no other part of the request is grid-related.

${buildGridPromptSection(columnNames)}

Respond with STRICT JSON only, no code fences, no explanations, matching this schema:
${JSON.stringify(buildGridResponseSchema())}

If the request has nothing to do with the grid, respond with 'actions': [].`;
}

function buildFormActionPromptSection(form) {
  const fieldList = getFormFieldOptions(form)
    .map((f) => `${f.dataField} (${f.label})`)
    .join(', ');

  return `Form fields (dataField and label): ${fieldList}.
If the request is about the form, also set \`formAction\` to one of:
- \`{type: 'clear_field', field: '<dataField>'}\` to clear one specific field.
- \`{type: 'clear_all'}\` to clear/reset the whole form.
- \`{type: 'smart_paste'}\` to fill in form data from the request text.
Set \`formAction\` to \`null\` if the request is not about the form.`;
}

async function classifyRequest(text, aiIntegration, form) {
  if (!aiIntegration) {
    return { target: 'mixed', formAction: null };
  }

  const prompt = [
    `Decide which UI area should handle the user's request.
Return STRICT JSON only, without markdown fences.
Format: {'target': 'form' | 'grid' | 'mixed' | 'none', 'formAction': <see below> | null, 'reason': 'short explanation' }
Rules:
- Use \`form\` for profile/customer form updates, field clearing, or smart-paste style data entry.
- Use \`grid\` for sorting, filtering, showing/hiding columns, or other \`DataGrid\` tasks.
- Use \`mixed\` when the request clearly asks for both a form change and a grid change together.
- Use \`none\` when the request is unrelated to both areas.
If you are not confident, return mixed.

${buildFormActionPromptSection(form)}

User request: '${text}'`,
  ].join('\n');

  try {
    const parsed = await executeAiCommand(prompt, aiIntegration);
    const target = String(parsed?.target ?? 'mixed')
      .trim()
      .toLowerCase();
    const rawFormAction = parsed?.formAction;
    const formAction =
      rawFormAction && FORM_ACTION_TYPES.has(rawFormAction.type)
        ? rawFormAction
        : null;

    return {
      target: ROUTER_TARGETS.has(target) ? target : 'mixed',
      formAction,
    };
  } catch {
    return { target: 'mixed', formAction: null };
  }
}

function buildGridResultsPromise(gridInstance, aiIntegration, text) {
  const columnNames = getGridColumnNames(gridInstance);
  const prompt = `${buildGridSystemPrompt(columnNames)}\n\nUser request: '${text}'`;

  return executeAiCommand(prompt, aiIntegration)
    .then((parsed) => {
      const actions = Array.isArray(parsed.actions) ? parsed.actions : [];

      if (actions.length === 0) {
        gridInstance?.endCustomLoading();
        return { results: [], error: null };
      }

      try {
        return {
          results: applyGridActions(gridInstance, actions, text),
          error: null,
        };
      } finally {
        gridInstance?.endCustomLoading();
      }
    })
    .catch((error) => {
      gridInstance?.endCustomLoading();
      return { results: [], error };
    });
}

function buildFormResultsPromise(form, formAction, text) {
  const clearResult = applyFormClearAction(form, formAction);
  if (clearResult) {
    return Promise.resolve({ results: [clearResult], error: null });
  }

  return applyFormSmartPaste(form, text)
    .then((result) => ({ results: [result], error: null }))
    .catch((error) => ({ results: [], error }));
}

function formatFailures(failed) {
  return failed.map((message) => `❌ ${message}`).join('\n');
}

function formatSucceeded(succeeded) {
  return succeeded.map((message) => `✅ Done. ${message}`).join('\n');
}

function joinSucceededOrThrow(results, fallbackError) {
  const succeeded = results
    .filter((r) => r.status === 'success')
    .map((r) => r.message);
  const failed = results
    .filter((r) => r.status === 'failure')
    .map((r) => r.message);

  if (succeeded.length === 0) {
    throw failed.length > 0
      ? new ChatCommandError(formatFailures(failed))
      : (fallbackError ?? new ChatCommandError(FIELD_OR_VALUE_NOT_FOUND_MESSAGE));
  }

  return failed.length > 0
    ? `${formatSucceeded(succeeded)}\n${formatFailures(failed)}`
    : formatSucceeded(succeeded);
}

async function runCommand(text, { form, gridInstance, aiIntegration }) {
  if (text.length > MAX_USER_MESSAGE_LENGTH) {
    return Promise.reject(
      new ChatCommandError(
        '❌ This message is too long for me to process. Please shorten it and try again.',
      ),
    );
  }

  const { target, formAction } = await classifyRequest(
    text,
    aiIntegration,
    form,
  );

  if (target === 'none') {
    throw new ChatCommandError(
      "❌ This request doesn't appear to be related to Form or DataGrid. Please try rephrasing it.",
    );
  }

  if (target === 'form') {
    const { results: formResults, error: formError } =
      await buildFormResultsPromise(form, formAction, text);

    return joinSucceededOrThrow(formResults, formError);
  }

  if (target === 'grid') {
    gridInstance?.beginCustomLoading();

    const { results: gridResults, error: gridError } =
      await buildGridResultsPromise(gridInstance, aiIntegration, text);

    return joinSucceededOrThrow(gridResults, gridError);
  }

  const [
    { results: formResults, error: formError },
    { results: gridResults, error: gridError },
  ] = await Promise.all([
    buildFormResultsPromise(form, formAction, text),
    buildGridResultsPromise(gridInstance, aiIntegration, text),
  ]);

  if (gridError) {
    console.warn(
      'DataGrid AI request failed, but the Form request may have succeeded:',
      gridError,
    );
  }

  if (formError) {
    console.warn(
      'Form AI request failed, but the DataGrid request may have succeeded:',
      formError,
    );
  }

  return joinSucceededOrThrow(
    [...formResults, ...gridResults],
    gridError ?? formError,
  );
}

function reportAiResult(promise, pushMessage) {
  return promise
    .then((message) => {
      pushMessage({
        author: { id: 'ai', name: 'AI Assistant' },
        text: message,
      });
    })
    .catch((error) => {
      const text =
        error instanceof ChatCommandError
          ? error.message
          : '❌ I couldn\'t reach the AI service. Please check your connection and try again.';

      pushMessage({
        author: { id: 'ai', name: 'AI Assistant' },
        text,
      });
    });
}

function routeMessage(
  text,
  { form, gridInstance, aiIntegration, pushMessage },
) {
  return reportAiResult(
    runCommand(text, { form, gridInstance, aiIntegration }),
    pushMessage,
  );
}

function createAiIntegration() {
  const aiService = new AzureOpenAI({
    dangerouslyAllowBrowser: true,
    deployment,
    endpoint,
    apiVersion,
    apiKey,
  });

  async function getAIResponse(messages, signal) {
    const params = {
      messages,
      model: deployment,
      max_completion_tokens: 1000,
      temperature: 0,
    };

    const response = await aiService.chat.completions.create(params, {
      signal,
    });

    return response.choices[0].message?.content;
  }

  async function getAIResponseRecursive(messages, signal) {
    return getAIResponse(messages, signal).catch(async (error) => {
      if (!error.message.includes('Connection error')) {
        throw error;
      }

      DevExpress.ui.notify({
        message: 'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
        width: 'auto',
        type: 'error',
        displayTime: 5000,
      });

      await new Promise((resolve) => setTimeout(resolve, 30000));

      return getAIResponseRecursive(messages, signal);
    });
  }

  return new DevExpress.aiIntegration.AIIntegration({
    sendRequest({ prompt, data }) {
      const isValidRequest = JSON.stringify(prompt.user).length < 20000;
      if (!isValidRequest) {
        return {
          promise: Promise.reject(new ChatCommandError('❌ This message is too long for me to process. Please shorten it and try again.')),
          abort: () => {},
        };
      }
      const controller = new AbortController();
      const signal = controller.signal;

      const isSmartPasteRequest = Array.isArray(data?.fields);
      const system = isSmartPasteRequest
        ? `${prompt.system ?? ''} IMPORTANT: reply on a SINGLE line with no line breaks of any kind - use ';;;' as the only separator between fields.`
        : prompt.system ?? '';

      const aiPrompt = [
        { role: 'system', content: system },
        { role: 'user', content: prompt.user },
      ];
      const promise = getAIResponseRecursive(aiPrompt, signal);

      return {
        promise,
        abort: () => {
          controller.abort();
        },
      };
    },
  });
}
