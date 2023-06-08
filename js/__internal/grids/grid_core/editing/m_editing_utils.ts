export const createFailureHandler = function (deferred) {
  return function (arg) {
    const error = arg instanceof Error ? arg : new Error(arg && String(arg) || 'Unknown error');
    deferred.reject(error);
  };
};

export const isEditingCell = function (isEditRow, cellOptions) {
  return cellOptions.isEditing || isEditRow && cellOptions.column.allowEditing;
};

export const isEditingOrShowEditorAlwaysDataCell = function (isEditRow, cellOptions) {
  const isCommandCell = !!cellOptions.column.command;
  const isEditing = isEditingCell(isEditRow, cellOptions);
  const isEditorCell = !isCommandCell && (isEditing || cellOptions.column.showEditorAlways);
  return cellOptions.rowType === 'data' && isEditorCell;
};

export const getEditingTexts = (options) => {
  const editingTexts = options.component.option('editing.texts') || {};

  return {
    save: editingTexts.saveRowChanges,
    cancel: editingTexts.cancelRowChanges,
    edit: editingTexts.editRow,
    undelete: editingTexts.undeleteRow,
    delete: editingTexts.deleteRow,
    add: editingTexts.addRowToNode,
  };
};

export const getButtonIndex = (buttons, name) => {
  let result = -1;

  // @ts-expect-error
  // eslint-disable-next-line consistent-return, array-callback-return
  buttons.some((button, index) => {
    if (getButtonName(button) === name) {
      result = index;
      return true;
    }
  });

  return result;
};

export function getButtonName(button) {
  // @ts-expect-error
  return isObject(button) ? button.name : button;
}
