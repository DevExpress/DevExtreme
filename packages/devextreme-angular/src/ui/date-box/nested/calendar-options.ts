/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter
} from '@angular/core';




import { DisabledDate, CalendarZoomLevel, DisposingEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent, CalendarSelectionMode, WeekNumberRule } from 'devextreme/ui/calendar';
import { FirstDayOfWeek, ValidationMessageMode, Position, ValidationStatus } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-date-box-calendar-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDateBoxCalendarOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    @Input()
    get cellTemplate(): any {
        return this._getOption('cellTemplate');
    }
    set cellTemplate(value: any) {
        this._setOption('cellTemplate', value);
    }

    @Input()
    get dateSerializationFormat(): string | undefined {
        return this._getOption('dateSerializationFormat');
    }
    set dateSerializationFormat(value: string | undefined) {
        this._setOption('dateSerializationFormat', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get disabledDates(): Array<Date> | ((data: DisabledDate) => boolean) {
        return this._getOption('disabledDates');
    }
    set disabledDates(value: Array<Date> | ((data: DisabledDate) => boolean)) {
        this._setOption('disabledDates', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }

    @Input()
    get firstDayOfWeek(): FirstDayOfWeek | undefined {
        return this._getOption('firstDayOfWeek');
    }
    set firstDayOfWeek(value: FirstDayOfWeek | undefined) {
        this._setOption('firstDayOfWeek', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    @Input()
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    @Input()
    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }

    @Input()
    get max(): Date | number | string {
        return this._getOption('max');
    }
    set max(value: Date | number | string) {
        this._setOption('max', value);
    }

    @Input()
    get maxZoomLevel(): CalendarZoomLevel {
        return this._getOption('maxZoomLevel');
    }
    set maxZoomLevel(value: CalendarZoomLevel) {
        this._setOption('maxZoomLevel', value);
    }

    @Input()
    get min(): Date | number | string {
        return this._getOption('min');
    }
    set min(value: Date | number | string) {
        this._setOption('min', value);
    }

    @Input()
    get minZoomLevel(): CalendarZoomLevel {
        return this._getOption('minZoomLevel');
    }
    set minZoomLevel(value: CalendarZoomLevel) {
        this._setOption('minZoomLevel', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get selectionMode(): CalendarSelectionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: CalendarSelectionMode) {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectWeekOnClick(): boolean {
        return this._getOption('selectWeekOnClick');
    }
    set selectWeekOnClick(value: boolean) {
        this._setOption('selectWeekOnClick', value);
    }

    @Input()
    get showTodayButton(): boolean {
        return this._getOption('showTodayButton');
    }
    set showTodayButton(value: boolean) {
        this._setOption('showTodayButton', value);
    }

    @Input()
    get showWeekNumbers(): boolean {
        return this._getOption('showWeekNumbers');
    }
    set showWeekNumbers(value: boolean) {
        this._setOption('showWeekNumbers', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }

    @Input()
    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }

    @Input()
    get validationMessageMode(): ValidationMessageMode {
        return this._getOption('validationMessageMode');
    }
    set validationMessageMode(value: ValidationMessageMode) {
        this._setOption('validationMessageMode', value);
    }

    @Input()
    get validationMessagePosition(): Position {
        return this._getOption('validationMessagePosition');
    }
    set validationMessagePosition(value: Position) {
        this._setOption('validationMessagePosition', value);
    }

    @Input()
    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }

    @Input()
    get value(): Array<Date | number | string> | Date | number | string {
        return this._getOption('value');
    }
    set value(value: Array<Date | number | string> | Date | number | string) {
        this._setOption('value', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get weekNumberRule(): WeekNumberRule {
        return this._getOption('weekNumberRule');
    }
    set weekNumberRule(value: WeekNumberRule) {
        this._setOption('weekNumberRule', value);
    }

    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }

    @Input()
    get zoomLevel(): CalendarZoomLevel {
        return this._getOption('zoomLevel');
    }
    set zoomLevel(value: CalendarZoomLevel) {
        this._setOption('zoomLevel', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<Date | number | string> | Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomLevelChange: EventEmitter<CalendarZoomLevel>;
    protected get _optionPath() {
        return 'calendarOptions';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'valueChange' },
            { emit: 'zoomLevelChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoDateBoxCalendarOptionsComponent
  ],
  exports: [
    DxoDateBoxCalendarOptionsComponent
  ],
})
export class DxoDateBoxCalendarOptionsModule { }
