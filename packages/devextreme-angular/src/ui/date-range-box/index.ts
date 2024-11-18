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
    forwardRef,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import { ApplyValueMode, TextEditorButton, LabelMode, EditorStyle, ValidationMessageMode, Mode, Position, ValidationStatus } from 'devextreme/common';
import { DropDownPredefinedButton } from 'devextreme/ui/drop_down_editor/ui.drop_down_editor';
import { dxCalendarOptions } from 'devextreme/ui/calendar';
import { Format } from 'devextreme/common/core/localization';
import { dxPopupOptions } from 'devextreme/ui/popup';
import { ChangeEvent, ClosedEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, OpenedEvent, OptionChangedEvent, PasteEvent, ValueChangedEvent } from 'devextreme/ui/date_range_box';

import DxDateRangeBox from 'devextreme/ui/date_range_box';

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

import { DxiButtonModule } from 'devextreme-angular/ui/nested';
import { DxoOptionsModule } from 'devextreme-angular/ui/nested';
import { DxoCalendarOptionsModule } from 'devextreme-angular/ui/nested';
import { DxoDisplayFormatModule } from 'devextreme-angular/ui/nested';
import { DxoDropDownOptionsModule } from 'devextreme-angular/ui/nested';
import { DxoAnimationModule } from 'devextreme-angular/ui/nested';
import { DxoHideModule } from 'devextreme-angular/ui/nested';
import { DxoFromModule } from 'devextreme-angular/ui/nested';
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import { DxoAtModule } from 'devextreme-angular/ui/nested';
import { DxoBoundaryOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoCollisionModule } from 'devextreme-angular/ui/nested';
import { DxoMyModule } from 'devextreme-angular/ui/nested';
import { DxoOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoToModule } from 'devextreme-angular/ui/nested';
import { DxoShowModule } from 'devextreme-angular/ui/nested';

import { DxoDateRangeBoxAnimationModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxAtModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxBoundaryOffsetModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxiDateRangeBoxButtonModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxCalendarOptionsModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxCollisionModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxDisplayFormatModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxDropDownOptionsModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxFromModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxHideModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxMyModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxOffsetModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxOptionsModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxPositionModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxShowModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxoDateRangeBoxToModule } from 'devextreme-angular/ui/date-range-box/nested';
import { DxiDateRangeBoxToolbarItemModule } from 'devextreme-angular/ui/date-range-box/nested';

import { DxiButtonComponent } from 'devextreme-angular/ui/nested';

import { DxiDateRangeBoxButtonComponent } from 'devextreme-angular/ui/date-range-box/nested';



const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxDateRangeBoxComponent),
    multi: true
};
/**
 * [descr:dxDateRangeBox]

 */
