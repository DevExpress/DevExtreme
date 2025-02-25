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


import DataSource from 'devextreme/data/data_source';
import { ApplyValueMode, TextEditorButton, LabelMode, SimplifiedSearchMode, SelectAllMode, EditorStyle, ValidationMessageMode, Mode, Position, ValidationStatus } from 'devextreme/common';
import { DropDownPredefinedButton } from 'devextreme/ui/drop_down_editor/ui.drop_down_editor';
import { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxPopupOptions } from 'devextreme/ui/popup';
import { ChangeEvent, ClosedEvent, ContentReadyEvent, CustomItemCreatingEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, ItemClickEvent, KeyDownEvent, KeyUpEvent, MultiTagPreparingEvent, OpenedEvent, OptionChangedEvent, SelectAllValueChangedEvent, SelectionChangedEvent, ValueChangedEvent } from 'devextreme/ui/tag_box';

import DxTagBox from 'devextreme/ui/tag_box';

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
import { DxiItemModule } from 'devextreme-angular/ui/nested';

import { DxoTagBoxAnimationModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxAtModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxBoundaryOffsetModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxiTagBoxButtonModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxCollisionModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxDropDownOptionsModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxFromModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxHideModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxiTagBoxItemModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxMyModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxOffsetModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxOptionsModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxPositionModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxShowModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxoTagBoxToModule } from 'devextreme-angular/ui/tag-box/nested';
import { DxiTagBoxToolbarItemModule } from 'devextreme-angular/ui/tag-box/nested';

import { DxiButtonComponent } from 'devextreme-angular/ui/nested';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiTagBoxButtonComponent } from 'devextreme-angular/ui/tag-box/nested';
import { DxiTagBoxItemComponent } from 'devextreme-angular/ui/tag-box/nested';



const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxTagBoxComponent),
    multi: true
};
/**
 * [descr:dxTagBox]

 */
