/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import DataSource from 'devextreme/data/data_source';
import { dxGanttColumn, dxGanttContextMenu, dxGanttFilterRow, dxGanttHeaderFilter, ContentReadyEvent, ContextMenuPreparingEvent, CustomCommandEvent, DependencyDeletedEvent, DependencyDeletingEvent, DependencyInsertedEvent, DependencyInsertingEvent, DisposingEvent, InitializedEvent, OptionChangedEvent, ResourceAssignedEvent, ResourceAssigningEvent, ResourceDeletedEvent, ResourceDeletingEvent, ResourceInsertedEvent, ResourceInsertingEvent, ResourceManagerDialogShowingEvent, ResourceUnassignedEvent, ResourceUnassigningEvent, ScaleCellPreparedEvent, SelectionChangedEvent, TaskClickEvent, TaskDblClickEvent, TaskDeletedEvent, TaskDeletingEvent, TaskEditDialogShowingEvent, TaskInsertedEvent, TaskInsertingEvent, TaskMovingEvent, TaskUpdatedEvent, TaskUpdatingEvent, GanttScaleType, dxGanttSorting, dxGanttStripLine, GanttTaskTitlePosition, dxGanttToolbar } from 'devextreme/ui/gantt';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { FirstDayOfWeek } from 'devextreme/common';