@Component({
    selector: 'dx-date-range-box',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxDateRangeBoxComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxDateRangeBox = null;

    /**
     * [descr:dxDropDownEditorOptions.acceptCustomValue]
    
     */
    @Input()
    get acceptCustomValue(): boolean {
        return this._getOption('acceptCustomValue');
    }
    set acceptCustomValue(value: boolean) {
        this._setOption('acceptCustomValue', value);
    }


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
     * [descr:dxDropDownEditorOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:DateBoxBaseOptions.applyButtonText]
    
     */
    @Input()
    get applyButtonText(): string {
        return this._getOption('applyButtonText');
    }
    set applyButtonText(value: string) {
        this._setOption('applyButtonText', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.applyValueMode]
    
     */
    @Input()
    get applyValueMode(): ApplyValueMode {
        return this._getOption('applyValueMode');
    }
    set applyValueMode(value: ApplyValueMode) {
        this._setOption('applyValueMode', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.buttons]
    
     */
    @Input()
    get buttons(): Array<DropDownPredefinedButton | TextEditorButton> {
        return this._getOption('buttons');
    }
    set buttons(value: Array<DropDownPredefinedButton | TextEditorButton>) {
        this._setOption('buttons', value);
    }


    /**
     * [descr:DateBoxBaseOptions.calendarOptions]
    
     */
    @Input()
    get calendarOptions(): dxCalendarOptions {
        return this._getOption('calendarOptions');
    }
    set calendarOptions(value: dxCalendarOptions) {
        this._setOption('calendarOptions', value);
    }


    /**
     * [descr:DateBoxBaseOptions.cancelButtonText]
    
     */
    @Input()
    get cancelButtonText(): string {
        return this._getOption('cancelButtonText');
    }
    set cancelButtonText(value: string) {
        this._setOption('cancelButtonText', value);
    }


    /**
     * [descr:DateBoxBaseOptions.dateSerializationFormat]
    
     */
    @Input()
    get dateSerializationFormat(): string | undefined {
        return this._getOption('dateSerializationFormat');
    }
    set dateSerializationFormat(value: string | undefined) {
        this._setOption('dateSerializationFormat', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.deferRendering]
    
     */
    @Input()
    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
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
     * [descr:dxDateRangeBoxOptions.disableOutOfRangeSelection]
    
     */
    @Input()
    get disableOutOfRangeSelection(): boolean {
        return this._getOption('disableOutOfRangeSelection');
    }
    set disableOutOfRangeSelection(value: boolean) {
        this._setOption('disableOutOfRangeSelection', value);
    }


    /**
     * [descr:DateBoxBaseOptions.displayFormat]
    
     */
    @Input()
    get displayFormat(): Format {
        return this._getOption('displayFormat');
    }
    set displayFormat(value: Format) {
        this._setOption('displayFormat', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.dropDownButtonTemplate]
    
     */
    @Input()
    get dropDownButtonTemplate(): any {
        return this._getOption('dropDownButtonTemplate');
    }
    set dropDownButtonTemplate(value: any) {
        this._setOption('dropDownButtonTemplate', value);
    }


    /**
     * [descr:DateBoxBaseOptions.dropDownOptions]
    
     */
    @Input()
    get dropDownOptions(): dxPopupOptions<any> {
        return this._getOption('dropDownOptions');
    }
    set dropDownOptions(value: dxPopupOptions<any>) {
        this._setOption('dropDownOptions', value);
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
     * [descr:dxDateRangeBoxOptions.endDate]
    
     */
    @Input()
    get endDate(): Date | number | string {
        return this._getOption('endDate');
    }
    set endDate(value: Date | number | string) {
        this._setOption('endDate', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.endDateInputAttr]
    
     */
    @Input()
    get endDateInputAttr(): any {
        return this._getOption('endDateInputAttr');
    }
    set endDateInputAttr(value: any) {
        this._setOption('endDateInputAttr', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.endDateLabel]
    
     */
    @Input()
    get endDateLabel(): string {
        return this._getOption('endDateLabel');
    }
    set endDateLabel(value: string) {
        this._setOption('endDateLabel', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.endDateName]
    
     */
    @Input()
    get endDateName(): string {
        return this._getOption('endDateName');
    }
    set endDateName(value: string) {
        this._setOption('endDateName', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.endDateOutOfRangeMessage]
    
     */
    @Input()
    get endDateOutOfRangeMessage(): string {
        return this._getOption('endDateOutOfRangeMessage');
    }
    set endDateOutOfRangeMessage(value: string) {
        this._setOption('endDateOutOfRangeMessage', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.endDatePlaceholder]
    
     */
    @Input()
    get endDatePlaceholder(): string {
        return this._getOption('endDatePlaceholder');
    }
    set endDatePlaceholder(value: string) {
        this._setOption('endDatePlaceholder', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.endDateText]
    
     */
    @Input()
    get endDateText(): string {
        return this._getOption('endDateText');
    }
    set endDateText(value: string) {
        this._setOption('endDateText', value);
    }


    /**
     * [descr:dxTextEditorOptions.focusStateEnabled]
    
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
     * [descr:dxTextEditorOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.invalidEndDateMessage]
    
     */
    @Input()
    get invalidEndDateMessage(): string {
        return this._getOption('invalidEndDateMessage');
    }
    set invalidEndDateMessage(value: string) {
        this._setOption('invalidEndDateMessage', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.invalidStartDateMessage]
    
     */
    @Input()
    get invalidStartDateMessage(): string {
        return this._getOption('invalidStartDateMessage');
    }
    set invalidStartDateMessage(value: string) {
        this._setOption('invalidStartDateMessage', value);
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
     * [descr:dxTextEditorOptions.labelMode]
    
     */
    @Input()
    get labelMode(): LabelMode {
        return this._getOption('labelMode');
    }
    set labelMode(value: LabelMode) {
        this._setOption('labelMode', value);
    }


    /**
     * [descr:DateBoxBaseOptions.max]
    
     */
    @Input()
    get max(): Date | number | string | undefined {
        return this._getOption('max');
    }
    set max(value: Date | number | string | undefined) {
        this._setOption('max', value);
    }


    /**
     * [descr:DateBoxBaseOptions.min]
    
     */
    @Input()
    get min(): Date | number | string | undefined {
        return this._getOption('min');
    }
    set min(value: Date | number | string | undefined) {
        this._setOption('min', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.multiView]
    
     */
    @Input()
    get multiView(): boolean {
        return this._getOption('multiView');
    }
    set multiView(value: boolean) {
        this._setOption('multiView', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.opened]
    
     */
    @Input()
    get opened(): boolean {
        return this._getOption('opened');
    }
    set opened(value: boolean) {
        this._setOption('opened', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.openOnFieldClick]
    
     */
    @Input()
    get openOnFieldClick(): boolean {
        return this._getOption('openOnFieldClick');
    }
    set openOnFieldClick(value: boolean) {
        this._setOption('openOnFieldClick', value);
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
     * [descr:dxTextEditorOptions.showClearButton]
    
     */
    @Input()
    get showClearButton(): boolean {
        return this._getOption('showClearButton');
    }
    set showClearButton(value: boolean) {
        this._setOption('showClearButton', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.showDropDownButton]
    
     */
    @Input()
    get showDropDownButton(): boolean {
        return this._getOption('showDropDownButton');
    }
    set showDropDownButton(value: boolean) {
        this._setOption('showDropDownButton', value);
    }


    /**
     * [descr:dxTextEditorOptions.spellcheck]
    
     */
    @Input()
    get spellcheck(): boolean {
        return this._getOption('spellcheck');
    }
    set spellcheck(value: boolean) {
        this._setOption('spellcheck', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDate]
    
     */
    @Input()
    get startDate(): Date | number | string {
        return this._getOption('startDate');
    }
    set startDate(value: Date | number | string) {
        this._setOption('startDate', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDateInputAttr]
    
     */
    @Input()
    get startDateInputAttr(): any {
        return this._getOption('startDateInputAttr');
    }
    set startDateInputAttr(value: any) {
        this._setOption('startDateInputAttr', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDateLabel]
    
     */
    @Input()
    get startDateLabel(): string {
        return this._getOption('startDateLabel');
    }
    set startDateLabel(value: string) {
        this._setOption('startDateLabel', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDateName]
    
     */
    @Input()
    get startDateName(): string {
        return this._getOption('startDateName');
    }
    set startDateName(value: string) {
        this._setOption('startDateName', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDateOutOfRangeMessage]
    
     */
    @Input()
    get startDateOutOfRangeMessage(): string {
        return this._getOption('startDateOutOfRangeMessage');
    }
    set startDateOutOfRangeMessage(value: string) {
        this._setOption('startDateOutOfRangeMessage', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDatePlaceholder]
    
     */
    @Input()
    get startDatePlaceholder(): string {
        return this._getOption('startDatePlaceholder');
    }
    set startDatePlaceholder(value: string) {
        this._setOption('startDatePlaceholder', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.startDateText]
    
     */
    @Input()
    get startDateText(): string {
        return this._getOption('startDateText');
    }
    set startDateText(value: string) {
        this._setOption('startDateText', value);
    }


    /**
     * [descr:dxTextEditorOptions.stylingMode]
    
     */
    @Input()
    get stylingMode(): EditorStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: EditorStyle) {
        this._setOption('stylingMode', value);
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
     * [descr:DateBoxBaseOptions.todayButtonText]
    
     */
    @Input()
    get todayButtonText(): string {
        return this._getOption('todayButtonText');
    }
    set todayButtonText(value: string) {
        this._setOption('todayButtonText', value);
    }


    /**
     * [descr:DateBoxBaseOptions.useMaskBehavior]
    
     */
    @Input()
    get useMaskBehavior(): boolean {
        return this._getOption('useMaskBehavior');
    }
    set useMaskBehavior(value: boolean) {
        this._setOption('useMaskBehavior', value);
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
    get validationMessageMode(): ValidationMessageMode {
        return this._getOption('validationMessageMode');
    }
    set validationMessageMode(value: ValidationMessageMode) {
        this._setOption('validationMessageMode', value);
    }


    /**
     * [descr:dxDropDownEditorOptions.validationMessagePosition]
    
     */
    @Input()
    get validationMessagePosition(): Mode | Position {
        return this._getOption('validationMessagePosition');
    }
    set validationMessagePosition(value: Mode | Position) {
        this._setOption('validationMessagePosition', value);
    }


    /**
     * [descr:EditorOptions.validationStatus]
    
     */
    @Input()
    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }


    /**
     * [descr:dxDateRangeBoxOptions.value]
    
     */
    @Input()
    get value(): Array<Date | number | string> {
        return this._getOption('value');
    }
    set value(value: Array<Date | number | string>) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxTextEditorOptions.valueChangeEvent]
    
     */
    @Input()
    get valueChangeEvent(): string {
        return this._getOption('valueChangeEvent');
    }
    set valueChangeEvent(value: string) {
        this._setOption('valueChangeEvent', value);
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
    
     * [descr:dxDateRangeBoxOptions.onChange]
    
    
     */
    @Output() onChange: EventEmitter<ChangeEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onClosed]
    
    
     */
    @Output() onClosed: EventEmitter<ClosedEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onCopy]
    
    
     */
    @Output() onCopy: EventEmitter<CopyEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onCut]
    
    
     */
    @Output() onCut: EventEmitter<CutEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onEnterKey]
    
    
     */
    @Output() onEnterKey: EventEmitter<EnterKeyEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onFocusIn]
    
    
     */
    @Output() onFocusIn: EventEmitter<FocusInEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onFocusOut]
    
    
     */
    @Output() onFocusOut: EventEmitter<FocusOutEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onInput]
    
    
     */
    @Output() onInput: EventEmitter<InputEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onKeyDown]
    
    
     */
    @Output() onKeyDown: EventEmitter<KeyDownEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onKeyUp]
    
    
     */
    @Output() onKeyUp: EventEmitter<KeyUpEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onOpened]
    
    
     */
    @Output() onOpened: EventEmitter<OpenedEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onPaste]
    
    
     */
    @Output() onPaste: EventEmitter<PasteEvent>;

    /**
    
     * [descr:dxDateRangeBoxOptions.onValueChanged]
    
    
     */
    @Output() onValueChanged: EventEmitter<ValueChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() acceptCustomValueChange: EventEmitter<boolean>;

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
    @Output() applyButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() applyValueModeChange: EventEmitter<ApplyValueMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() buttonsChange: EventEmitter<Array<DropDownPredefinedButton | TextEditorButton>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() calendarOptionsChange: EventEmitter<dxCalendarOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cancelButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dateSerializationFormatChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() deferRenderingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disableOutOfRangeSelectionChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() displayFormatChange: EventEmitter<Format>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownButtonTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownOptionsChange: EventEmitter<dxPopupOptions<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateChange: EventEmitter<Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateInputAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateLabelChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateNameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateOutOfRangeMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDatePlaceholderChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endDateTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

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
    @Output() invalidEndDateMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() invalidStartDateMessageChange: EventEmitter<string>;

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
    @Output() labelModeChange: EventEmitter<LabelMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxChange: EventEmitter<Date | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minChange: EventEmitter<Date | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() multiViewChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() openedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() openOnFieldClickChange: EventEmitter<boolean>;

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
    @Output() showClearButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showDropDownButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() spellcheckChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateChange: EventEmitter<Date | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateInputAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateLabelChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateNameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateOutOfRangeMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDatePlaceholderChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startDateTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stylingModeChange: EventEmitter<EditorStyle>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() todayButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useMaskBehaviorChange: EventEmitter<boolean>;

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
    @Output() validationMessageModeChange: EventEmitter<ValidationMessageMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationMessagePositionChange: EventEmitter<Mode | Position>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationStatusChange: EventEmitter<ValidationStatus>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<Date | number | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChangeEventChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};


    @ContentChildren(DxiDateRangeBoxButtonComponent)
    get buttonsChildren(): QueryList<DxiDateRangeBoxButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsChildren(value) {
        this.setContentChildren('buttons', value, 'DxiDateRangeBoxButtonComponent');
        this.setChildren('buttons', value);
    }


    @ContentChildren(DxiButtonComponent)
    get buttonsLegacyChildren(): QueryList<DxiButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsLegacyChildren(value) {
        if (this.checkContentChildren('buttons', value, 'DxiButtonComponent')) {
           this.setChildren('buttons', value);
        }
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'change', emit: 'onChange' },
            { subscribe: 'closed', emit: 'onClosed' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'copy', emit: 'onCopy' },
            { subscribe: 'cut', emit: 'onCut' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'enterKey', emit: 'onEnterKey' },
            { subscribe: 'focusIn', emit: 'onFocusIn' },
            { subscribe: 'focusOut', emit: 'onFocusOut' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'input', emit: 'onInput' },
            { subscribe: 'keyDown', emit: 'onKeyDown' },
            { subscribe: 'keyUp', emit: 'onKeyUp' },
            { subscribe: 'opened', emit: 'onOpened' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'paste', emit: 'onPaste' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'acceptCustomValueChange' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'applyButtonTextChange' },
            { emit: 'applyValueModeChange' },
            { emit: 'buttonsChange' },
            { emit: 'calendarOptionsChange' },
            { emit: 'cancelButtonTextChange' },
            { emit: 'dateSerializationFormatChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'disableOutOfRangeSelectionChange' },
            { emit: 'displayFormatChange' },
            { emit: 'dropDownButtonTemplateChange' },
            { emit: 'dropDownOptionsChange' },
            { emit: 'elementAttrChange' },
            { emit: 'endDateChange' },
            { emit: 'endDateInputAttrChange' },
            { emit: 'endDateLabelChange' },
            { emit: 'endDateNameChange' },
            { emit: 'endDateOutOfRangeMessageChange' },
            { emit: 'endDatePlaceholderChange' },
            { emit: 'endDateTextChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'invalidEndDateMessageChange' },
            { emit: 'invalidStartDateMessageChange' },
            { emit: 'isDirtyChange' },
            { emit: 'isValidChange' },
            { emit: 'labelModeChange' },
            { emit: 'maxChange' },
            { emit: 'minChange' },
            { emit: 'multiViewChange' },
            { emit: 'openedChange' },
            { emit: 'openOnFieldClickChange' },
            { emit: 'readOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showClearButtonChange' },
            { emit: 'showDropDownButtonChange' },
            { emit: 'spellcheckChange' },
            { emit: 'startDateChange' },
            { emit: 'startDateInputAttrChange' },
            { emit: 'startDateLabelChange' },
            { emit: 'startDateNameChange' },
            { emit: 'startDateOutOfRangeMessageChange' },
            { emit: 'startDatePlaceholderChange' },
            { emit: 'startDateTextChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'todayButtonTextChange' },
            { emit: 'useMaskBehaviorChange' },
            { emit: 'validationErrorChange' },
            { emit: 'validationErrorsChange' },
            { emit: 'validationMessageModeChange' },
            { emit: 'validationMessagePositionChange' },
            { emit: 'validationStatusChange' },
            { emit: 'valueChange' },
            { emit: 'valueChangeEventChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'onBlur' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxDateRangeBox(element, options);
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
        this.setupChanges('buttons', changes);
        this.setupChanges('validationErrors', changes);
        this.setupChanges('value', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('buttons');
        this._idh.doCheck('validationErrors');
        this._idh.doCheck('value');
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
    DxiButtonModule,
    DxoOptionsModule,
    DxoCalendarOptionsModule,
    DxoDisplayFormatModule,
    DxoDropDownOptionsModule,
    DxoAnimationModule,
    DxoHideModule,
    DxoFromModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoToModule,
    DxoShowModule,
    DxoDateRangeBoxAnimationModule,
    DxoDateRangeBoxAtModule,
    DxoDateRangeBoxBoundaryOffsetModule,
    DxiDateRangeBoxButtonModule,
    DxoDateRangeBoxCalendarOptionsModule,
    DxoDateRangeBoxCollisionModule,
    DxoDateRangeBoxDisplayFormatModule,
    DxoDateRangeBoxDropDownOptionsModule,
    DxoDateRangeBoxFromModule,
    DxoDateRangeBoxHideModule,
    DxoDateRangeBoxMyModule,
    DxoDateRangeBoxOffsetModule,
    DxoDateRangeBoxOptionsModule,
    DxoDateRangeBoxPositionModule,
    DxoDateRangeBoxShowModule,
    DxoDateRangeBoxToModule,
    DxiDateRangeBoxToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxDateRangeBoxComponent
  ],
  exports: [
    DxDateRangeBoxComponent,
    DxiButtonModule,
    DxoOptionsModule,
    DxoCalendarOptionsModule,
    DxoDisplayFormatModule,
    DxoDropDownOptionsModule,
    DxoAnimationModule,
    DxoHideModule,
    DxoFromModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoToModule,
    DxoShowModule,
    DxoDateRangeBoxAnimationModule,
    DxoDateRangeBoxAtModule,
    DxoDateRangeBoxBoundaryOffsetModule,
    DxiDateRangeBoxButtonModule,
    DxoDateRangeBoxCalendarOptionsModule,
    DxoDateRangeBoxCollisionModule,
    DxoDateRangeBoxDisplayFormatModule,
    DxoDateRangeBoxDropDownOptionsModule,
    DxoDateRangeBoxFromModule,
    DxoDateRangeBoxHideModule,
    DxoDateRangeBoxMyModule,
    DxoDateRangeBoxOffsetModule,
    DxoDateRangeBoxOptionsModule,
    DxoDateRangeBoxPositionModule,
    DxoDateRangeBoxShowModule,
    DxoDateRangeBoxToModule,
    DxiDateRangeBoxToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxDateRangeBoxModule { }

import type * as DxDateRangeBoxTypes from "devextreme/ui/date_range_box_types";
export { DxDateRangeBoxTypes };


