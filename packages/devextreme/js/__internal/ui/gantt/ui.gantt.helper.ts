/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { isFunction } from '@js/core/utils/type';

export const GanttHelper = {
  prepareMapHandler(getters) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (data) => Object.keys(getters).reduce((previous, key) => {
      const resultKey = key === 'key' ? 'id' : key;
      previous[resultKey] = getters[key](data);
      return previous;
    }, {});
  },

  prepareSetterMapHandler(setters) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (data) => Object.keys(setters).reduce((previous, key) => {
      const resultKey = key === 'key' ? 'id' : key;
      setters[key](previous, data[resultKey]);
      return previous;
    }, {});
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  compileGettersByOption(optionValue) {
    const getters = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const field in optionValue) {
      const exprMatches = /(\w*)Expr/.exec(field);
      if (exprMatches) {
        getters[exprMatches[1]] = compileGetter(optionValue[exprMatches[0]]);
      }
    }
    return getters;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  compileSettersByOption(optionValue) {
    const setters = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const field in optionValue) {
      const exprMatches = /(\w*)Expr/.exec(field);
      if (exprMatches && !isFunction(optionValue[exprMatches[0]])) {
        setters[exprMatches[1]] = compileSetter(optionValue[exprMatches[0]]);
      }
    }
    return setters;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  compileFuncSettersByOption(optionValue) {
    const setters = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const field in optionValue) {
      const exprMatches = /(\w*)Expr/.exec(field);
      if (exprMatches && isFunction(optionValue[exprMatches[0]])) {
        setters[exprMatches[1]] = optionValue[exprMatches[0]];
      }
    }
    return setters;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getStoreObject(option, modelObject) {
    const setters = GanttHelper.compileSettersByOption(option);
    return Object.keys(setters).reduce((previous, key) => {
      if (key !== 'key') {
        setters[key](previous, modelObject[key]);
      }
      return previous;
    }, {});
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getInvertedData(data, keyGetter) {
    const inverted = {};
    if (data) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < data.length; i += 1) {
        const dataItem = data[i];
        const key = keyGetter(dataItem);
        inverted[key] = dataItem;
      }
    }
    return inverted;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getArrayFromOneElement(element) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return element === undefined || element === null ? [] : [element];
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSelectionMode(allowSelection) {
    return allowSelection ? 'single' : 'none';
  },

  convertTreeToList(node, array): void {
    if (node?.data && node?.visible) {
      array.push(node.data);
    }

    for (let i = 0; i < node.children?.length; i += 1) {
      const child = node.children[i];
      GanttHelper.convertTreeToList(child, array);
    }
  },

  getAllParentNodesKeys(node, array): void {
    if (node?.data) {
      array.push(node.key);
    }

    if (node?.parent?.data) {
      GanttHelper.getAllParentNodesKeys(node.parent, array);
    }
  },

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getDefaultOptions() {
    return {
      tasks: {
        dataSource: null,
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        startExpr: 'start',
        endExpr: 'end',
        progressExpr: 'progress',
        titleExpr: 'title',
        colorExpr: 'color',
      },
      dependencies: {
        dataSource: null,
        keyExpr: 'id',
        predecessorIdExpr: 'predecessorId',
        successorIdExpr: 'successorId',
        typeExpr: 'type',
      },
      resources: {
        dataSource: null,
        keyExpr: 'id',
        textExpr: 'text',
        colorExpr: 'color',
      },
      resourceAssignments: {
        dataSource: null,
        keyExpr: 'id',
        taskIdExpr: 'taskId',
        resourceIdExpr: 'resourceId',
      },
      columns: undefined,
      taskListWidth: 300,
      showResources: true,
      showDependencies: true,
      taskTitlePosition: 'inside',
      firstDayOfWeek: undefined,
      selectedRowKey: undefined,
      onSelectionChanged: null,
      onTaskClick: null,
      onTaskDblClick: null,
      onTaskInserting: null,
      onTaskInserted: null,
      onTaskDeleting: null,
      onTaskDeleted: null,
      onTaskUpdating: null,
      onTaskUpdated: null,
      onTaskMoving: null,
      onTaskEditDialogShowing: null,
      onDependencyInserting: null,
      onDependencyInserted: null,
      onDependencyDeleting: null,
      onDependencyDeleted: null,
      onResourceInserting: null,
      onResourceInserted: null,
      onResourceDeleting: null,
      onResourceDeleted: null,
      onResourceAssigning: null,
      onResourceAssigned: null,

      onResourceUnassigning: null,

      onResourceUnassigned: null,
      onCustomCommand: null,
      onContextMenuPreparing: null,
      allowSelection: true,
      showRowLines: true,
      stripLines: undefined,
      scaleType: 'auto',
      scaleTypeRange: {
        min: 'minutes',
        max: 'years',
      },
      editing: {
        enabled: false,
        allowTaskAdding: true,
        allowTaskDeleting: true,
        allowTaskUpdating: true,
        allowDependencyAdding: true,
        allowDependencyDeleting: true,
        allowResourceAdding: true,
        allowResourceDeleting: true,
        allowResourceUpdating: true,
        allowTaskResourceUpdating: true,
      },
      validation: {
        validateDependencies: false,
        autoUpdateParentTasks: false,
        enablePredecessorGap: false,
      },
      toolbar: null,
      contextMenu: {
        enabled: true,
        items: undefined,
      },
      taskTooltipContentTemplate: null,
      taskProgressTooltipContentTemplate: null,
      taskTimeTooltipContentTemplate: null,
      taskContentTemplate: null,
      rootValue: 0,
      sorting: {
        ascendingText: messageLocalization.format(
          'dxGantt-sortingAscendingText',
        ),
        descendingText: messageLocalization.format(
          'dxGantt-sortingDescendingText',
        ),
        clearText: messageLocalization.format('dxGantt-sortingClearText'),
        mode: 'single',
        showSortIndexes: false,
      },
      filterRow: undefined,
      headerFilter: undefined,
      rtlEnabled: false,
    };
  },
};
