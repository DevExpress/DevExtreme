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
import { DropDownPredefinedButton } from 'devextreme/ui/drop_down_editor/ui.drop_down_editor';
import { TextEditorButton, LabelMode, SimplifiedSearchMode, EditorStyle, ValidationMessageMode, Mode, Position, ValidationStatus } from 'devextreme/common';
import { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxPopupOptions } from 'devextreme/ui/popup';
import { ChangeEvent, ClosedEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, ItemClickEvent, KeyDownEvent, KeyUpEvent, OpenedEvent, OptionChangedEvent, PasteEvent, SelectionChangedEvent, ValueChangedEvent } from 'devextreme/ui/autocomplete';

import DxAutocomplete from 'devextreme/ui/autocomplete';

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

import { DxoAutocompleteAnimationModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteAtModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteBoundaryOffsetModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxiAutocompleteButtonModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteCollisionModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteDropDownOptionsModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteFromModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteHideModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxiAutocompleteItemModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteMyModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteOffsetModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteOptionsModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompletePositionModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteShowModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxoAutocompleteToModule } from 'devextreme-angular/ui/autocomplete/nested';
import { DxiAutocompleteToolbarItemModule } from 'devextreme-angular/ui/autocomplete/nested';

import { DxiButtonComponent } from 'devextreme-angular/ui/nested';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiAutocompleteButtonComponent } from 'devextreme-angular/ui/autocomplete/nested';
import { DxiAutocompleteItemComponent } from 'devextreme-angular/ui/autocomplete/nested';



const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxAutocompleteComponent),
    multi: true
};
/**
 * [descr:dxAutocomplete]

 */
