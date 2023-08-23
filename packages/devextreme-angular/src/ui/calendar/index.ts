/* tslint:disable:max-line-length */


import { TransferState } from '@angular/platform-browser';

import {
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
    forwardRef,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';


import { DisposingEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent } from 'devextreme/ui/calendar';

import DxCalendar from 'devextreme/ui/calendar';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';






const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxCalendarComponent),
    multi: true
};
/**
 * [descr:dxCalendar]

 */
@Component({
    selector: 'dx-calendar',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxCalendarComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxCalendar;

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
     * [descr:dxCalendarOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxCalendarOptions.cellTemplate]
    
     */
    @Input()
    get cellTemplate(): any {
        return this._getOption('cellTemplate');
    }
    set cellTemplate(value: any) {
        this._setOption('cellTemplate', value);
    }


    /**
     * [descr:dxCalendarOptions.dateSerializationFormat]
    
     */
    @Input()
    get dateSerializationFormat(): string | undefined {
        return this._getOption('dateSerializationFormat');
    }
    set dateSerializationFormat(value: string | undefined) {
        this._setOption('dateSerializationFormat', value);
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
     * [descr:dxCalendarOptions.disabledDates]
    
     */
    @Input()
    get disabledDates(): Function | Array<Date> {
        return this._getOption('disabledDates');
    }
    set disabledDates(value: Function | Array<Date>) {
        this._setOption('disabledDates', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxCalendarOptions.firstDayOfWeek]
    
     */
    @Input()
    get firstDayOfWeek(): number | string | undefined {
        return this._getOption('firstDayOfWeek');
    }
    set firstDayOfWeek(value: number | string | undefined) {
        this._setOption('firstDayOfWeek', value);
    }


    /**
     * [descr:dxCalendarOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
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
     * [descr:dxCalendarOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:EditorOptions.isDirty]
    
     */
    @Input()
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }


    /**
     * [descr:EditorOptions.isValid]
    
     */
    @Input()
    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }


    /**
     * [descr:dxCalendarOptions.max]
    
     */
    @Input()
    get max(): Date | number | string {
        return this._getOption('max');
    }
    set max(value: Date | number | string) {
        this._setOption('max', value);
    }


    /**
     * [descr:dxCalendarOptions.maxZoomLevel]
    
     */
    @Input()
    get maxZoomLevel(): string {
        return this._getOption('maxZoomLevel');
    }
    set maxZoomLevel(value: string) {
        this._setOption('maxZoomLevel', value);
    }


    /**
     * [descr:dxCalendarOptions.min]
    
     */
    @Input()
    get min(): Date | number | string {
        return this._getOption('min');
    }
    set min(value: Date | number | string) {
        this._setOption('min', value);
    }


    /**
     * [descr:dxCalendarOptions.minZoomLevel]
    
     */
    @Input()
    get minZoomLevel(): string {
        return this._getOption('minZoomLevel');
    }
    set minZoomLevel(value: string) {
        this._setOption('minZoomLevel', value);
    }


    /**
     * [descr:dxCalendarOptions.name]
    
     */
    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    /**
     * [descr:EditorOptions.readOnly]
    
     */
    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
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
     * [descr:dxCalendarOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): string {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: string) {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:dxCalendarOptions.selectWeekOnClick]
    
     */
    @Input()
    get selectWeekOnClick(): boolean {
        return this._getOption('selectWeekOnClick');
    }
    set selectWeekOnClick(value: boolean) {
        this._setOption('selectWeekOnClick', value);
    }


    /**
     * [descr:dxCalendarOptions.showTodayButton]
    
     */
    @Input()
    get showTodayButton(): boolean {
        return this._getOption('showTodayButton');
    }
    set showTodayButton(value: boolean) {
        this._setOption('showTodayButton', value);
    }


    /**
     * [descr:dxCalendarOptions.showWeekNumbers]
    
     */
    @Input()
    get showWeekNumbers(): boolean {
        return this._getOption('showWeekNumbers');
    }
    set showWeekNumbers(value: boolean) {
        this._setOption('showWeekNumbers', value);
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
     * [descr:EditorOptions.validationError]
    
     */
    @Input()
    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }


    /**
     * [descr:EditorOptions.validationErrors]
    
     */
    @Input()
    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }


    /**
     * [descr:EditorOptions.validationMessageMode]
    
     */
    @Input()
    get validationMessageMode(): string {
        return this._getOption('validationMessageMode');
    }
    set validationMessageMode(value: string) {
        this._setOption('validationMessageMode', value);
    }


    /**
     * [descr:EditorOptions.validationMessagePosition]
    
     */
    @Input()
    get validationMessagePosition(): string {
        return this._getOption('validationMessagePosition');
    }
    set validationMessagePosition(value: string) {
        this._setOption('validationMessagePosition', value);
    }


    /**
     * [descr:EditorOptions.validationStatus]
    
     */
    @Input()
    get validationStatus(): string {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: string) {
        this._setOption('validationStatus', value);
    }


    /**
     * [descr:dxCalendarOptions.value]
    
     */
    @Input()
    get value(): Date | number | string {
        return this._getOption('value');
    }
    set value(value: Date | number | string) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxCalendarOptions.values]
    
     */
    @Input()
    get values(): Array<Date | number | string> {
        return this._getOption('values');
    }
    set values(value: Array<Date | number | string>) {
        this._setOption('values', value);
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
     * [descr:dxCalendarOptions.weekNumberRule]
    
     */
    @Input()
    get weekNumberRule(): string {
        return this._getOption('weekNumberRule');
    }
    set weekNumberRule(value: string) {
        this._setOption('weekNumberRule', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxCalendarOptions.zoomLevel]
    
     */
    @Input()
    get zoomLevel(): string {
        return this._getOption('zoomLevel');
    }
    set zoomLevel(value: string) {
        this._setOption('zoomLevel', value);
    }

    /**
    
     * [descr:dxCalendarOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxCalendarOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxCalendarOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxCalendarOptions.onValueChanged]
    
    
     */
    @Output() onValueChanged: EventEmitter<ValueChangedEvent>;

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
    @Output() cellTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dateSerializationFormatChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledDatesChange: EventEmitter<Function | Array<Date>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() firstDayOfWeekChange: EventEmitter<number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string | undefined>;

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
    @Output() isDirtyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() isValidChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxChange: EventEmitter<Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxZoomLevelChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minChange: EventEmitter<Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minZoomLevelChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() readOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectWeekOnClickChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showTodayButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showWeekNumbersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationErrorChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationErrorsChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationMessageModeChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationMessagePositionChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationStatusChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valuesChange: EventEmitter<Array<Date | number | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() weekNumberRuleChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomLevelChange: EventEmitter<string>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};





    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'cellTemplateChange' },
            { emit: 'dateSerializationFormatChange' },
            { emit: 'disabledChange' },
            { emit: 'disabledDatesChange' },
            { emit: 'elementAttrChange' },
            { emit: 'firstDayOfWeekChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'isDirtyChange' },
            { emit: 'isValidChange' },
            { emit: 'maxChange' },
            { emit: 'maxZoomLevelChange' },
            { emit: 'minChange' },
            { emit: 'minZoomLevelChange' },
            { emit: 'nameChange' },
            { emit: 'readOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'selectionModeChange' },
            { emit: 'selectWeekOnClickChange' },
            { emit: 'showTodayButtonChange' },
            { emit: 'showWeekNumbersChange' },
            { emit: 'tabIndexChange' },
            { emit: 'validationErrorChange' },
            { emit: 'validationErrorsChange' },
            { emit: 'validationMessageModeChange' },
            { emit: 'validationMessagePositionChange' },
            { emit: 'validationStatusChange' },
            { emit: 'valueChange' },
            { emit: 'valuesChange' },
            { emit: 'visibleChange' },
            { emit: 'weekNumberRuleChange' },
            { emit: 'widthChange' },
            { emit: 'zoomLevelChange' },
            { emit: 'onBlur' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxCalendar(element, options);
    }


    writeValue(value: any): void {
        this.eventHelper.lockedValueChangeEvent = true;
        this.value = value;
        this.eventHelper.lockedValueChangeEvent = false;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnChange(fn: (_: any) => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }

    _createWidget(element: any) {
        super._createWidget(element);
        this.instance.on('focusOut', (e) => {
            this.eventHelper.fireNgEvent('onBlur', [e]);
        });
    }

    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('disabledDates', changes);
        this.setupChanges('validationErrors', changes);
        this.setupChanges('values', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('disabledDates');
        this._idh.doCheck('validationErrors');
        this._idh.doCheck('values');
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
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxCalendarComponent
  ],
  exports: [
    DxCalendarComponent,
    DxTemplateModule
  ]
})
export class DxCalendarModule { }

import type * as DxCalendarTypes from "devextreme/ui/calendar_types";
export { DxCalendarTypes };