@Component({
    selector: 'dx-tag-box',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxTagBoxComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxTagBox = null;

    /**
     * [descr:dxSelectBoxOptions.acceptCustomValue]
    
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
     * [descr:dxTagBoxOptions.applyValueMode]
    
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
     * [descr:dxSelectBoxOptions.customItemCreateEvent]
    
     */
    @Input()
    get customItemCreateEvent(): string {
        return this._getOption('customItemCreateEvent');
    }
    set customItemCreateEvent(value: string) {
        this._setOption('customItemCreateEvent', value);
    }


    /**
     * [descr:DataExpressionMixinOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any | CollectionWidgetItem> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any | CollectionWidgetItem> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
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
     * [descr:DataExpressionMixinOptions.displayExpr]
    
     */
    @Input()
    get displayExpr(): ((item: any) => string) | string | undefined {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: ((item: any) => string) | string | undefined) {
        this._setOption('displayExpr', value);
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
     * [descr:dxSelectBoxOptions.dropDownOptions]
    
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
     * [descr:dxSelectBoxOptions.fieldTemplate]
    
     */
    @Input()
    get fieldTemplate(): any {
        return this._getOption('fieldTemplate');
    }
    set fieldTemplate(value: any) {
        this._setOption('fieldTemplate', value);
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
     * [descr:dxDropDownListOptions.grouped]
    
     */
    @Input()
    get grouped(): boolean {
        return this._getOption('grouped');
    }
    set grouped(value: boolean) {
        this._setOption('grouped', value);
    }


    /**
     * [descr:dxDropDownListOptions.groupTemplate]
    
     */
    @Input()
    get groupTemplate(): any {
        return this._getOption('groupTemplate');
    }
    set groupTemplate(value: any) {
        this._setOption('groupTemplate', value);
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
     * [descr:dxTagBoxOptions.hideSelectedItems]
    
     */
    @Input()
    get hideSelectedItems(): boolean {
        return this._getOption('hideSelectedItems');
    }
    set hideSelectedItems(value: boolean) {
        this._setOption('hideSelectedItems', value);
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
     * [descr:dxTextEditorOptions.inputAttr]
    
     */
    @Input()
    get inputAttr(): any {
        return this._getOption('inputAttr');
    }
    set inputAttr(value: any) {
        this._setOption('inputAttr', value);
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
     * [descr:DataExpressionMixinOptions.items]
    
     */
    @Input()
    get items(): Array<any | CollectionWidgetItem> {
        return this._getOption('items');
    }
    set items(value: Array<any | CollectionWidgetItem>) {
        this._setOption('items', value);
    }


    /**
     * [descr:DataExpressionMixinOptions.itemTemplate]
    
     */
    @Input()
    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }


    /**
     * [descr:dxTextEditorOptions.label]
    
     */
    @Input()
    get label(): string {
        return this._getOption('label');
    }
    set label(value: string) {
        this._setOption('label', value);
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
     * [descr:dxTagBoxOptions.maxDisplayedTags]
    
     */
    @Input()
    get maxDisplayedTags(): number | undefined {
        return this._getOption('maxDisplayedTags');
    }
    set maxDisplayedTags(value: number | undefined) {
        this._setOption('maxDisplayedTags', value);
    }


    /**
     * [descr:dxTagBoxOptions.maxFilterQueryLength]
    
     */
    @Input()
    get maxFilterQueryLength(): number {
        return this._getOption('maxFilterQueryLength');
    }
    set maxFilterQueryLength(value: number) {
        this._setOption('maxFilterQueryLength', value);
    }


    /**
     * [descr:dxTextBoxOptions.maxLength]
    
     */
    @Input()
    get maxLength(): number | string {
        return this._getOption('maxLength');
    }
    set maxLength(value: number | string) {
        this._setOption('maxLength', value);
    }


    /**
     * [descr:dxDropDownListOptions.minSearchLength]
    
     */
    @Input()
    get minSearchLength(): number {
        return this._getOption('minSearchLength');
    }
    set minSearchLength(value: number) {
        this._setOption('minSearchLength', value);
    }


    /**
     * [descr:dxTagBoxOptions.multiline]
    
     */
    @Input()
    get multiline(): boolean {
        return this._getOption('multiline');
    }
    set multiline(value: boolean) {
        this._setOption('multiline', value);
    }


    /**
     * [descr:dxTextEditorOptions.name]
    
     */
    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    /**
     * [descr:dxDropDownListOptions.noDataText]
    
     */
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
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
     * [descr:dxSelectBoxOptions.openOnFieldClick]
    
     */
    @Input()
    get openOnFieldClick(): boolean {
        return this._getOption('openOnFieldClick');
    }
    set openOnFieldClick(value: boolean) {
        this._setOption('openOnFieldClick', value);
    }


    /**
     * [descr:dxSelectBoxOptions.placeholder]
    
     */
    @Input()
    get placeholder(): string {
        return this._getOption('placeholder');
    }
    set placeholder(value: string) {
        this._setOption('placeholder', value);
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
     * [descr:dxDropDownListOptions.searchEnabled]
    
     */
    @Input()
    get searchEnabled(): boolean {
        return this._getOption('searchEnabled');
    }
    set searchEnabled(value: boolean) {
        this._setOption('searchEnabled', value);
    }


    /**
     * [descr:dxDropDownListOptions.searchExpr]
    
     */
    @Input()
    get searchExpr(): Array<Function | string> | Function | string {
        return this._getOption('searchExpr');
    }
    set searchExpr(value: Array<Function | string> | Function | string) {
        this._setOption('searchExpr', value);
    }


    /**
     * [descr:dxDropDownListOptions.searchMode]
    
     */
    @Input()
    get searchMode(): SimplifiedSearchMode {
        return this._getOption('searchMode');
    }
    set searchMode(value: SimplifiedSearchMode) {
        this._setOption('searchMode', value);
    }


    /**
     * [descr:dxDropDownListOptions.searchTimeout]
    
     */
    @Input()
    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }


    /**
     * [descr:dxTagBoxOptions.selectAllMode]
    
     */
    @Input()
    get selectAllMode(): SelectAllMode {
        return this._getOption('selectAllMode');
    }
    set selectAllMode(value: SelectAllMode) {
        this._setOption('selectAllMode', value);
    }


    /**
     * [descr:dxTagBoxOptions.selectAllText]
    
     */
    @Input()
    get selectAllText(): string {
        return this._getOption('selectAllText');
    }
    set selectAllText(value: string) {
        this._setOption('selectAllText', value);
    }


    /**
     * [descr:dxTagBoxOptions.selectedItems]
    
     */
    @Input()
    get selectedItems(): Array<any | number | string> {
        return this._getOption('selectedItems');
    }
    set selectedItems(value: Array<any | number | string>) {
        this._setOption('selectedItems', value);
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
     * [descr:dxDropDownListOptions.showDataBeforeSearch]
    
     */
    @Input()
    get showDataBeforeSearch(): boolean {
        return this._getOption('showDataBeforeSearch');
    }
    set showDataBeforeSearch(value: boolean) {
        this._setOption('showDataBeforeSearch', value);
    }


    /**
     * [descr:dxTagBoxOptions.showDropDownButton]
    
     */
    @Input()
    get showDropDownButton(): boolean {
        return this._getOption('showDropDownButton');
    }
    set showDropDownButton(value: boolean) {
        this._setOption('showDropDownButton', value);
    }


    /**
     * [descr:dxTagBoxOptions.showMultiTagOnly]
    
     */
    @Input()
    get showMultiTagOnly(): boolean {
        return this._getOption('showMultiTagOnly');
    }
    set showMultiTagOnly(value: boolean) {
        this._setOption('showMultiTagOnly', value);
    }


    /**
     * [descr:dxSelectBoxOptions.showSelectionControls]
    
     */
    @Input()
    get showSelectionControls(): boolean {
        return this._getOption('showSelectionControls');
    }
    set showSelectionControls(value: boolean) {
        this._setOption('showSelectionControls', value);
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
     * [descr:dxTagBoxOptions.tagTemplate]
    
     */
    @Input()
    get tagTemplate(): any {
        return this._getOption('tagTemplate');
    }
    set tagTemplate(value: any) {
        this._setOption('tagTemplate', value);
    }


    /**
     * [descr:dxTextEditorOptions.text]
    
     */
    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }


    /**
     * [descr:dxDropDownListOptions.useItemTextAsTitle]
    
     */
    @Input()
    get useItemTextAsTitle(): boolean {
        return this._getOption('useItemTextAsTitle');
    }
    set useItemTextAsTitle(value: boolean) {
        this._setOption('useItemTextAsTitle', value);
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
     * [descr:dxTagBoxOptions.value]
    
     */
    @Input()
    get value(): Array<any | number | string> {
        return this._getOption('value');
    }
    set value(value: Array<any | number | string>) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxSelectBoxOptions.valueChangeEvent]
    
     * @deprecated [depNote:dxSelectBoxOptions.valueChangeEvent]
    
     */
    @Input()
    get valueChangeEvent(): string {
        return this._getOption('valueChangeEvent');
    }
    set valueChangeEvent(value: string) {
        this._setOption('valueChangeEvent', value);
    }


    /**
     * [descr:DataExpressionMixinOptions.valueExpr]
    
     */
    @Input()
    get valueExpr(): ((item: any) => string | number | boolean) | string {
        return this._getOption('valueExpr');
    }
    set valueExpr(value: ((item: any) => string | number | boolean) | string) {
        this._setOption('valueExpr', value);
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
     * [descr:dxDropDownListOptions.wrapItemText]
    
     */
    @Input()
    get wrapItemText(): boolean {
        return this._getOption('wrapItemText');
    }
    set wrapItemText(value: boolean) {
        this._setOption('wrapItemText', value);
    }

    /**
    
     * [descr:dxTagBoxOptions.onChange]
    
    
     */
    @Output() onChange: EventEmitter<ChangeEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onClosed]
    
    
     */
    @Output() onClosed: EventEmitter<ClosedEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onCustomItemCreating]
    
    
     */
    @Output() onCustomItemCreating: EventEmitter<CustomItemCreatingEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onEnterKey]
    
    
     */
    @Output() onEnterKey: EventEmitter<EnterKeyEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onFocusIn]
    
    
     */
    @Output() onFocusIn: EventEmitter<FocusInEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onFocusOut]
    
    
     */
    @Output() onFocusOut: EventEmitter<FocusOutEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onInput]
    
    
     */
    @Output() onInput: EventEmitter<InputEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onKeyDown]
    
    
     */
    @Output() onKeyDown: EventEmitter<KeyDownEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onKeyUp]
    
    
     */
    @Output() onKeyUp: EventEmitter<KeyUpEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onMultiTagPreparing]
    
    
     */
    @Output() onMultiTagPreparing: EventEmitter<MultiTagPreparingEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onOpened]
    
    
     */
    @Output() onOpened: EventEmitter<OpenedEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onSelectAllValueChanged]
    
    
     */
    @Output() onSelectAllValueChanged: EventEmitter<SelectAllValueChangedEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxTagBoxOptions.onValueChanged]
    
    
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
    @Output() applyValueModeChange: EventEmitter<ApplyValueMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() buttonsChange: EventEmitter<Array<DropDownPredefinedButton | TextEditorButton>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customItemCreateEventChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any | CollectionWidgetItem> | DataSource | DataSourceOptions | null | Store | string>;

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
    @Output() displayExprChange: EventEmitter<((item: any) => string) | string | undefined>;

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
    @Output() fieldTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideSelectedItemsChange: EventEmitter<boolean>;

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
    @Output() inputAttrChange: EventEmitter<any>;

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
    @Output() itemsChange: EventEmitter<Array<any | CollectionWidgetItem>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelModeChange: EventEmitter<LabelMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxDisplayedTagsChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxFilterQueryLengthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxLengthChange: EventEmitter<number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minSearchLengthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() multilineChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

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
    @Output() placeholderChange: EventEmitter<string>;

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
    @Output() searchEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchExprChange: EventEmitter<Array<Function | string> | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchModeChange: EventEmitter<SimplifiedSearchMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchTimeoutChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectAllModeChange: EventEmitter<SelectAllMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectAllTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemsChange: EventEmitter<Array<any | number | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showClearButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showDataBeforeSearchChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showDropDownButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showMultiTagOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showSelectionControlsChange: EventEmitter<boolean>;

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
    @Output() tagTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useItemTextAsTitleChange: EventEmitter<boolean>;

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
    @Output() valueChange: EventEmitter<Array<any | number | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChangeEventChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueExprChange: EventEmitter<((item: any) => string | number | boolean) | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wrapItemTextChange: EventEmitter<boolean>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};


    @ContentChildren(DxiTagBoxButtonComponent)
    get buttonsChildren(): QueryList<DxiTagBoxButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsChildren(value) {
        this._setChildren('buttons', value, 'DxiTagBoxButtonComponent');
    }

    @ContentChildren(DxiTagBoxItemComponent)
    get itemsChildren(): QueryList<DxiTagBoxItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiTagBoxItemComponent');
    }


    @ContentChildren(DxiButtonComponent)
    get buttonsLegacyChildren(): QueryList<DxiButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsLegacyChildren(value) {
        this._setChildren('buttons', value, 'DxiButtonComponent');
    }

    @ContentChildren(DxiItemComponent)
    get itemsLegacyChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsLegacyChildren(value) {
        this._setChildren('items', value, 'DxiItemComponent');
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
            { subscribe: 'customItemCreating', emit: 'onCustomItemCreating' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'enterKey', emit: 'onEnterKey' },
            { subscribe: 'focusIn', emit: 'onFocusIn' },
            { subscribe: 'focusOut', emit: 'onFocusOut' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'input', emit: 'onInput' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'keyDown', emit: 'onKeyDown' },
            { subscribe: 'keyUp', emit: 'onKeyUp' },
            { subscribe: 'multiTagPreparing', emit: 'onMultiTagPreparing' },
            { subscribe: 'opened', emit: 'onOpened' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectAllValueChanged', emit: 'onSelectAllValueChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'acceptCustomValueChange' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'applyValueModeChange' },
            { emit: 'buttonsChange' },
            { emit: 'customItemCreateEventChange' },
            { emit: 'dataSourceChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'displayExprChange' },
            { emit: 'dropDownButtonTemplateChange' },
            { emit: 'dropDownOptionsChange' },
            { emit: 'elementAttrChange' },
            { emit: 'fieldTemplateChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'groupedChange' },
            { emit: 'groupTemplateChange' },
            { emit: 'heightChange' },
            { emit: 'hideSelectedItemsChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'inputAttrChange' },
            { emit: 'isDirtyChange' },
            { emit: 'isValidChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'labelChange' },
            { emit: 'labelModeChange' },
            { emit: 'maxDisplayedTagsChange' },
            { emit: 'maxFilterQueryLengthChange' },
            { emit: 'maxLengthChange' },
            { emit: 'minSearchLengthChange' },
            { emit: 'multilineChange' },
            { emit: 'nameChange' },
            { emit: 'noDataTextChange' },
            { emit: 'openedChange' },
            { emit: 'openOnFieldClickChange' },
            { emit: 'placeholderChange' },
            { emit: 'readOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'searchEnabledChange' },
            { emit: 'searchExprChange' },
            { emit: 'searchModeChange' },
            { emit: 'searchTimeoutChange' },
            { emit: 'selectAllModeChange' },
            { emit: 'selectAllTextChange' },
            { emit: 'selectedItemsChange' },
            { emit: 'showClearButtonChange' },
            { emit: 'showDataBeforeSearchChange' },
            { emit: 'showDropDownButtonChange' },
            { emit: 'showMultiTagOnlyChange' },
            { emit: 'showSelectionControlsChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'tagTemplateChange' },
            { emit: 'textChange' },
            { emit: 'useItemTextAsTitleChange' },
            { emit: 'validationErrorChange' },
            { emit: 'validationErrorsChange' },
            { emit: 'validationMessageModeChange' },
            { emit: 'validationMessagePositionChange' },
            { emit: 'validationStatusChange' },
            { emit: 'valueChange' },
            { emit: 'valueChangeEventChange' },
            { emit: 'valueExprChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wrapItemTextChange' },
            { emit: 'onBlur' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxTagBox(element, options);
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
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
        this.setupChanges('searchExpr', changes);
        this.setupChanges('selectedItems', changes);
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
        this._idh.doCheck('dataSource');
        this._idh.doCheck('items');
        this._idh.doCheck('searchExpr');
        this._idh.doCheck('selectedItems');
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
    DxiItemModule,
    DxoTagBoxAnimationModule,
    DxoTagBoxAtModule,
    DxoTagBoxBoundaryOffsetModule,
    DxiTagBoxButtonModule,
    DxoTagBoxCollisionModule,
    DxoTagBoxDropDownOptionsModule,
    DxoTagBoxFromModule,
    DxoTagBoxHideModule,
    DxiTagBoxItemModule,
    DxoTagBoxMyModule,
    DxoTagBoxOffsetModule,
    DxoTagBoxOptionsModule,
    DxoTagBoxPositionModule,
    DxoTagBoxShowModule,
    DxoTagBoxToModule,
    DxiTagBoxToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxTagBoxComponent
  ],
  exports: [
    DxTagBoxComponent,
    DxiButtonModule,
    DxoOptionsModule,
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
    DxiItemModule,
    DxoTagBoxAnimationModule,
    DxoTagBoxAtModule,
    DxoTagBoxBoundaryOffsetModule,
    DxiTagBoxButtonModule,
    DxoTagBoxCollisionModule,
    DxoTagBoxDropDownOptionsModule,
    DxoTagBoxFromModule,
    DxoTagBoxHideModule,
    DxiTagBoxItemModule,
    DxoTagBoxMyModule,
    DxoTagBoxOffsetModule,
    DxoTagBoxOptionsModule,
    DxoTagBoxPositionModule,
    DxoTagBoxShowModule,
    DxoTagBoxToModule,
    DxiTagBoxToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxTagBoxModule { }

import type * as DxTagBoxTypes from "devextreme/ui/tag_box_types";
export { DxTagBoxTypes };