import DxGantt from 'devextreme/ui/gantt';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoHeaderFilterModule } from 'devextreme-angular/ui/nested';
import { DxoSearchModule } from 'devextreme-angular/ui/nested';
import { DxoContextMenuModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoDependenciesModule } from 'devextreme-angular/ui/nested';
import { DxoEditingModule } from 'devextreme-angular/ui/nested';
import { DxoFilterRowModule } from 'devextreme-angular/ui/nested';
import { DxoOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoTextsModule } from 'devextreme-angular/ui/nested';
import { DxoResourceAssignmentsModule } from 'devextreme-angular/ui/nested';
import { DxoResourcesModule } from 'devextreme-angular/ui/nested';
import { DxoScaleTypeRangeModule } from 'devextreme-angular/ui/nested';
import { DxoSortingModule } from 'devextreme-angular/ui/nested';
import { DxiStripLineModule } from 'devextreme-angular/ui/nested';
import { DxoTasksModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { DxoValidationModule } from 'devextreme-angular/ui/nested';

import { DxiGanttColumnModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttColumnHeaderFilterModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttColumnHeaderFilterSearchModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttContextMenuModule } from 'devextreme-angular/ui/gantt/nested';
import { DxiGanttContextMenuItemModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttDependenciesModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttEditingModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttFilterRowModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttFormatModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttGanttHeaderFilterModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttGanttHeaderFilterSearchModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttHeaderFilterModule } from 'devextreme-angular/ui/gantt/nested';
import { DxiGanttItemModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttOperationDescriptionsModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttResourceAssignmentsModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttResourcesModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttScaleTypeRangeModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttSearchModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttSortingModule } from 'devextreme-angular/ui/gantt/nested';
import { DxiGanttStripLineModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttTasksModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttTextsModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttToolbarModule } from 'devextreme-angular/ui/gantt/nested';
import { DxiGanttToolbarItemModule } from 'devextreme-angular/ui/gantt/nested';
import { DxoGanttValidationModule } from 'devextreme-angular/ui/gantt/nested';

import { DxiColumnComponent } from 'devextreme-angular/ui/nested';
import { DxiStripLineComponent } from 'devextreme-angular/ui/nested';

import { DxiGanttColumnComponent } from 'devextreme-angular/ui/gantt/nested';
import { DxiGanttStripLineComponent } from 'devextreme-angular/ui/gantt/nested';


/**
 * [descr:dxGantt]

 */
@Component({
    selector: 'dx-gantt',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxGanttComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxGantt = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxGanttOptions.allowSelection]
    
     */
    @Input()
    get allowSelection(): boolean {
        return this._getOption('allowSelection');
    }
    set allowSelection(value: boolean) {
        this._setOption('allowSelection', value);
    }


    /**
     * [descr:dxGanttOptions.columns]
    
     */
    @Input()
    get columns(): Array<dxGanttColumn | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<dxGanttColumn | string>) {
        this._setOption('columns', value);
    }


    /**
     * [descr:dxGanttOptions.contextMenu]
    
     */
    @Input()
    get contextMenu(): dxGanttContextMenu {
        return this._getOption('contextMenu');
    }
    set contextMenu(value: dxGanttContextMenu) {
        this._setOption('contextMenu', value);
    }


    /**
     * [descr:dxGanttOptions.dependencies]
    
     */
    @Input()
    get dependencies(): { dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, predecessorIdExpr?: Function | string, successorIdExpr?: Function | string, typeExpr?: Function | string } {
        return this._getOption('dependencies');
    }
    set dependencies(value: { dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, predecessorIdExpr?: Function | string, successorIdExpr?: Function | string, typeExpr?: Function | string }) {
        this._setOption('dependencies', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:dxGanttOptions.editing]
    
     */
    @Input()
    get editing(): { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskResourceUpdating?: boolean, allowTaskUpdating?: boolean, enabled?: boolean } {
        return this._getOption('editing');
    }
    set editing(value: { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskResourceUpdating?: boolean, allowTaskUpdating?: boolean, enabled?: boolean }) {
        this._setOption('editing', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxGanttOptions.endDateRange]
    
     */
    @Input()
    get endDateRange(): Date {
        return this._getOption('endDateRange');
    }
    set endDateRange(value: Date) {
        this._setOption('endDateRange', value);
    }


    /**
     * [descr:dxGanttOptions.filterRow]
    
     */
    @Input()
    get filterRow(): dxGanttFilterRow {
        return this._getOption('filterRow');
    }
    set filterRow(value: dxGanttFilterRow) {
        this._setOption('filterRow', value);
    }


    /**
     * [descr:dxGanttOptions.firstDayOfWeek]
    
     */
    @Input()
    get firstDayOfWeek(): FirstDayOfWeek | undefined {
        return this._getOption('firstDayOfWeek');
    }
    set firstDayOfWeek(value: FirstDayOfWeek | undefined) {
        this._setOption('firstDayOfWeek', value);
    }


    /**
     * [descr:WidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxGanttOptions.headerFilter]
    
     */
    @Input()
    get headerFilter(): dxGanttHeaderFilter {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: dxGanttHeaderFilter) {
        this._setOption('headerFilter', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    /**
     * [descr:WidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxGanttOptions.resourceAssignments]
    
     */
    @Input()
    get resourceAssignments(): { dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, resourceIdExpr?: Function | string, taskIdExpr?: Function | string } {
        return this._getOption('resourceAssignments');
    }
    set resourceAssignments(value: { dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, resourceIdExpr?: Function | string, taskIdExpr?: Function | string }) {
        this._setOption('resourceAssignments', value);
    }


    /**
     * [descr:dxGanttOptions.resources]
    
     */
    @Input()
    get resources(): { colorExpr?: Function | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, textExpr?: Function | string } {
        return this._getOption('resources');
    }
    set resources(value: { colorExpr?: Function | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, textExpr?: Function | string }) {
        this._setOption('resources', value);
    }


    /**
     * [descr:dxGanttOptions.rootValue]
    
     */
    @Input()
    get rootValue(): any {
        return this._getOption('rootValue');
    }
    set rootValue(value: any) {
        this._setOption('rootValue', value);
    }


    /**
     * [descr:dxGanttOptions.scaleType]
    
     */
    @Input()
    get scaleType(): GanttScaleType {
        return this._getOption('scaleType');
    }
    set scaleType(value: GanttScaleType) {
        this._setOption('scaleType', value);
    }


    /**
     * [descr:dxGanttOptions.scaleTypeRange]
    
     */
    @Input()
    get scaleTypeRange(): { max?: GanttScaleType, min?: GanttScaleType } {
        return this._getOption('scaleTypeRange');
    }
    set scaleTypeRange(value: { max?: GanttScaleType, min?: GanttScaleType }) {
        this._setOption('scaleTypeRange', value);
    }


    /**
     * [descr:dxGanttOptions.selectedRowKey]
    
     */
    @Input()
    get selectedRowKey(): any | undefined {
        return this._getOption('selectedRowKey');
    }
    set selectedRowKey(value: any | undefined) {
        this._setOption('selectedRowKey', value);
    }


    /**
     * [descr:dxGanttOptions.showDependencies]
    
     */
    @Input()
    get showDependencies(): boolean {
        return this._getOption('showDependencies');
    }
    set showDependencies(value: boolean) {
        this._setOption('showDependencies', value);
    }


    /**
     * [descr:dxGanttOptions.showResources]
    
     */
    @Input()
    get showResources(): boolean {
        return this._getOption('showResources');
    }
    set showResources(value: boolean) {
        this._setOption('showResources', value);
    }


    /**
     * [descr:dxGanttOptions.showRowLines]
    
     */
    @Input()
    get showRowLines(): boolean {
        return this._getOption('showRowLines');
    }
    set showRowLines(value: boolean) {
        this._setOption('showRowLines', value);
    }


    /**
     * [descr:dxGanttOptions.sorting]
    
     */
    @Input()
    get sorting(): dxGanttSorting {
        return this._getOption('sorting');
    }
    set sorting(value: dxGanttSorting) {
        this._setOption('sorting', value);
    }


    /**
     * [descr:dxGanttOptions.startDateRange]
    
     */
    @Input()
    get startDateRange(): Date {
        return this._getOption('startDateRange');
    }
    set startDateRange(value: Date) {
        this._setOption('startDateRange', value);
    }


    /**
     * [descr:dxGanttOptions.stripLines]
    
     */
    @Input()
    get stripLines(): Array<dxGanttStripLine> {
        return this._getOption('stripLines');
    }
    set stripLines(value: Array<dxGanttStripLine>) {
        this._setOption('stripLines', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxGanttOptions.taskContentTemplate]
    
     */
    @Input()
    get taskContentTemplate(): any {
        return this._getOption('taskContentTemplate');
    }
    set taskContentTemplate(value: any) {
        this._setOption('taskContentTemplate', value);
    }


    /**
     * [descr:dxGanttOptions.taskListWidth]
    
     */
    @Input()
    get taskListWidth(): number {
        return this._getOption('taskListWidth');
    }
    set taskListWidth(value: number) {
        this._setOption('taskListWidth', value);
    }


    /**
     * [descr:dxGanttOptions.taskProgressTooltipContentTemplate]
    
     */
    @Input()
    get taskProgressTooltipContentTemplate(): any {
        return this._getOption('taskProgressTooltipContentTemplate');
    }
    set taskProgressTooltipContentTemplate(value: any) {
        this._setOption('taskProgressTooltipContentTemplate', value);
    }


    /**
     * [descr:dxGanttOptions.tasks]
    
     */
    @Input()
    get tasks(): { colorExpr?: Function | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, endExpr?: Function | string, keyExpr?: Function | string, parentIdExpr?: Function | string, progressExpr?: Function | string, startExpr?: Function | string, titleExpr?: Function | string } {
        return this._getOption('tasks');
    }
    set tasks(value: { colorExpr?: Function | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, endExpr?: Function | string, keyExpr?: Function | string, parentIdExpr?: Function | string, progressExpr?: Function | string, startExpr?: Function | string, titleExpr?: Function | string }) {
        this._setOption('tasks', value);
    }


    /**
     * [descr:dxGanttOptions.taskTimeTooltipContentTemplate]
    
     */
    @Input()
    get taskTimeTooltipContentTemplate(): any {
        return this._getOption('taskTimeTooltipContentTemplate');
    }
    set taskTimeTooltipContentTemplate(value: any) {
        this._setOption('taskTimeTooltipContentTemplate', value);
    }


    /**
     * [descr:dxGanttOptions.taskTitlePosition]
    
     */
    @Input()
    get taskTitlePosition(): GanttTaskTitlePosition {
        return this._getOption('taskTitlePosition');
    }
    set taskTitlePosition(value: GanttTaskTitlePosition) {
        this._setOption('taskTitlePosition', value);
    }


    /**
     * [descr:dxGanttOptions.taskTooltipContentTemplate]
    
     */
    @Input()
    get taskTooltipContentTemplate(): any {
        return this._getOption('taskTooltipContentTemplate');
    }
    set taskTooltipContentTemplate(value: any) {
        this._setOption('taskTooltipContentTemplate', value);
    }


    /**
     * [descr:dxGanttOptions.toolbar]
    
     */
    @Input()
    get toolbar(): dxGanttToolbar {
        return this._getOption('toolbar');
    }
    set toolbar(value: dxGanttToolbar) {
        this._setOption('toolbar', value);
    }


    /**
     * [descr:dxGanttOptions.validation]
    
     */
    @Input()
    get validation(): { autoUpdateParentTasks?: boolean, enablePredecessorGap?: boolean, validateDependencies?: boolean } {
        return this._getOption('validation');
    }
    set validation(value: { autoUpdateParentTasks?: boolean, enablePredecessorGap?: boolean, validateDependencies?: boolean }) {
        this._setOption('validation', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxGanttOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxGanttOptions.onContextMenuPreparing]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:dxGanttOptions.onCustomCommand]
    
    
     */
    @Output() onCustomCommand: EventEmitter<CustomCommandEvent>;

    /**
    
     * [descr:dxGanttOptions.onDependencyDeleted]
    
    
     */
    @Output() onDependencyDeleted: EventEmitter<DependencyDeletedEvent>;

    /**
    
     * [descr:dxGanttOptions.onDependencyDeleting]
    
    
     */
    @Output() onDependencyDeleting: EventEmitter<DependencyDeletingEvent>;

    /**
    
     * [descr:dxGanttOptions.onDependencyInserted]
    
    
     */
    @Output() onDependencyInserted: EventEmitter<DependencyInsertedEvent>;

    /**
    
     * [descr:dxGanttOptions.onDependencyInserting]
    
    
     */
    @Output() onDependencyInserting: EventEmitter<DependencyInsertingEvent>;

    /**
    
     * [descr:dxGanttOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxGanttOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxGanttOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceAssigned]
    
    
     */
    @Output() onResourceAssigned: EventEmitter<ResourceAssignedEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceAssigning]
    
    
     */
    @Output() onResourceAssigning: EventEmitter<ResourceAssigningEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceDeleted]
    
    
     */
    @Output() onResourceDeleted: EventEmitter<ResourceDeletedEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceDeleting]
    
    
     */
    @Output() onResourceDeleting: EventEmitter<ResourceDeletingEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceInserted]
    
    
     */
    @Output() onResourceInserted: EventEmitter<ResourceInsertedEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceInserting]
    
    
     */
    @Output() onResourceInserting: EventEmitter<ResourceInsertingEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceManagerDialogShowing]
    
    
     */
    @Output() onResourceManagerDialogShowing: EventEmitter<ResourceManagerDialogShowingEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceUnassigned]
    
    
     */
    @Output() onResourceUnassigned: EventEmitter<ResourceUnassignedEvent>;

    /**
    
     * [descr:dxGanttOptions.onResourceUnassigning]
    
    
     */
    @Output() onResourceUnassigning: EventEmitter<ResourceUnassigningEvent>;

    /**
    
     * [descr:dxGanttOptions.onScaleCellPrepared]
    
    
     */
    @Output() onScaleCellPrepared: EventEmitter<ScaleCellPreparedEvent>;

    /**
    
     * [descr:dxGanttOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskClick]
    
    
     */
    @Output() onTaskClick: EventEmitter<TaskClickEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskDblClick]
    
    
     */
    @Output() onTaskDblClick: EventEmitter<TaskDblClickEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskDeleted]
    
    
     */
    @Output() onTaskDeleted: EventEmitter<TaskDeletedEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskDeleting]
    
    
     */
    @Output() onTaskDeleting: EventEmitter<TaskDeletingEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskEditDialogShowing]
    
    
     */
    @Output() onTaskEditDialogShowing: EventEmitter<TaskEditDialogShowingEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskInserted]
    
    
     */
    @Output() onTaskInserted: EventEmitter<TaskInsertedEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskInserting]
    
    
     */
    @Output() onTaskInserting: EventEmitter<TaskInsertingEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskMoving]
    
    
     */
    @Output() onTaskMoving: EventEmitter<TaskMovingEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskUpdated]
    
    
     */
    @Output() onTaskUpdated: EventEmitter<TaskUpdatedEvent>;

    /**
    
     * [descr:dxGanttOptions.onTaskUpdating]
    
    
     */
    @Output() onTaskUpdating: EventEmitter<TaskUpdatingEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowSelectionChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnsChange: EventEmitter<Array<dxGanttColumn | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() contextMenuChange: EventEmitter<dxGanttContextMenu>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dependenciesChange: EventEmitter<{ dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, predecessorIdExpr?: Function | string, successorIdExpr?: Function | string, typeExpr?: Function | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editingChange: EventEmitter<{ allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskResourceUpdating?: boolean, allowTaskUpdating?: boolean, enabled?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateRangeChange: EventEmitter<Date>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterRowChange: EventEmitter<dxGanttFilterRow>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() firstDayOfWeekChange: EventEmitter<FirstDayOfWeek | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerFilterChange: EventEmitter<dxGanttHeaderFilter>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resourceAssignmentsChange: EventEmitter<{ dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, resourceIdExpr?: Function | string, taskIdExpr?: Function | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resourcesChange: EventEmitter<{ colorExpr?: Function | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, keyExpr?: Function | string, textExpr?: Function | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rootValueChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scaleTypeChange: EventEmitter<GanttScaleType>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scaleTypeRangeChange: EventEmitter<{ max?: GanttScaleType, min?: GanttScaleType }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedRowKeyChange: EventEmitter<any | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showDependenciesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showResourcesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showRowLinesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortingChange: EventEmitter<dxGanttSorting>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateRangeChange: EventEmitter<Date>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stripLinesChange: EventEmitter<Array<dxGanttStripLine>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() taskContentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() taskListWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() taskProgressTooltipContentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tasksChange: EventEmitter<{ colorExpr?: Function | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, endExpr?: Function | string, keyExpr?: Function | string, parentIdExpr?: Function | string, progressExpr?: Function | string, startExpr?: Function | string, titleExpr?: Function | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() taskTimeTooltipContentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() taskTitlePositionChange: EventEmitter<GanttTaskTitlePosition>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() taskTooltipContentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarChange: EventEmitter<dxGanttToolbar>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationChange: EventEmitter<{ autoUpdateParentTasks?: boolean, enablePredecessorGap?: boolean, validateDependencies?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;




    @ContentChildren(DxiGanttColumnComponent)
    get columnsChildren(): QueryList<DxiGanttColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this._setChildren('columns', value, 'DxiGanttColumnComponent');
    }

    @ContentChildren(DxiGanttStripLineComponent)
    get stripLinesChildren(): QueryList<DxiGanttStripLineComponent> {
        return this._getOption('stripLines');
    }
    set stripLinesChildren(value) {
        this._setChildren('stripLines', value, 'DxiGanttStripLineComponent');
    }


    @ContentChildren(DxiColumnComponent)
    get columnsLegacyChildren(): QueryList<DxiColumnComponent> {
        return this._getOption('columns');
    }
    set columnsLegacyChildren(value) {
        this._setChildren('columns', value, 'DxiColumnComponent');
    }

    @ContentChildren(DxiStripLineComponent)
    get stripLinesLegacyChildren(): QueryList<DxiStripLineComponent> {
        return this._getOption('stripLines');
    }
    set stripLinesLegacyChildren(value) {
        this._setChildren('stripLines', value, 'DxiStripLineComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

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

    protected _createInstance(element, options) {

        return new DxGantt(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('columns', changes);
        this.setupChanges('stripLines', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
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

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
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
    DxiGanttColumnModule,
    DxoGanttColumnHeaderFilterModule,
    DxoGanttColumnHeaderFilterSearchModule,
    DxoGanttContextMenuModule,
    DxiGanttContextMenuItemModule,
    DxoGanttDependenciesModule,
    DxoGanttEditingModule,
    DxoGanttFilterRowModule,
    DxoGanttFormatModule,
    DxoGanttGanttHeaderFilterModule,
    DxoGanttGanttHeaderFilterSearchModule,
    DxoGanttHeaderFilterModule,
    DxiGanttItemModule,
    DxoGanttOperationDescriptionsModule,
    DxoGanttResourceAssignmentsModule,
    DxoGanttResourcesModule,
    DxoGanttScaleTypeRangeModule,
    DxoGanttSearchModule,
    DxoGanttSortingModule,
    DxiGanttStripLineModule,
    DxoGanttTasksModule,
    DxoGanttTextsModule,
    DxoGanttToolbarModule,
    DxiGanttToolbarItemModule,
    DxoGanttValidationModule,
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
    DxiGanttColumnModule,
    DxoGanttColumnHeaderFilterModule,
    DxoGanttColumnHeaderFilterSearchModule,
    DxoGanttContextMenuModule,
    DxiGanttContextMenuItemModule,
    DxoGanttDependenciesModule,
    DxoGanttEditingModule,
    DxoGanttFilterRowModule,
    DxoGanttFormatModule,
    DxoGanttGanttHeaderFilterModule,
    DxoGanttGanttHeaderFilterSearchModule,
    DxoGanttHeaderFilterModule,
    DxiGanttItemModule,
    DxoGanttOperationDescriptionsModule,
    DxoGanttResourceAssignmentsModule,
    DxoGanttResourcesModule,
    DxoGanttScaleTypeRangeModule,
    DxoGanttSearchModule,
    DxoGanttSortingModule,
    DxiGanttStripLineModule,
    DxoGanttTasksModule,
    DxoGanttTextsModule,
    DxoGanttToolbarModule,
    DxiGanttToolbarItemModule,
    DxoGanttValidationModule,
    DxTemplateModule
  ]
})
export class DxGanttModule { }

import type * as DxGanttTypes from "devextreme/ui/gantt_types";
export { DxGanttTypes };