@Component({
    selector: 'dx-autocomplete',
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
export class DxAutocompleteComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxAutocomplete = null;

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
     * [descr:dxDropDownListOptions.displayValue]
    
     */
    @Input()
    get displayValue(): string | undefined {
        return this._getOption('displayValue');
    }
    set displayValue(value: string | undefined) {
        this._setOption('displayValue', value);
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
     * [descr:dxAutocompleteOptions.dropDownOptions]
    
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
     * [descr:dxAutocompleteOptions.maxItemCount]
    
     */
    @Input()
    get maxItemCount(): number {
        return this._getOption('maxItemCount');
    }
    set maxItemCount(value: number) {
        this._setOption('maxItemCount', value);
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
     * [descr:dxAutocompleteOptions.minSearchLength]
    
     */
    @Input()
    get minSearchLength(): number {
        return this._getOption('minSearchLength');
    }
    set minSearchLength(value: number) {
        this._setOption('minSearchLength', value);
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
     * [descr:dxDropDownEditorOptions.openOnFieldClick]
    
     */
    @Input()
    get openOnFieldClick(): boolean {
        return this._getOption('openOnFieldClick');
    }
    set openOnFieldClick(value: boolean) {
        this._setOption('openOnFieldClick', value);
    }


    /**
     * [descr:dxTextEditorOptions.placeholder]
    
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
     * [descr:dxDropDownListOptions.selectedItem]
    
     */
    @Input()
    get selectedItem(): any {
        return this._getOption('selectedItem');
    }
    set selectedItem(value: any) {
        this._setOption('selectedItem', value);
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
     * [descr:dxAutocompleteOptions.showDropDownButton]
    
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
     * [descr:dxAutocompleteOptions.value]
    
     */
    @Input()
    get value(): string {
        return this._getOption('value');
    }
    set value(value: string) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxDropDownListOptions.valueChangeEvent]
    
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
    
     * [descr:dxAutocompleteOptions.onChange]
    
    
     */
    @Output() onChange: EventEmitter<ChangeEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onClosed]
    
    
     */
    @Output() onClosed: EventEmitter<ClosedEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onCopy]
    
    
     */
    @Output() onCopy: EventEmitter<CopyEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onCut]
    
    
     */
    @Output() onCut: EventEmitter<CutEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onEnterKey]
    
    
     */
    @Output() onEnterKey: EventEmitter<EnterKeyEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onFocusIn]
    
    
     */
    @Output() onFocusIn: EventEmitter<FocusInEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onFocusOut]
    
    
     */
    @Output() onFocusOut: EventEmitter<FocusOutEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onInput]
    
    
     */
    @Output() onInput: EventEmitter<InputEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onKeyDown]
    
    
     */
    @Output() onKeyDown: EventEmitter<KeyDownEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onKeyUp]
    
    
     */
    @Output() onKeyUp: EventEmitter<KeyUpEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onOpened]
    
    
     */
    @Output() onOpened: EventEmitter<OpenedEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onPaste]
    
    
     */
    @Output() onPaste: EventEmitter<PasteEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxAutocompleteOptions.onValueChanged]
    
    
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
    @Output() buttonsChange: EventEmitter<Array<DropDownPredefinedButton | TextEditorButton>>;

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
    @Output() displayValueChange: EventEmitter<string | undefined>;

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
    @Output() maxItemCountChange: EventEmitter<number>;

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
    @Output() nameChange: EventEmitter<string>;

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
    @Output() selectedItemChange: EventEmitter<any>;

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
    @Output() stylingModeChange: EventEmitter<EditorStyle>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

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
    @Output() valueChange: EventEmitter<string>;

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


    @ContentChildren(DxiAutocompleteButtonComponent)
    get buttonsChildren(): QueryList<DxiAutocompleteButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsChildren(value) {
        this._setChildren('buttons', value, 'DxiAutocompleteButtonComponent');
    }

    @ContentChildren(DxiAutocompleteItemComponent)
    get itemsChildren(): QueryList<DxiAutocompleteItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiAutocompleteItemComponent');
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
            { subscribe: 'copy', emit: 'onCopy' },
            { subscribe: 'cut', emit: 'onCut' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'enterKey', emit: 'onEnterKey' },
            { subscribe: 'focusIn', emit: 'onFocusIn' },
            { subscribe: 'focusOut', emit: 'onFocusOut' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'input', emit: 'onInput' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'keyDown', emit: 'onKeyDown' },
            { subscribe: 'keyUp', emit: 'onKeyUp' },
            { subscribe: 'opened', emit: 'onOpened' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'paste', emit: 'onPaste' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'buttonsChange' },
            { emit: 'dataSourceChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'displayValueChange' },
            { emit: 'dropDownButtonTemplateChange' },
            { emit: 'dropDownOptionsChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'groupedChange' },
            { emit: 'groupTemplateChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'inputAttrChange' },
            { emit: 'isDirtyChange' },
            { emit: 'isValidChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'labelChange' },
            { emit: 'labelModeChange' },
            { emit: 'maxItemCountChange' },
            { emit: 'maxLengthChange' },
            { emit: 'minSearchLengthChange' },
            { emit: 'nameChange' },
            { emit: 'openedChange' },
            { emit: 'openOnFieldClickChange' },
            { emit: 'placeholderChange' },
            { emit: 'readOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'searchExprChange' },
            { emit: 'searchModeChange' },
            { emit: 'searchTimeoutChange' },
            { emit: 'selectedItemChange' },
            { emit: 'showClearButtonChange' },
            { emit: 'showDropDownButtonChange' },
            { emit: 'spellcheckChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
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

        return new DxAutocomplete(element, options);
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
        this.setupChanges('validationErrors', changes);
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
        this._idh.doCheck('validationErrors');
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
    DxoAutocompleteAnimationModule,
    DxoAutocompleteAtModule,
    DxoAutocompleteBoundaryOffsetModule,
    DxiAutocompleteButtonModule,
    DxoAutocompleteCollisionModule,
    DxoAutocompleteDropDownOptionsModule,
    DxoAutocompleteFromModule,
    DxoAutocompleteHideModule,
    DxiAutocompleteItemModule,
    DxoAutocompleteMyModule,
    DxoAutocompleteOffsetModule,
    DxoAutocompleteOptionsModule,
    DxoAutocompletePositionModule,
    DxoAutocompleteShowModule,
    DxoAutocompleteToModule,
    DxiAutocompleteToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxAutocompleteComponent
  ],
  exports: [
    DxAutocompleteComponent,
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
    DxoAutocompleteAnimationModule,
    DxoAutocompleteAtModule,
    DxoAutocompleteBoundaryOffsetModule,
    DxiAutocompleteButtonModule,
    DxoAutocompleteCollisionModule,
    DxoAutocompleteDropDownOptionsModule,
    DxoAutocompleteFromModule,
    DxoAutocompleteHideModule,
    DxiAutocompleteItemModule,
    DxoAutocompleteMyModule,
    DxoAutocompleteOffsetModule,
    DxoAutocompleteOptionsModule,
    DxoAutocompletePositionModule,
    DxoAutocompleteShowModule,
    DxoAutocompleteToModule,
    DxiAutocompleteToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxAutocompleteModule { }

import type * as DxAutocompleteTypes from "devextreme/ui/autocomplete_types";
export { DxAutocompleteTypes };


