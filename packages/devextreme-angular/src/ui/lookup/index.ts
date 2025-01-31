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
import { ApplyValueMode, LabelMode, PageLoadMode, SimplifiedSearchMode, EditorStyle, ValidationMessageMode, Mode, Position, ValidationStatus } from 'devextreme/common';
import { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxPopoverOptions } from 'devextreme/ui/popover';
import { ClosedEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, OpenedEvent, OptionChangedEvent, PageLoadingEvent, PullRefreshEvent, ScrollEvent, SelectionChangedEvent, ValueChangedEvent } from 'devextreme/ui/lookup';

import DxLookup from 'devextreme/ui/lookup';

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
import { DxoHideEventModule } from 'devextreme-angular/ui/nested';
import { DxoShowEventModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';

import { DxoLookupAnimationModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupAtModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupBoundaryOffsetModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupCollisionModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupDropDownOptionsModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupFromModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupHideModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupHideEventModule } from 'devextreme-angular/ui/lookup/nested';
import { DxiLookupItemModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupMyModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupOffsetModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupPositionModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupShowModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupShowEventModule } from 'devextreme-angular/ui/lookup/nested';
import { DxoLookupToModule } from 'devextreme-angular/ui/lookup/nested';
import { DxiLookupToolbarItemModule } from 'devextreme-angular/ui/lookup/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiLookupItemComponent } from 'devextreme-angular/ui/lookup/nested';



const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxLookupComponent),
    multi: true
};
/**
 * [descr:dxLookup]

 */
