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


import dxScheduler from 'devextreme/ui/scheduler';
import dxSortable from 'devextreme/ui/sortable';
import dxDraggable from 'devextreme/ui/draggable';
import DataSource from 'devextreme/data/data_source';
import { AllDayPanelMode, ViewType, dxSchedulerAppointment, CellAppointmentsLimit, AppointmentAddedEvent, AppointmentAddingEvent, AppointmentClickEvent, AppointmentContextMenuEvent, AppointmentDblClickEvent, AppointmentDeletedEvent, AppointmentDeletingEvent, AppointmentFormOpeningEvent, AppointmentRenderedEvent, AppointmentTooltipShowingEvent, AppointmentUpdatedEvent, AppointmentUpdatingEvent, CellClickEvent, CellContextMenuEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, OptionChangedEvent, RecurrenceEditMode, dxSchedulerScrolling } from 'devextreme/ui/scheduler';
import { event } from 'devextreme/events/events.types';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { FirstDayOfWeek, Orientation } from 'devextreme/common';

import DxScheduler from 'devextreme/ui/scheduler';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoAppointmentDraggingModule } from 'devextreme-angular/ui/nested';
import { DxoEditingModule } from 'devextreme-angular/ui/nested';
import { DxiResourceModule } from 'devextreme-angular/ui/nested';
import { DxoScrollingModule } from 'devextreme-angular/ui/nested';
import { DxiViewModule } from 'devextreme-angular/ui/nested';

import { DxoSchedulerAppointmentDraggingModule } from 'devextreme-angular/ui/scheduler/nested';
import { DxoSchedulerEditingModule } from 'devextreme-angular/ui/scheduler/nested';
import { DxiSchedulerResourceModule } from 'devextreme-angular/ui/scheduler/nested';
import { DxoSchedulerScrollingModule } from 'devextreme-angular/ui/scheduler/nested';
import { DxiSchedulerViewModule } from 'devextreme-angular/ui/scheduler/nested';

import { DxiResourceComponent } from 'devextreme-angular/ui/nested';
import { DxiViewComponent } from 'devextreme-angular/ui/nested';

import { DxiSchedulerResourceComponent } from 'devextreme-angular/ui/scheduler/nested';
import { DxiSchedulerViewComponent } from 'devextreme-angular/ui/scheduler/nested';


/**
 * [descr:dxScheduler]

 */
