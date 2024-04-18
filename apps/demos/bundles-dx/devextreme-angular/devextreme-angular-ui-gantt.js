System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/gantt', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxGantt, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiColumnComponent, DxiStripLineComponent, DxiColumnModule, DxoFormatModule, DxoHeaderFilterModule, DxoSearchModule, DxoContextMenuModule, DxiItemModule, DxoDependenciesModule, DxoEditingModule, DxoFilterRowModule, DxoOperationDescriptionsModule, DxoTextsModule, DxoResourceAssignmentsModule, DxoResourcesModule, DxoScaleTypeRangeModule, DxoSortingModule, DxiStripLineModule, DxoTasksModule, DxoToolbarModule, DxoValidationModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxGantt = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiColumnComponent = module.DxiColumnComponent;
            DxiStripLineComponent = module.DxiStripLineComponent;
            DxiColumnModule = module.DxiColumnModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoHeaderFilterModule = module.DxoHeaderFilterModule;
            DxoSearchModule = module.DxoSearchModule;
            DxoContextMenuModule = module.DxoContextMenuModule;
            DxiItemModule = module.DxiItemModule;
            DxoDependenciesModule = module.DxoDependenciesModule;
            DxoEditingModule = module.DxoEditingModule;
            DxoFilterRowModule = module.DxoFilterRowModule;
            DxoOperationDescriptionsModule = module.DxoOperationDescriptionsModule;
            DxoTextsModule = module.DxoTextsModule;
            DxoResourceAssignmentsModule = module.DxoResourceAssignmentsModule;
            DxoResourcesModule = module.DxoResourcesModule;
            DxoScaleTypeRangeModule = module.DxoScaleTypeRangeModule;
            DxoSortingModule = module.DxoSortingModule;
            DxiStripLineModule = module.DxiStripLineModule;
            DxoTasksModule = module.DxoTasksModule;
            DxoToolbarModule = module.DxoToolbarModule;
            DxoValidationModule = module.DxoValidationModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            /**
             * The Gantt is a UI component that displays the task flow and dependencies between tasks.

             */
            class DxGanttComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component changes its visual state as a result of user interaction.
                
                 */
                get activeStateEnabled() {
                    return this._getOption('activeStateEnabled');
                }
                set activeStateEnabled(value) {
                    this._setOption('activeStateEnabled', value);
                }
                /**
                 * Specifies whether users can select tasks in the Gantt.
                
                 */
                get allowSelection() {
                    return this._getOption('allowSelection');
                }
                set allowSelection(value) {
                    this._setOption('allowSelection', value);
                }
                /**
                 * An array of columns in the Gantt.
                
                 */
                get columns() {
                    return this._getOption('columns');
                }
                set columns(value) {
                    this._setOption('columns', value);
                }
                /**
                 * Configures the context menu settings.
                
                 */
                get contextMenu() {
                    return this._getOption('contextMenu');
                }
                set contextMenu(value) {
                    this._setOption('contextMenu', value);
                }
                /**
                 * Configures dependencies.
                
                 */
                get dependencies() {
                    return this._getOption('dependencies');
                }
                set dependencies(value) {
                    this._setOption('dependencies', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Configures edit properties.
                
                 */
                get editing() {
                    return this._getOption('editing');
                }
                set editing(value) {
                    this._setOption('editing', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies the end date of the date interval in the Gantt chart.
                
                 */
                get endDateRange() {
                    return this._getOption('endDateRange');
                }
                set endDateRange(value) {
                    this._setOption('endDateRange', value);
                }
                /**
                 * Configures filter row settings.
                
                 */
                get filterRow() {
                    return this._getOption('filterRow');
                }
                set filterRow(value) {
                    this._setOption('filterRow', value);
                }
                /**
                 * Specifies the first day of a week.
                
                 */
                get firstDayOfWeek() {
                    return this._getOption('firstDayOfWeek');
                }
                set firstDayOfWeek(value) {
                    this._setOption('firstDayOfWeek', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * Configures the header filter settings.
                
                 */
                get headerFilter() {
                    return this._getOption('headerFilter');
                }
                set headerFilter(value) {
                    this._setOption('headerFilter', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies whether the UI component changes its state when a user pauses on it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Configures resource assignments.
                
                 */
                get resourceAssignments() {
                    return this._getOption('resourceAssignments');
                }
                set resourceAssignments(value) {
                    this._setOption('resourceAssignments', value);
                }
                /**
                 * Configures task resources.
                
                 */
                get resources() {
                    return this._getOption('resources');
                }
                set resources(value) {
                    this._setOption('resources', value);
                }
                /**
                 * Specifies the root task&apos;s identifier.
                
                 */
                get rootValue() {
                    return this._getOption('rootValue');
                }
                set rootValue(value) {
                    this._setOption('rootValue', value);
                }
                /**
                 * Specifies the zoom level of tasks in the Gantt chart.
                
                 */
                get scaleType() {
                    return this._getOption('scaleType');
                }
                set scaleType(value) {
                    this._setOption('scaleType', value);
                }
                /**
                 * Configures zoom range settings.
                
                 */
                get scaleTypeRange() {
                    return this._getOption('scaleTypeRange');
                }
                set scaleTypeRange(value) {
                    this._setOption('scaleTypeRange', value);
                }
                /**
                 * Allows you to select a row or determine which row is selected.
                
                 */
                get selectedRowKey() {
                    return this._getOption('selectedRowKey');
                }
                set selectedRowKey(value) {
                    this._setOption('selectedRowKey', value);
                }
                /**
                 * Specifies whether to display dependencies between tasks.
                
                 */
                get showDependencies() {
                    return this._getOption('showDependencies');
                }
                set showDependencies(value) {
                    this._setOption('showDependencies', value);
                }
                /**
                 * Specifies whether to display task resources.
                
                 */
                get showResources() {
                    return this._getOption('showResources');
                }
                set showResources(value) {
                    this._setOption('showResources', value);
                }
                /**
                 * Specifies whether to show/hide horizontal faint lines that separate tasks.
                
                 */
                get showRowLines() {
                    return this._getOption('showRowLines');
                }
                set showRowLines(value) {
                    this._setOption('showRowLines', value);
                }
                /**
                 * Configures sort settings.
                
                 */
                get sorting() {
                    return this._getOption('sorting');
                }
                set sorting(value) {
                    this._setOption('sorting', value);
                }
                /**
                 * Specifies the start date of the date interval in the Gantt chart.
                
                 */
                get startDateRange() {
                    return this._getOption('startDateRange');
                }
                set startDateRange(value) {
                    this._setOption('startDateRange', value);
                }
                /**
                 * Configures strip lines.
                
                 */
                get stripLines() {
                    return this._getOption('stripLines');
                }
                set stripLines(value) {
                    this._setOption('stripLines', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * Specifies custom content for the task.
                
                 */
                get taskContentTemplate() {
                    return this._getOption('taskContentTemplate');
                }
                set taskContentTemplate(value) {
                    this._setOption('taskContentTemplate', value);
                }
                /**
                 * Specifies the width of the task list in pixels.
                
                 */
                get taskListWidth() {
                    return this._getOption('taskListWidth');
                }
                set taskListWidth(value) {
                    this._setOption('taskListWidth', value);
                }
                /**
                 * Specifies custom content for the tooltip that displays the task&apos;s progress while the progress handler is resized in the UI.
                
                 */
                get taskProgressTooltipContentTemplate() {
                    return this._getOption('taskProgressTooltipContentTemplate');
                }
                set taskProgressTooltipContentTemplate(value) {
                    this._setOption('taskProgressTooltipContentTemplate', value);
                }
                /**
                 * Configures tasks.
                
                 */
                get tasks() {
                    return this._getOption('tasks');
                }
                set tasks(value) {
                    this._setOption('tasks', value);
                }
                /**
                 * Specifies custom content for the tooltip that displays the task&apos;s start and end time while the task is resized in the UI.
                
                 */
                get taskTimeTooltipContentTemplate() {
                    return this._getOption('taskTimeTooltipContentTemplate');
                }
                set taskTimeTooltipContentTemplate(value) {
                    this._setOption('taskTimeTooltipContentTemplate', value);
                }
                /**
                 * Specifies a task&apos;s title position.
                
                 */
                get taskTitlePosition() {
                    return this._getOption('taskTitlePosition');
                }
                set taskTitlePosition(value) {
                    this._setOption('taskTitlePosition', value);
                }
                /**
                 * Specifies custom content for the task tooltip.
                
                 */
                get taskTooltipContentTemplate() {
                    return this._getOption('taskTooltipContentTemplate');
                }
                set taskTooltipContentTemplate(value) {
                    this._setOption('taskTooltipContentTemplate', value);
                }
                /**
                 * Configures toolbar settings.
                
                 */
                get toolbar() {
                    return this._getOption('toolbar');
                }
                set toolbar(value) {
                    this._setOption('toolbar', value);
                }
                /**
                 * Configures validation properties.
                
                 */
                get validation() {
                    return this._getOption('validation');
                }
                set validation(value) {
                    this._setOption('validation', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the context menu is rendered.
                
                
                 */
                onContextMenuPreparing;
                /**
                
                 * A function that is executed after a custom command item was clicked. Allows you to implement a custom command&apos;s functionality.
                
                
                 */
                onCustomCommand;
                /**
                
                 * A function that is executed when a dependency is deleted.
                
                
                 */
                onDependencyDeleted;
                /**
                
                 * A function that is executed before a dependency is deleted.
                
                
                 */
                onDependencyDeleting;
                /**
                
                 * A function that is executed when a dependency is inserted.
                
                
                 */
                onDependencyInserted;
                /**
                
                 * A function that is executed before a dependency is inserted.
                
                
                 */
                onDependencyInserting;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a resource is assigned to a task.
                
                
                 */
                onResourceAssigned;
                /**
                
                 * A function that is executed before a resource is assigned to a task.
                
                
                 */
                onResourceAssigning;
                /**
                
                 * A function that is executed when a resource is deleted.
                
                
                 */
                onResourceDeleted;
                /**
                
                 * A function that is executed before a resource is deleted.
                
                
                 */
                onResourceDeleting;
                /**
                
                 * A function that is executed when a resource is inserted.
                
                
                 */
                onResourceInserted;
                /**
                
                 * A function that is executed before a resource is inserted.
                
                
                 */
                onResourceInserting;
                /**
                
                 * A function that is executed before the Resource Manager dialog is shown.
                
                
                 */
                onResourceManagerDialogShowing;
                /**
                
                 * A function that is executed when a resource is unassigned from a task.
                
                
                 */
                onResourceUnassigned;
                /**
                
                 * A function that is executed before a resource is unassigned from a task.
                
                
                 */
                onResourceUnassigning;
                /**
                
                 * A function that is executed before a scale cell is prepared.
                
                
                 */
                onScaleCellPrepared;
                /**
                
                 * A function that is executed after users select a task or clear its selection.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * A function that is executed when a user clicks a task.
                
                
                 */
                onTaskClick;
                /**
                
                 * A function that is executed when a user double-clicks a task.
                
                
                 */
                onTaskDblClick;
                /**
                
                 * A function that is executed when a task is deleted.
                
                
                 */
                onTaskDeleted;
                /**
                
                 * A function that is executed before a task is deleted.
                
                
                 */
                onTaskDeleting;
                /**
                
                 * A function that is executed before the edit dialog is shown.
                
                
                 */
                onTaskEditDialogShowing;
                /**
                
                 * A function that is executed when a task is inserted.
                
                
                 */
                onTaskInserted;
                /**
                
                 * A function that is executed before a task is inserted.
                
                
                 */
                onTaskInserting;
                /**
                
                 * A function that is executed before a task is moved.
                
                
                 */
                onTaskMoving;
                /**
                
                 * A function that is executed when a task is updated.
                
                
                 */
                onTaskUpdated;
                /**
                
                 * A function that is executed before a task is updated.
                
                
                 */
                onTaskUpdating;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowSelectionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                contextMenuChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dependenciesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                editingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateRangeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterRowChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                firstDayOfWeekChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                headerFilterChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                resourceAssignmentsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                resourcesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rootValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scaleTypeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scaleTypeRangeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedRowKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showDependenciesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showResourcesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showRowLinesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sortingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateRangeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stripLinesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                taskContentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                taskListWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                taskProgressTooltipContentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tasksChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                taskTimeTooltipContentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                taskTitlePositionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                taskTooltipContentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                toolbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                get columnsChildren() {
                    return this._getOption('columns');
                }
                set columnsChildren(value) {
                    this.setChildren('columns', value);
                }
                get stripLinesChildren() {
                    return this._getOption('stripLines');
                }
                set stripLinesChildren(value) {
                    this.setChildren('stripLines', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
                        { subscribe: 'customCommand', emit: 'onCustomCommand' },
                        { subscribe: 'dependencyDeleted', emit: 'onDependencyDeleted' },
                        { subscribe: 'dependencyDeleting', emit: 'onDependencyDeleting' },
                        { subscribe: 'dependencyInserted', emit: 'onDependencyInserted' },
                        { subscribe: 'dependencyInserting', emit: 'onDependencyInserting' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'resourceAssigned', emit: 'onResourceAssigned' },
                        { subscribe: 'resourceAssigning', emit: 'onResourceAssigning' },
                        { subscribe: 'resourceDeleted', emit: 'onResourceDeleted' },
                        { subscribe: 'resourceDeleting', emit: 'onResourceDeleting' },
                        { subscribe: 'resourceInserted', emit: 'onResourceInserted' },
                        { subscribe: 'resourceInserting', emit: 'onResourceInserting' },
                        { subscribe: 'resourceManagerDialogShowing', emit: 'onResourceManagerDialogShowing' },
                        { subscribe: 'resourceUnassigned', emit: 'onResourceUnassigned' },
                        { subscribe: 'resourceUnassigning', emit: 'onResourceUnassigning' },
                        { subscribe: 'scaleCellPrepared', emit: 'onScaleCellPrepared' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { subscribe: 'taskClick', emit: 'onTaskClick' },
                        { subscribe: 'taskDblClick', emit: 'onTaskDblClick' },
                        { subscribe: 'taskDeleted', emit: 'onTaskDeleted' },
                        { subscribe: 'taskDeleting', emit: 'onTaskDeleting' },
                        { subscribe: 'taskEditDialogShowing', emit: 'onTaskEditDialogShowing' },
                        { subscribe: 'taskInserted', emit: 'onTaskInserted' },
                        { subscribe: 'taskInserting', emit: 'onTaskInserting' },
                        { subscribe: 'taskMoving', emit: 'onTaskMoving' },
                        { subscribe: 'taskUpdated', emit: 'onTaskUpdated' },
                        { subscribe: 'taskUpdating', emit: 'onTaskUpdating' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowSelectionChange' },
                        { emit: 'columnsChange' },
                        { emit: 'contextMenuChange' },
                        { emit: 'dependenciesChange' },
                        { emit: 'disabledChange' },
                        { emit: 'editingChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'endDateRangeChange' },
                        { emit: 'filterRowChange' },
                        { emit: 'firstDayOfWeekChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'headerFilterChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'resourceAssignmentsChange' },
                        { emit: 'resourcesChange' },
                        { emit: 'rootValueChange' },
                        { emit: 'scaleTypeChange' },
                        { emit: 'scaleTypeRangeChange' },
                        { emit: 'selectedRowKeyChange' },
                        { emit: 'showDependenciesChange' },
                        { emit: 'showResourcesChange' },
                        { emit: 'showRowLinesChange' },
                        { emit: 'sortingChange' },
                        { emit: 'startDateRangeChange' },
                        { emit: 'stripLinesChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'taskContentTemplateChange' },
                        { emit: 'taskListWidthChange' },
                        { emit: 'taskProgressTooltipContentTemplateChange' },
                        { emit: 'tasksChange' },
                        { emit: 'taskTimeTooltipContentTemplateChange' },
                        { emit: 'taskTitlePositionChange' },
                        { emit: 'taskTooltipContentTemplateChange' },
                        { emit: 'toolbarChange' },
                        { emit: 'validationChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxGantt(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('columns', changes);
                    this.setupChanges('stripLines', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('columns');
                    this._idh.doCheck('stripLines');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGanttComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxGanttComponent, selector: "dx-gantt", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowSelection: "allowSelection", columns: "columns", contextMenu: "contextMenu", dependencies: "dependencies", disabled: "disabled", editing: "editing", elementAttr: "elementAttr", endDateRange: "endDateRange", filterRow: "filterRow", firstDayOfWeek: "firstDayOfWeek", focusStateEnabled: "focusStateEnabled", headerFilter: "headerFilter", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", resourceAssignments: "resourceAssignments", resources: "resources", rootValue: "rootValue", scaleType: "scaleType", scaleTypeRange: "scaleTypeRange", selectedRowKey: "selectedRowKey", showDependencies: "showDependencies", showResources: "showResources", showRowLines: "showRowLines", sorting: "sorting", startDateRange: "startDateRange", stripLines: "stripLines", tabIndex: "tabIndex", taskContentTemplate: "taskContentTemplate", taskListWidth: "taskListWidth", taskProgressTooltipContentTemplate: "taskProgressTooltipContentTemplate", tasks: "tasks", taskTimeTooltipContentTemplate: "taskTimeTooltipContentTemplate", taskTitlePosition: "taskTitlePosition", taskTooltipContentTemplate: "taskTooltipContentTemplate", toolbar: "toolbar", validation: "validation", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onContextMenuPreparing: "onContextMenuPreparing", onCustomCommand: "onCustomCommand", onDependencyDeleted: "onDependencyDeleted", onDependencyDeleting: "onDependencyDeleting", onDependencyInserted: "onDependencyInserted", onDependencyInserting: "onDependencyInserting", onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onResourceAssigned: "onResourceAssigned", onResourceAssigning: "onResourceAssigning", onResourceDeleted: "onResourceDeleted", onResourceDeleting: "onResourceDeleting", onResourceInserted: "onResourceInserted", onResourceInserting: "onResourceInserting", onResourceManagerDialogShowing: "onResourceManagerDialogShowing", onResourceUnassigned: "onResourceUnassigned", onResourceUnassigning: "onResourceUnassigning", onScaleCellPrepared: "onScaleCellPrepared", onSelectionChanged: "onSelectionChanged", onTaskClick: "onTaskClick", onTaskDblClick: "onTaskDblClick", onTaskDeleted: "onTaskDeleted", onTaskDeleting: "onTaskDeleting", onTaskEditDialogShowing: "onTaskEditDialogShowing", onTaskInserted: "onTaskInserted", onTaskInserting: "onTaskInserting", onTaskMoving: "onTaskMoving", onTaskUpdated: "onTaskUpdated", onTaskUpdating: "onTaskUpdating", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowSelectionChange: "allowSelectionChange", columnsChange: "columnsChange", contextMenuChange: "contextMenuChange", dependenciesChange: "dependenciesChange", disabledChange: "disabledChange", editingChange: "editingChange", elementAttrChange: "elementAttrChange", endDateRangeChange: "endDateRangeChange", filterRowChange: "filterRowChange", firstDayOfWeekChange: "firstDayOfWeekChange", focusStateEnabledChange: "focusStateEnabledChange", headerFilterChange: "headerFilterChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", resourceAssignmentsChange: "resourceAssignmentsChange", resourcesChange: "resourcesChange", rootValueChange: "rootValueChange", scaleTypeChange: "scaleTypeChange", scaleTypeRangeChange: "scaleTypeRangeChange", selectedRowKeyChange: "selectedRowKeyChange", showDependenciesChange: "showDependenciesChange", showResourcesChange: "showResourcesChange", showRowLinesChange: "showRowLinesChange", sortingChange: "sortingChange", startDateRangeChange: "startDateRangeChange", stripLinesChange: "stripLinesChange", tabIndexChange: "tabIndexChange", taskContentTemplateChange: "taskContentTemplateChange", taskListWidthChange: "taskListWidthChange", taskProgressTooltipContentTemplateChange: "taskProgressTooltipContentTemplateChange", tasksChange: "tasksChange", taskTimeTooltipContentTemplateChange: "taskTimeTooltipContentTemplateChange", taskTitlePositionChange: "taskTitlePositionChange", taskTooltipContentTemplateChange: "taskTooltipContentTemplateChange", toolbarChange: "toolbarChange", validationChange: "validationChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "columnsChildren", predicate: DxiColumnComponent }, { propertyName: "stripLinesChildren", predicate: DxiStripLineComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxGanttComponent", DxGanttComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGanttComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-gantt',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], allowSelection: [{
                            type: Input
                        }], columns: [{
                            type: Input
                        }], contextMenu: [{
                            type: Input
                        }], dependencies: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], editing: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], endDateRange: [{
                            type: Input
                        }], filterRow: [{
                            type: Input
                        }], firstDayOfWeek: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], headerFilter: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], resourceAssignments: [{
                            type: Input
                        }], resources: [{
                            type: Input
                        }], rootValue: [{
                            type: Input
                        }], scaleType: [{
                            type: Input
                        }], scaleTypeRange: [{
                            type: Input
                        }], selectedRowKey: [{
                            type: Input
                        }], showDependencies: [{
                            type: Input
                        }], showResources: [{
                            type: Input
                        }], showRowLines: [{
                            type: Input
                        }], sorting: [{
                            type: Input
                        }], startDateRange: [{
                            type: Input
                        }], stripLines: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], taskContentTemplate: [{
                            type: Input
                        }], taskListWidth: [{
                            type: Input
                        }], taskProgressTooltipContentTemplate: [{
                            type: Input
                        }], tasks: [{
                            type: Input
                        }], taskTimeTooltipContentTemplate: [{
                            type: Input
                        }], taskTitlePosition: [{
                            type: Input
                        }], taskTooltipContentTemplate: [{
                            type: Input
                        }], toolbar: [{
                            type: Input
                        }], validation: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onContextMenuPreparing: [{
                            type: Output
                        }], onCustomCommand: [{
                            type: Output
                        }], onDependencyDeleted: [{
                            type: Output
                        }], onDependencyDeleting: [{
                            type: Output
                        }], onDependencyInserted: [{
                            type: Output
                        }], onDependencyInserting: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onResourceAssigned: [{
                            type: Output
                        }], onResourceAssigning: [{
                            type: Output
                        }], onResourceDeleted: [{
                            type: Output
                        }], onResourceDeleting: [{
                            type: Output
                        }], onResourceInserted: [{
                            type: Output
                        }], onResourceInserting: [{
                            type: Output
                        }], onResourceManagerDialogShowing: [{
                            type: Output
                        }], onResourceUnassigned: [{
                            type: Output
                        }], onResourceUnassigning: [{
                            type: Output
                        }], onScaleCellPrepared: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], onTaskClick: [{
                            type: Output
                        }], onTaskDblClick: [{
                            type: Output
                        }], onTaskDeleted: [{
                            type: Output
                        }], onTaskDeleting: [{
                            type: Output
                        }], onTaskEditDialogShowing: [{
                            type: Output
                        }], onTaskInserted: [{
                            type: Output
                        }], onTaskInserting: [{
                            type: Output
                        }], onTaskMoving: [{
                            type: Output
                        }], onTaskUpdated: [{
                            type: Output
                        }], onTaskUpdating: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowSelectionChange: [{
                            type: Output
                        }], columnsChange: [{
                            type: Output
                        }], contextMenuChange: [{
                            type: Output
                        }], dependenciesChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], editingChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], endDateRangeChange: [{
                            type: Output
                        }], filterRowChange: [{
                            type: Output
                        }], firstDayOfWeekChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], headerFilterChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], resourceAssignmentsChange: [{
                            type: Output
                        }], resourcesChange: [{
                            type: Output
                        }], rootValueChange: [{
                            type: Output
                        }], scaleTypeChange: [{
                            type: Output
                        }], scaleTypeRangeChange: [{
                            type: Output
                        }], selectedRowKeyChange: [{
                            type: Output
                        }], showDependenciesChange: [{
                            type: Output
                        }], showResourcesChange: [{
                            type: Output
                        }], showRowLinesChange: [{
                            type: Output
                        }], sortingChange: [{
                            type: Output
                        }], startDateRangeChange: [{
                            type: Output
                        }], stripLinesChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], taskContentTemplateChange: [{
                            type: Output
                        }], taskListWidthChange: [{
                            type: Output
                        }], taskProgressTooltipContentTemplateChange: [{
                            type: Output
                        }], tasksChange: [{
                            type: Output
                        }], taskTimeTooltipContentTemplateChange: [{
                            type: Output
                        }], taskTitlePositionChange: [{
                            type: Output
                        }], taskTooltipContentTemplateChange: [{
                            type: Output
                        }], toolbarChange: [{
                            type: Output
                        }], validationChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], columnsChildren: [{
                            type: ContentChildren,
                            args: [DxiColumnComponent]
                        }], stripLinesChildren: [{
                            type: ContentChildren,
                            args: [DxiStripLineComponent]
                        }] } });
            class DxGanttModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGanttModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxGanttModule, declarations: [DxGanttComponent], imports: [DxiColumnModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoContextMenuModule,
                        DxiItemModule,
                        DxoDependenciesModule,
                        DxoEditingModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoTextsModule,
                        DxoResourceAssignmentsModule,
                        DxoResourcesModule,
                        DxoScaleTypeRangeModule,
                        DxoSortingModule,
                        DxiStripLineModule,
                        DxoTasksModule,
                        DxoToolbarModule,
                        DxoValidationModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxGanttComponent, DxiColumnModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoContextMenuModule,
                        DxiItemModule,
                        DxoDependenciesModule,
                        DxoEditingModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoTextsModule,
                        DxoResourceAssignmentsModule,
                        DxoResourcesModule,
                        DxoScaleTypeRangeModule,
                        DxoSortingModule,
                        DxiStripLineModule,
                        DxoTasksModule,
                        DxoToolbarModule,
                        DxoValidationModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGanttModule, imports: [DxiColumnModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoContextMenuModule,
                        DxiItemModule,
                        DxoDependenciesModule,
                        DxoEditingModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoTextsModule,
                        DxoResourceAssignmentsModule,
                        DxoResourcesModule,
                        DxoScaleTypeRangeModule,
                        DxoSortingModule,
                        DxiStripLineModule,
                        DxoTasksModule,
                        DxoToolbarModule,
                        DxoValidationModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiColumnModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoContextMenuModule,
                        DxiItemModule,
                        DxoDependenciesModule,
                        DxoEditingModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoTextsModule,
                        DxoResourceAssignmentsModule,
                        DxoResourcesModule,
                        DxoScaleTypeRangeModule,
                        DxoSortingModule,
                        DxiStripLineModule,
                        DxoTasksModule,
                        DxoToolbarModule,
                        DxoValidationModule,
                        DxTemplateModule] });
            } exports("DxGanttModule", DxGanttModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGanttModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiColumnModule,
                                    DxoFormatModule,
                                    DxoHeaderFilterModule,
                                    DxoSearchModule,
                                    DxoContextMenuModule,
                                    DxiItemModule,
                                    DxoDependenciesModule,
                                    DxoEditingModule,
                                    DxoFilterRowModule,
                                    DxoOperationDescriptionsModule,
                                    DxoTextsModule,
                                    DxoResourceAssignmentsModule,
                                    DxoResourcesModule,
                                    DxoScaleTypeRangeModule,
                                    DxoSortingModule,
                                    DxiStripLineModule,
                                    DxoTasksModule,
                                    DxoToolbarModule,
                                    DxoValidationModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxGanttComponent
                                ],
                                exports: [
                                    DxGanttComponent,
                                    DxiColumnModule,
                                    DxoFormatModule,
                                    DxoHeaderFilterModule,
                                    DxoSearchModule,
                                    DxoContextMenuModule,
                                    DxiItemModule,
                                    DxoDependenciesModule,
                                    DxoEditingModule,
                                    DxoFilterRowModule,
                                    DxoOperationDescriptionsModule,
                                    DxoTextsModule,
                                    DxoResourceAssignmentsModule,
                                    DxoResourcesModule,
                                    DxoScaleTypeRangeModule,
                                    DxoSortingModule,
                                    DxiStripLineModule,
                                    DxoTasksModule,
                                    DxoToolbarModule,
                                    DxoValidationModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
