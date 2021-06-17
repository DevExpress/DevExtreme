import { compileGetter, compileSetter } from '../../core/utils/data';

export const GanttHelper = {

    prepareMapHandler(getters) {
        return (data) => {
            return Object.keys(getters)
                .reduce((previous, key) => {
                    const resultKey = key === 'key' ? 'id' : key;
                    previous[resultKey] = getters[key](data);
                    return previous;
                }, {});
        };
    },

    prepareSetterMapHandler(setters) {
        return (data) => {
            return Object.keys(setters)
                .reduce((previous, key) => {
                    const resultKey = key === 'key' ? 'id' : key;
                    setters[key](previous, data[resultKey]);
                    return previous;
                }, {});
        };
    },

    compileGettersByOption(optionValue) {
        const getters = {};
        for(const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                getters[exprMatches[1]] = compileGetter(optionValue[exprMatches[0]]);
            }
        }
        return getters;
    },

    compileSettersByOption(optionValue) {
        const setters = {};
        for(const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                setters[exprMatches[1]] = compileSetter(optionValue[exprMatches[0]]);
            }
        }
        return setters;
    },

    getStoreObject(option, modelObject) {
        const setters = GanttHelper.compileSettersByOption(option);
        return Object.keys(setters)
            .reduce((previous, key) => {
                if(key !== 'key') {
                    setters[key](previous, modelObject[key]);
                }
                return previous;
            }, {});
    },

    getInvertedData(data, keyGetter) {
        const inverted = { };
        if(data) {
            for(let i = 0; i < data.length; i++) {
                const dataItem = data[i];
                const key = keyGetter(dataItem);
                inverted[key] = dataItem;
            }
        }
        return inverted;
    },

    getArrayFromOneElement(element) {
        return element === undefined || element === null ? [] : [element];
    },

    getSelectionMode(allowSelection) {
        return allowSelection ? 'single' : 'none';
    },

    getDefaultOptions() {
        return {
            /**
            * @name dxGanttOptions.rtlEnabled
            * @hidden
            */

            tasks: {
                dataSource: null,
                keyExpr: 'id',
                parentIdExpr: 'parentId',
                startExpr: 'start',
                endExpr: 'end',
                progressExpr: 'progress',
                titleExpr: 'title',
                colorExpr: 'color'
            },
            dependencies: {
                dataSource: null,
                keyExpr: 'id',
                predecessorIdExpr: 'predecessorId',
                successorIdExpr: 'successorId',
                typeExpr: 'type'
            },
            resources: {
                dataSource: null,
                keyExpr: 'id',
                textExpr: 'text',
                colorExpr: 'color'
            },
            resourceAssignments: {
                dataSource: null,
                keyExpr: 'id',
                taskIdExpr: 'taskId',
                resourceIdExpr: 'resourceId'
            },
            columns: undefined,
            taskListWidth: 300,
            showResources: true,
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
            // eslint-disable-next-line spellcheck/spell-checker
            onResourceUnassigning: null,
            // eslint-disable-next-line spellcheck/spell-checker
            onResourceUnassigned: null,
            onCustomCommand: null,
            onContextMenuPreparing: null,
            allowSelection: true,
            showRowLines: true,
            stripLines: undefined,
            scaleType: 'auto',
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
                allowTaskResourceUpdating: true
            },
            validation: {
                validateDependencies: false,
                autoUpdateParentTasks: false
            },
            toolbar: null,
            contextMenu: {
                enabled: true,
                items: undefined
            },
            taskTooltipContentTemplate: null,
            taskProgressTooltipContentTemplate: null,
            taskTimeTooltipContentTemplate: null,
            taskContentTemplate: null,
            rootValue: 0
        };
    }

};