@Component({
    selector: 'dx-lookup',
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
export class DxLookupComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxLookup = null;

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
     * [descr:dxLookupOptions.applyButtonText]
    
     */
    @Input()
    get applyButtonText(): string {
        return this._getOption('applyButtonText');
    }
    set applyButtonText(value: string) {
        this._setOption('applyButtonText', value);
    }


    /**
     * [descr:dxLookupOptions.applyValueMode]
    
     */
    @Input()
    get applyValueMode(): ApplyValueMode {
        return this._getOption('applyValueMode');
    }
    set applyValueMode(value: ApplyValueMode) {
        this._setOption('applyValueMode', value);
    }


    /**
     * [descr:dxLookupOptions.cancelButtonText]
    
     */
    @Input()
    get cancelButtonText(): string {
        return this._getOption('cancelButtonText');
    }
    set cancelButtonText(value: string) {
        this._setOption('cancelButtonText', value);
    }


    /**
     * [descr:dxLookupOptions.cleanSearchOnOpening]
    
     */
    @Input()
    get cleanSearchOnOpening(): boolean {
        return this._getOption('cleanSearchOnOpening');
    }
    set cleanSearchOnOpening(value: boolean) {
        this._setOption('cleanSearchOnOpening', value);
    }


    /**
     * [descr:dxLookupOptions.clearButtonText]
    
     */
    @Input()
    get clearButtonText(): string {
        return this._getOption('clearButtonText');
    }
    set clearButtonText(value: string) {
        this._setOption('clearButtonText', value);
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
     * [descr:dxLookupOptions.dropDownCentered]
    
     */
    @Input()
    get dropDownCentered(): boolean {
        return this._getOption('dropDownCentered');
    }
    set dropDownCentered(value: boolean) {
        this._setOption('dropDownCentered', value);
    }


    /**
     * [descr:dxLookupOptions.dropDownOptions]
    
     */
    @Input()
    get dropDownOptions(): dxPopoverOptions<any> {
        return this._getOption('dropDownOptions');
    }
    set dropDownOptions(value: dxPopoverOptions<any>) {
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
     * [descr:dxLookupOptions.fieldTemplate]
    
     */
    @Input()
    get fieldTemplate(): any {
        return this._getOption('fieldTemplate');
    }
    set fieldTemplate(value: any) {
        this._setOption('fieldTemplate', value);
    }


    /**
     * [descr:dxLookupOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxLookupOptions.fullScreen]
    
     * @deprecated [depNote:dxLookupOptions.fullScreen]
    
     */
    @Input()
    get fullScreen(): boolean {
        return this._getOption('fullScreen');
    }
    set fullScreen(value: boolean) {
        this._setOption('fullScreen', value);
    }


    /**
     * [descr:dxLookupOptions.grouped]
    
     */
    @Input()
    get grouped(): boolean {
        return this._getOption('grouped');
    }
    set grouped(value: boolean) {
        this._setOption('grouped', value);
    }


    /**
     * [descr:dxLookupOptions.groupTemplate]
    
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
     * [descr:dxLookupOptions.nextButtonText]
    
     */
    @Input()
    get nextButtonText(): string {
        return this._getOption('nextButtonText');
    }
    set nextButtonText(value: string) {
        this._setOption('nextButtonText', value);
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
     * [descr:dxLookupOptions.pageLoadingText]
    
     */
    @Input()
    get pageLoadingText(): string {
        return this._getOption('pageLoadingText');
    }
    set pageLoadingText(value: string) {
        this._setOption('pageLoadingText', value);
    }


    /**
     * [descr:dxLookupOptions.pageLoadMode]
    
     */
    @Input()
    get pageLoadMode(): PageLoadMode {
        return this._getOption('pageLoadMode');
    }
    set pageLoadMode(value: PageLoadMode) {
        this._setOption('pageLoadMode', value);
    }


    /**
     * [descr:dxLookupOptions.placeholder]
    
     */
    @Input()
    get placeholder(): string {
        return this._getOption('placeholder');
    }
    set placeholder(value: string) {
        this._setOption('placeholder', value);
    }


    /**
     * [descr:dxLookupOptions.pulledDownText]
    
     */
    @Input()
    get pulledDownText(): string {
        return this._getOption('pulledDownText');
    }
    set pulledDownText(value: string) {
        this._setOption('pulledDownText', value);
    }


    /**
     * [descr:dxLookupOptions.pullingDownText]
    
     */
    @Input()
    get pullingDownText(): string {
        return this._getOption('pullingDownText');
    }
    set pullingDownText(value: string) {
        this._setOption('pullingDownText', value);
    }


    /**
     * [descr:dxLookupOptions.pullRefreshEnabled]
    
     */
    @Input()
    get pullRefreshEnabled(): boolean {
        return this._getOption('pullRefreshEnabled');
    }
    set pullRefreshEnabled(value: boolean) {
        this._setOption('pullRefreshEnabled', value);
    }


    /**
     * [descr:dxLookupOptions.refreshingText]
    
     */
    @Input()
    get refreshingText(): string {
        return this._getOption('refreshingText');
    }
    set refreshingText(value: string) {
        this._setOption('refreshingText', value);
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
     * [descr:dxLookupOptions.searchEnabled]
    
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
     * [descr:dxLookupOptions.searchPlaceholder]
    
     */
    @Input()
    get searchPlaceholder(): string {
        return this._getOption('searchPlaceholder');
    }
    set searchPlaceholder(value: string) {
        this._setOption('searchPlaceholder', value);
    }


    /**
     * [descr:dxLookupOptions.searchStartEvent]
    
     */
    @Input()
    get searchStartEvent(): string {
        return this._getOption('searchStartEvent');
    }
    set searchStartEvent(value: string) {
        this._setOption('searchStartEvent', value);
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
     * [descr:dxLookupOptions.showCancelButton]
    
     */
    @Input()
    get showCancelButton(): boolean {
        return this._getOption('showCancelButton');
    }
    set showCancelButton(value: boolean) {
        this._setOption('showCancelButton', value);
    }


    /**
     * [descr:dxLookupOptions.showClearButton]
    
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
     * [descr:dxLookupOptions.useNativeScrolling]
    
     */
    @Input()
    get useNativeScrolling(): boolean {
        return this._getOption('useNativeScrolling');
    }
    set useNativeScrolling(value: boolean) {
        this._setOption('useNativeScrolling', value);
    }


    /**
     * [descr:dxLookupOptions.usePopover]
    
     */
    @Input()
    get usePopover(): boolean {
        return this._getOption('usePopover');
    }
    set usePopover(value: boolean) {
        this._setOption('usePopover', value);
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
     * [descr:dxDropDownListOptions.value]
    
     */
    @Input()
    get value(): any {
        return this._getOption('value');
    }
    set value(value: any) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxLookupOptions.valueChangeEvent]
    
     * @deprecated [depNote:dxLookupOptions.valueChangeEvent]
    
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
    
     * [descr:dxLookupOptions.onClosed]
    
    
     */
    @Output() onClosed: EventEmitter<ClosedEvent>;

    /**
    
     * [descr:dxLookupOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxLookupOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxLookupOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxLookupOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxLookupOptions.onOpened]
    
    
     */
    @Output() onOpened: EventEmitter<OpenedEvent>;

    /**
    
     * [descr:dxLookupOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxLookupOptions.onPageLoading]
    
    
     */
    @Output() onPageLoading: EventEmitter<PageLoadingEvent>;

    /**
    
     * [descr:dxLookupOptions.onPullRefresh]
    
    
     */
    @Output() onPullRefresh: EventEmitter<PullRefreshEvent>;

    /**
    
     * [descr:dxLookupOptions.onScroll]
    
    
     */
    @Output() onScroll: EventEmitter<ScrollEvent>;

    /**
    
     * [descr:dxLookupOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxLookupOptions.onValueChanged]
    
    
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
    @Output() applyButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() applyValueModeChange: EventEmitter<ApplyValueMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cancelButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cleanSearchOnOpeningChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() clearButtonTextChange: EventEmitter<string>;

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
    @Output() displayValueChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownCenteredChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownOptionsChange: EventEmitter<dxPopoverOptions<any>>;

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
    @Output() fullScreenChange: EventEmitter<boolean>;

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
    @Output() minSearchLengthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nextButtonTextChange: EventEmitter<string>;

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
    @Output() pageLoadingTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageLoadModeChange: EventEmitter<PageLoadMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() placeholderChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pulledDownTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pullingDownTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pullRefreshEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() refreshingTextChange: EventEmitter<string>;

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
    @Output() searchPlaceholderChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchStartEventChange: EventEmitter<string>;

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
    @Output() showCancelButtonChange: EventEmitter<boolean>;

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
    @Output() useNativeScrollingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() usePopoverChange: EventEmitter<boolean>;

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
    @Output() valueChange: EventEmitter<any>;

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


    @ContentChildren(DxiLookupItemComponent)
    get itemsChildren(): QueryList<DxiLookupItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiLookupItemComponent');
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
            { subscribe: 'closed', emit: 'onClosed' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'opened', emit: 'onOpened' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'pageLoading', emit: 'onPageLoading' },
            { subscribe: 'pullRefresh', emit: 'onPullRefresh' },
            { subscribe: 'scroll', emit: 'onScroll' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'applyButtonTextChange' },
            { emit: 'applyValueModeChange' },
            { emit: 'cancelButtonTextChange' },
            { emit: 'cleanSearchOnOpeningChange' },
            { emit: 'clearButtonTextChange' },
            { emit: 'dataSourceChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'displayExprChange' },
            { emit: 'displayValueChange' },
            { emit: 'dropDownCenteredChange' },
            { emit: 'dropDownOptionsChange' },
            { emit: 'elementAttrChange' },
            { emit: 'fieldTemplateChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'fullScreenChange' },
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
            { emit: 'minSearchLengthChange' },
            { emit: 'nameChange' },
            { emit: 'nextButtonTextChange' },
            { emit: 'noDataTextChange' },
            { emit: 'openedChange' },
            { emit: 'pageLoadingTextChange' },
            { emit: 'pageLoadModeChange' },
            { emit: 'placeholderChange' },
            { emit: 'pulledDownTextChange' },
            { emit: 'pullingDownTextChange' },
            { emit: 'pullRefreshEnabledChange' },
            { emit: 'refreshingTextChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'searchEnabledChange' },
            { emit: 'searchExprChange' },
            { emit: 'searchModeChange' },
            { emit: 'searchPlaceholderChange' },
            { emit: 'searchStartEventChange' },
            { emit: 'searchTimeoutChange' },
            { emit: 'selectedItemChange' },
            { emit: 'showCancelButtonChange' },
            { emit: 'showClearButtonChange' },
            { emit: 'showDataBeforeSearchChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'textChange' },
            { emit: 'useItemTextAsTitleChange' },
            { emit: 'useNativeScrollingChange' },
            { emit: 'usePopoverChange' },
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

        return new DxLookup(element, options);
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
    DxoHideEventModule,
    DxoShowEventModule,
    DxiItemModule,
    DxoLookupAnimationModule,
    DxoLookupAtModule,
    DxoLookupBoundaryOffsetModule,
    DxoLookupCollisionModule,
    DxoLookupDropDownOptionsModule,
    DxoLookupFromModule,
    DxoLookupHideModule,
    DxoLookupHideEventModule,
    DxiLookupItemModule,
    DxoLookupMyModule,
    DxoLookupOffsetModule,
    DxoLookupPositionModule,
    DxoLookupShowModule,
    DxoLookupShowEventModule,
    DxoLookupToModule,
    DxiLookupToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxLookupComponent
  ],
  exports: [
    DxLookupComponent,
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
    DxoHideEventModule,
    DxoShowEventModule,
    DxiItemModule,
    DxoLookupAnimationModule,
    DxoLookupAtModule,
    DxoLookupBoundaryOffsetModule,
    DxoLookupCollisionModule,
    DxoLookupDropDownOptionsModule,
    DxoLookupFromModule,
    DxoLookupHideModule,
    DxoLookupHideEventModule,
    DxiLookupItemModule,
    DxoLookupMyModule,
    DxoLookupOffsetModule,
    DxoLookupPositionModule,
    DxoLookupShowModule,
    DxoLookupShowEventModule,
    DxoLookupToModule,
    DxiLookupToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxLookupModule { }

import type * as DxLookupTypes from "devextreme/ui/lookup_types";
export { DxLookupTypes };