@Component({
    selector: 'dx-scheduler',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxSchedulerComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxScheduler = null;

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
     * [descr:dxSchedulerOptions.adaptivityEnabled]
    
     */
    @Input()
    get adaptivityEnabled(): boolean {
        return this._getOption('adaptivityEnabled');
    }
    set adaptivityEnabled(value: boolean) {
        this._setOption('adaptivityEnabled', value);
    }


    /**
     * [descr:dxSchedulerOptions.allDayExpr]
    
     */
    @Input()
    get allDayExpr(): string {
        return this._getOption('allDayExpr');
    }
    set allDayExpr(value: string) {
        this._setOption('allDayExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.allDayPanelMode]
    
     */
    @Input()
    get allDayPanelMode(): AllDayPanelMode {
        return this._getOption('allDayPanelMode');
    }
    set allDayPanelMode(value: AllDayPanelMode) {
        this._setOption('allDayPanelMode', value);
    }


    /**
     * [descr:dxSchedulerOptions.appointmentCollectorTemplate]
    
     */
    @Input()
    get appointmentCollectorTemplate(): any {
        return this._getOption('appointmentCollectorTemplate');
    }
    set appointmentCollectorTemplate(value: any) {
        this._setOption('appointmentCollectorTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.appointmentDragging]
    
     */
    @Input()
    get appointmentDragging(): { autoScroll?: boolean, data?: any | undefined, group?: string | undefined, onAdd?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void), onDragEnd?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void), onDragMove?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void), onDragStart?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void), onRemove?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void), scrollSensitivity?: number, scrollSpeed?: number } {
        return this._getOption('appointmentDragging');
    }
    set appointmentDragging(value: { autoScroll?: boolean, data?: any | undefined, group?: string | undefined, onAdd?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void), onDragEnd?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void), onDragMove?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void), onDragStart?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void), onRemove?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void), scrollSensitivity?: number, scrollSpeed?: number }) {
        this._setOption('appointmentDragging', value);
    }


    /**
     * [descr:dxSchedulerOptions.appointmentTemplate]
    
     */
    @Input()
    get appointmentTemplate(): any {
        return this._getOption('appointmentTemplate');
    }
    set appointmentTemplate(value: any) {
        this._setOption('appointmentTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.appointmentTooltipTemplate]
    
     */
    @Input()
    get appointmentTooltipTemplate(): any {
        return this._getOption('appointmentTooltipTemplate');
    }
    set appointmentTooltipTemplate(value: any) {
        this._setOption('appointmentTooltipTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.cellDuration]
    
     */
    @Input()
    get cellDuration(): number {
        return this._getOption('cellDuration');
    }
    set cellDuration(value: number) {
        this._setOption('cellDuration', value);
    }


    /**
     * [descr:dxSchedulerOptions.crossScrollingEnabled]
    
     */
    @Input()
    get crossScrollingEnabled(): boolean {
        return this._getOption('crossScrollingEnabled');
    }
    set crossScrollingEnabled(value: boolean) {
        this._setOption('crossScrollingEnabled', value);
    }


    /**
     * [descr:dxSchedulerOptions.currentDate]
    
     */
    @Input()
    get currentDate(): Date | number | string {
        return this._getOption('currentDate');
    }
    set currentDate(value: Date | number | string) {
        this._setOption('currentDate', value);
    }


    /**
     * [descr:dxSchedulerOptions.currentView]
    
     */
    @Input()
    get currentView(): string | ViewType {
        return this._getOption('currentView');
    }
    set currentView(value: string | ViewType) {
        this._setOption('currentView', value);
    }


    /**
     * [descr:dxSchedulerOptions.customizeDateNavigatorText]
    
     */
    @Input()
    get customizeDateNavigatorText(): ((info: { endDate: Date, startDate: Date, text: string }) => string) | undefined {
        return this._getOption('customizeDateNavigatorText');
    }
    set customizeDateNavigatorText(value: ((info: { endDate: Date, startDate: Date, text: string }) => string) | undefined) {
        this._setOption('customizeDateNavigatorText', value);
    }


    /**
     * [descr:dxSchedulerOptions.dataCellTemplate]
    
     */
    @Input()
    get dataCellTemplate(): any {
        return this._getOption('dataCellTemplate');
    }
    set dataCellTemplate(value: any) {
        this._setOption('dataCellTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<dxSchedulerAppointment> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<dxSchedulerAppointment> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxSchedulerOptions.dateCellTemplate]
    
     */
    @Input()
    get dateCellTemplate(): any {
        return this._getOption('dateCellTemplate');
    }
    set dateCellTemplate(value: any) {
        this._setOption('dateCellTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.dateSerializationFormat]
    
     */
    @Input()
    get dateSerializationFormat(): string | undefined {
        return this._getOption('dateSerializationFormat');
    }
    set dateSerializationFormat(value: string | undefined) {
        this._setOption('dateSerializationFormat', value);
    }


    /**
     * [descr:dxSchedulerOptions.descriptionExpr]
    
     */
    @Input()
    get descriptionExpr(): string {
        return this._getOption('descriptionExpr');
    }
    set descriptionExpr(value: string) {
        this._setOption('descriptionExpr', value);
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
     * [descr:dxSchedulerOptions.dropDownAppointmentTemplate]
    
     * @deprecated [depNote:dxSchedulerOptions.dropDownAppointmentTemplate]
    
     */
    @Input()
    get dropDownAppointmentTemplate(): any {
        return this._getOption('dropDownAppointmentTemplate');
    }
    set dropDownAppointmentTemplate(value: any) {
        this._setOption('dropDownAppointmentTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.editing]
    
     */
    @Input()
    get editing(): boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowResizing?: boolean, allowTimeZoneEditing?: boolean, allowUpdating?: boolean } {
        return this._getOption('editing');
    }
    set editing(value: boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowResizing?: boolean, allowTimeZoneEditing?: boolean, allowUpdating?: boolean }) {
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
     * [descr:dxSchedulerOptions.endDateExpr]
    
     */
    @Input()
    get endDateExpr(): string {
        return this._getOption('endDateExpr');
    }
    set endDateExpr(value: string) {
        this._setOption('endDateExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.endDateTimeZoneExpr]
    
     */
    @Input()
    get endDateTimeZoneExpr(): string {
        return this._getOption('endDateTimeZoneExpr');
    }
    set endDateTimeZoneExpr(value: string) {
        this._setOption('endDateTimeZoneExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.endDayHour]
    
     */
    @Input()
    get endDayHour(): number {
        return this._getOption('endDayHour');
    }
    set endDayHour(value: number) {
        this._setOption('endDayHour', value);
    }


    /**
     * [descr:dxSchedulerOptions.firstDayOfWeek]
    
     */
    @Input()
    get firstDayOfWeek(): FirstDayOfWeek | undefined {
        return this._getOption('firstDayOfWeek');
    }
    set firstDayOfWeek(value: FirstDayOfWeek | undefined) {
        this._setOption('firstDayOfWeek', value);
    }


    /**
     * [descr:dxSchedulerOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxSchedulerOptions.groupByDate]
    
     */
    @Input()
    get groupByDate(): boolean {
        return this._getOption('groupByDate');
    }
    set groupByDate(value: boolean) {
        this._setOption('groupByDate', value);
    }


    /**
     * [descr:dxSchedulerOptions.groups]
    
     */
    @Input()
    get groups(): Array<string> {
        return this._getOption('groups');
    }
    set groups(value: Array<string>) {
        this._setOption('groups', value);
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
     * [descr:dxSchedulerOptions.indicatorUpdateInterval]
    
     */
    @Input()
    get indicatorUpdateInterval(): number {
        return this._getOption('indicatorUpdateInterval');
    }
    set indicatorUpdateInterval(value: number) {
        this._setOption('indicatorUpdateInterval', value);
    }


    /**
     * [descr:dxSchedulerOptions.max]
    
     */
    @Input()
    get max(): Date | number | string | undefined {
        return this._getOption('max');
    }
    set max(value: Date | number | string | undefined) {
        this._setOption('max', value);
    }


    /**
     * [descr:dxSchedulerOptions.maxAppointmentsPerCell]
    
     */
    @Input()
    get maxAppointmentsPerCell(): CellAppointmentsLimit | number {
        return this._getOption('maxAppointmentsPerCell');
    }
    set maxAppointmentsPerCell(value: CellAppointmentsLimit | number) {
        this._setOption('maxAppointmentsPerCell', value);
    }


    /**
     * [descr:dxSchedulerOptions.min]
    
     */
    @Input()
    get min(): Date | number | string | undefined {
        return this._getOption('min');
    }
    set min(value: Date | number | string | undefined) {
        this._setOption('min', value);
    }


    /**
     * [descr:dxSchedulerOptions.noDataText]
    
     */
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }


    /**
     * [descr:dxSchedulerOptions.offset]
    
     */
    @Input()
    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
    }


    /**
     * [descr:dxSchedulerOptions.recurrenceEditMode]
    
     */
    @Input()
    get recurrenceEditMode(): RecurrenceEditMode {
        return this._getOption('recurrenceEditMode');
    }
    set recurrenceEditMode(value: RecurrenceEditMode) {
        this._setOption('recurrenceEditMode', value);
    }


    /**
     * [descr:dxSchedulerOptions.recurrenceExceptionExpr]
    
     */
    @Input()
    get recurrenceExceptionExpr(): string {
        return this._getOption('recurrenceExceptionExpr');
    }
    set recurrenceExceptionExpr(value: string) {
        this._setOption('recurrenceExceptionExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.recurrenceRuleExpr]
    
     */
    @Input()
    get recurrenceRuleExpr(): string {
        return this._getOption('recurrenceRuleExpr');
    }
    set recurrenceRuleExpr(value: string) {
        this._setOption('recurrenceRuleExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.remoteFiltering]
    
     */
    @Input()
    get remoteFiltering(): boolean {
        return this._getOption('remoteFiltering');
    }
    set remoteFiltering(value: boolean) {
        this._setOption('remoteFiltering', value);
    }


    /**
     * [descr:dxSchedulerOptions.resourceCellTemplate]
    
     */
    @Input()
    get resourceCellTemplate(): any {
        return this._getOption('resourceCellTemplate');
    }
    set resourceCellTemplate(value: any) {
        this._setOption('resourceCellTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.resources]
    
     */
    @Input()
    get resources(): { allowMultiple?: boolean, colorExpr?: string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, displayExpr?: ((resource: any) => string) | string, fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: Function | string }[] {
        return this._getOption('resources');
    }
    set resources(value: { allowMultiple?: boolean, colorExpr?: string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, displayExpr?: ((resource: any) => string) | string, fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: Function | string }[]) {
        this._setOption('resources', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxSchedulerOptions.scrolling]
    
     */
    @Input()
    get scrolling(): dxSchedulerScrolling {
        return this._getOption('scrolling');
    }
    set scrolling(value: dxSchedulerScrolling) {
        this._setOption('scrolling', value);
    }


    /**
     * [descr:dxSchedulerOptions.selectedCellData]
    
     */
    @Input()
    get selectedCellData(): Array<any> {
        return this._getOption('selectedCellData');
    }
    set selectedCellData(value: Array<any>) {
        this._setOption('selectedCellData', value);
    }


    /**
     * [descr:dxSchedulerOptions.shadeUntilCurrentTime]
    
     */
    @Input()
    get shadeUntilCurrentTime(): boolean {
        return this._getOption('shadeUntilCurrentTime');
    }
    set shadeUntilCurrentTime(value: boolean) {
        this._setOption('shadeUntilCurrentTime', value);
    }


    /**
     * [descr:dxSchedulerOptions.showAllDayPanel]
    
     */
    @Input()
    get showAllDayPanel(): boolean {
        return this._getOption('showAllDayPanel');
    }
    set showAllDayPanel(value: boolean) {
        this._setOption('showAllDayPanel', value);
    }


    /**
     * [descr:dxSchedulerOptions.showCurrentTimeIndicator]
    
     */
    @Input()
    get showCurrentTimeIndicator(): boolean {
        return this._getOption('showCurrentTimeIndicator');
    }
    set showCurrentTimeIndicator(value: boolean) {
        this._setOption('showCurrentTimeIndicator', value);
    }


    /**
     * [descr:dxSchedulerOptions.startDateExpr]
    
     */
    @Input()
    get startDateExpr(): string {
        return this._getOption('startDateExpr');
    }
    set startDateExpr(value: string) {
        this._setOption('startDateExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.startDateTimeZoneExpr]
    
     */
    @Input()
    get startDateTimeZoneExpr(): string {
        return this._getOption('startDateTimeZoneExpr');
    }
    set startDateTimeZoneExpr(value: string) {
        this._setOption('startDateTimeZoneExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.startDayHour]
    
     */
    @Input()
    get startDayHour(): number {
        return this._getOption('startDayHour');
    }
    set startDayHour(value: number) {
        this._setOption('startDayHour', value);
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
     * [descr:dxSchedulerOptions.textExpr]
    
     */
    @Input()
    get textExpr(): string {
        return this._getOption('textExpr');
    }
    set textExpr(value: string) {
        this._setOption('textExpr', value);
    }


    /**
     * [descr:dxSchedulerOptions.timeCellTemplate]
    
     */
    @Input()
    get timeCellTemplate(): any {
        return this._getOption('timeCellTemplate');
    }
    set timeCellTemplate(value: any) {
        this._setOption('timeCellTemplate', value);
    }


    /**
     * [descr:dxSchedulerOptions.timeZone]
    
     */
    @Input()
    get timeZone(): string {
        return this._getOption('timeZone');
    }
    set timeZone(value: string) {
        this._setOption('timeZone', value);
    }


    /**
     * [descr:dxSchedulerOptions.useDropDownViewSwitcher]
    
     */
    @Input()
    get useDropDownViewSwitcher(): boolean {
        return this._getOption('useDropDownViewSwitcher');
    }
    set useDropDownViewSwitcher(value: boolean) {
        this._setOption('useDropDownViewSwitcher', value);
    }


    /**
     * [descr:dxSchedulerOptions.views]
    
     */
    @Input()
    get views(): Array<Record<string, any> | string> | { agendaDuration?: number, allDayPanelMode?: AllDayPanelMode, appointmentCollectorTemplate?: any, appointmentTemplate?: any, appointmentTooltipTemplate?: any, cellDuration?: number, dataCellTemplate?: any, dateCellTemplate?: any, dropDownAppointmentTemplate?: any, endDayHour?: number, firstDayOfWeek?: FirstDayOfWeek | undefined, groupByDate?: boolean, groupOrientation?: Orientation, groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: CellAppointmentsLimit | number, name?: string | undefined, offset?: number, resourceCellTemplate?: any, scrolling?: dxSchedulerScrolling, startDate?: Date | number | string | undefined, startDayHour?: number, timeCellTemplate?: any, type?: undefined | ViewType }[] {
        return this._getOption('views');
    }
    set views(value: Array<Record<string, any> | string> | { agendaDuration?: number, allDayPanelMode?: AllDayPanelMode, appointmentCollectorTemplate?: any, appointmentTemplate?: any, appointmentTooltipTemplate?: any, cellDuration?: number, dataCellTemplate?: any, dateCellTemplate?: any, dropDownAppointmentTemplate?: any, endDayHour?: number, firstDayOfWeek?: FirstDayOfWeek | undefined, groupByDate?: boolean, groupOrientation?: Orientation, groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: CellAppointmentsLimit | number, name?: string | undefined, offset?: number, resourceCellTemplate?: any, scrolling?: dxSchedulerScrolling, startDate?: Date | number | string | undefined, startDayHour?: number, timeCellTemplate?: any, type?: undefined | ViewType }[]) {
        this._setOption('views', value);
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
    
     * [descr:dxSchedulerOptions.onAppointmentAdded]
    
    
     */
    @Output() onAppointmentAdded: EventEmitter<AppointmentAddedEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentAdding]
    
    
     */
    @Output() onAppointmentAdding: EventEmitter<AppointmentAddingEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentClick]
    
    
     */
    @Output() onAppointmentClick: EventEmitter<AppointmentClickEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentContextMenu]
    
    
     */
    @Output() onAppointmentContextMenu: EventEmitter<AppointmentContextMenuEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentDblClick]
    
    
     */
    @Output() onAppointmentDblClick: EventEmitter<AppointmentDblClickEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentDeleted]
    
    
     */
    @Output() onAppointmentDeleted: EventEmitter<AppointmentDeletedEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentDeleting]
    
    
     */
    @Output() onAppointmentDeleting: EventEmitter<AppointmentDeletingEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentFormOpening]
    
    
     */
    @Output() onAppointmentFormOpening: EventEmitter<AppointmentFormOpeningEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentRendered]
    
    
     */
    @Output() onAppointmentRendered: EventEmitter<AppointmentRenderedEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentTooltipShowing]
    
    
     */
    @Output() onAppointmentTooltipShowing: EventEmitter<AppointmentTooltipShowingEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentUpdated]
    
    
     */
    @Output() onAppointmentUpdated: EventEmitter<AppointmentUpdatedEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onAppointmentUpdating]
    
    
     */
    @Output() onAppointmentUpdating: EventEmitter<AppointmentUpdatingEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onCellClick]
    
    
     */
    @Output() onCellClick: EventEmitter<CellClickEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onCellContextMenu]
    
    
     */
    @Output() onCellContextMenu: EventEmitter<CellContextMenuEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxSchedulerOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adaptivityEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allDayExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allDayPanelModeChange: EventEmitter<AllDayPanelMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() appointmentCollectorTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() appointmentDraggingChange: EventEmitter<{ autoScroll?: boolean, data?: any | undefined, group?: string | undefined, onAdd?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void), onDragEnd?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void), onDragMove?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void), onDragStart?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void), onRemove?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void), scrollSensitivity?: number, scrollSpeed?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() appointmentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() appointmentTooltipTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cellDurationChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() crossScrollingEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() currentDateChange: EventEmitter<Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() currentViewChange: EventEmitter<string | ViewType>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeDateNavigatorTextChange: EventEmitter<((info: { endDate: Date, startDate: Date, text: string }) => string) | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataCellTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<dxSchedulerAppointment> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dateCellTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dateSerializationFormatChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() descriptionExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownAppointmentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editingChange: EventEmitter<boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowResizing?: boolean, allowTimeZoneEditing?: boolean, allowUpdating?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateTimeZoneExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDayHourChange: EventEmitter<number>;

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
    @Output() groupByDateChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupsChange: EventEmitter<Array<string>>;

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
    @Output() indicatorUpdateIntervalChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxChange: EventEmitter<Date | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxAppointmentsPerCellChange: EventEmitter<CellAppointmentsLimit | number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minChange: EventEmitter<Date | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() offsetChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() recurrenceEditModeChange: EventEmitter<RecurrenceEditMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() recurrenceExceptionExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() recurrenceRuleExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() remoteFilteringChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resourceCellTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resourcesChange: EventEmitter<{ allowMultiple?: boolean, colorExpr?: string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, displayExpr?: ((resource: any) => string) | string, fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: Function | string }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingChange: EventEmitter<dxSchedulerScrolling>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedCellDataChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() shadeUntilCurrentTimeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showAllDayPanelChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showCurrentTimeIndicatorChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateTimeZoneExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDayHourChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() timeCellTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() timeZoneChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useDropDownViewSwitcherChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() viewsChange: EventEmitter<Array<Record<string, any> | string> | { agendaDuration?: number, allDayPanelMode?: AllDayPanelMode, appointmentCollectorTemplate?: any, appointmentTemplate?: any, appointmentTooltipTemplate?: any, cellDuration?: number, dataCellTemplate?: any, dateCellTemplate?: any, dropDownAppointmentTemplate?: any, endDayHour?: number, firstDayOfWeek?: FirstDayOfWeek | undefined, groupByDate?: boolean, groupOrientation?: Orientation, groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: CellAppointmentsLimit | number, name?: string | undefined, offset?: number, resourceCellTemplate?: any, scrolling?: dxSchedulerScrolling, startDate?: Date | number | string | undefined, startDayHour?: number, timeCellTemplate?: any, type?: undefined | ViewType }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;




    @ContentChildren(DxiSchedulerResourceComponent)
    get resourcesChildren(): QueryList<DxiSchedulerResourceComponent> {
        return this._getOption('resources');
    }
    set resourcesChildren(value) {
        this._setChildren('resources', value, 'DxiSchedulerResourceComponent');
    }

    @ContentChildren(DxiSchedulerViewComponent)
    get viewsChildren(): QueryList<DxiSchedulerViewComponent> {
        return this._getOption('views');
    }
    set viewsChildren(value) {
        this._setChildren('views', value, 'DxiSchedulerViewComponent');
    }


    @ContentChildren(DxiResourceComponent)
    get resourcesLegacyChildren(): QueryList<DxiResourceComponent> {
        return this._getOption('resources');
    }
    set resourcesLegacyChildren(value) {
        this._setChildren('resources', value, 'DxiResourceComponent');
    }

    @ContentChildren(DxiViewComponent)
    get viewsLegacyChildren(): QueryList<DxiViewComponent> {
        return this._getOption('views');
    }
    set viewsLegacyChildren(value) {
        this._setChildren('views', value, 'DxiViewComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'appointmentAdded', emit: 'onAppointmentAdded' },
            { subscribe: 'appointmentAdding', emit: 'onAppointmentAdding' },
            { subscribe: 'appointmentClick', emit: 'onAppointmentClick' },
            { subscribe: 'appointmentContextMenu', emit: 'onAppointmentContextMenu' },
            { subscribe: 'appointmentDblClick', emit: 'onAppointmentDblClick' },
            { subscribe: 'appointmentDeleted', emit: 'onAppointmentDeleted' },
            { subscribe: 'appointmentDeleting', emit: 'onAppointmentDeleting' },
            { subscribe: 'appointmentFormOpening', emit: 'onAppointmentFormOpening' },
            { subscribe: 'appointmentRendered', emit: 'onAppointmentRendered' },
            { subscribe: 'appointmentTooltipShowing', emit: 'onAppointmentTooltipShowing' },
            { subscribe: 'appointmentUpdated', emit: 'onAppointmentUpdated' },
            { subscribe: 'appointmentUpdating', emit: 'onAppointmentUpdating' },
            { subscribe: 'cellClick', emit: 'onCellClick' },
            { subscribe: 'cellContextMenu', emit: 'onCellContextMenu' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'adaptivityEnabledChange' },
            { emit: 'allDayExprChange' },
            { emit: 'allDayPanelModeChange' },
            { emit: 'appointmentCollectorTemplateChange' },
            { emit: 'appointmentDraggingChange' },
            { emit: 'appointmentTemplateChange' },
            { emit: 'appointmentTooltipTemplateChange' },
            { emit: 'cellDurationChange' },
            { emit: 'crossScrollingEnabledChange' },
            { emit: 'currentDateChange' },
            { emit: 'currentViewChange' },
            { emit: 'customizeDateNavigatorTextChange' },
            { emit: 'dataCellTemplateChange' },
            { emit: 'dataSourceChange' },
            { emit: 'dateCellTemplateChange' },
            { emit: 'dateSerializationFormatChange' },
            { emit: 'descriptionExprChange' },
            { emit: 'disabledChange' },
            { emit: 'dropDownAppointmentTemplateChange' },
            { emit: 'editingChange' },
            { emit: 'elementAttrChange' },
            { emit: 'endDateExprChange' },
            { emit: 'endDateTimeZoneExprChange' },
            { emit: 'endDayHourChange' },
            { emit: 'firstDayOfWeekChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'groupByDateChange' },
            { emit: 'groupsChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'indicatorUpdateIntervalChange' },
            { emit: 'maxChange' },
            { emit: 'maxAppointmentsPerCellChange' },
            { emit: 'minChange' },
            { emit: 'noDataTextChange' },
            { emit: 'offsetChange' },
            { emit: 'recurrenceEditModeChange' },
            { emit: 'recurrenceExceptionExprChange' },
            { emit: 'recurrenceRuleExprChange' },
            { emit: 'remoteFilteringChange' },
            { emit: 'resourceCellTemplateChange' },
            { emit: 'resourcesChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollingChange' },
            { emit: 'selectedCellDataChange' },
            { emit: 'shadeUntilCurrentTimeChange' },
            { emit: 'showAllDayPanelChange' },
            { emit: 'showCurrentTimeIndicatorChange' },
            { emit: 'startDateExprChange' },
            { emit: 'startDateTimeZoneExprChange' },
            { emit: 'startDayHourChange' },
            { emit: 'tabIndexChange' },
            { emit: 'textExprChange' },
            { emit: 'timeCellTemplateChange' },
            { emit: 'timeZoneChange' },
            { emit: 'useDropDownViewSwitcherChange' },
            { emit: 'viewsChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxScheduler(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('groups', changes);
        this.setupChanges('resources', changes);
        this.setupChanges('selectedCellData', changes);
        this.setupChanges('views', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
        this._idh.doCheck('groups');
        this._idh.doCheck('resources');
        this._idh.doCheck('selectedCellData');
        this._idh.doCheck('views');
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
    DxoAppointmentDraggingModule,
    DxoEditingModule,
    DxiResourceModule,
    DxoScrollingModule,
    DxiViewModule,
    DxoSchedulerAppointmentDraggingModule,
    DxoSchedulerEditingModule,
    DxiSchedulerResourceModule,
    DxoSchedulerScrollingModule,
    DxiSchedulerViewModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxSchedulerComponent
  ],
  exports: [
    DxSchedulerComponent,
    DxoAppointmentDraggingModule,
    DxoEditingModule,
    DxiResourceModule,
    DxoScrollingModule,
    DxiViewModule,
    DxoSchedulerAppointmentDraggingModule,
    DxoSchedulerEditingModule,
    DxiSchedulerResourceModule,
    DxoSchedulerScrollingModule,
    DxiSchedulerViewModule,
    DxTemplateModule
  ]
})
export class DxSchedulerModule { }

import type * as DxSchedulerTypes from "devextreme/ui/scheduler_types";
export { DxSchedulerTypes };


