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

export { ExplicitTypes } from 'devextreme/ui/tree_view';

import DataSource from 'devextreme/data/data_source';
import { dxTreeViewNode, dxTreeViewItem, TreeViewExpandEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemCollapsedEvent, ItemContextMenuEvent, ItemExpandedEvent, ItemHoldEvent, ItemRenderedEvent, ItemSelectionChangedEvent, OptionChangedEvent, SelectAllValueChangedEvent, SelectionChangedEvent, TreeViewCheckBoxMode } from 'devextreme/ui/tree_view';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { DataStructure, ScrollDirection, SearchMode, SingleOrMultiple } from 'devextreme/common';
import { dxTextBoxOptions } from 'devextreme/ui/text_box';

import DxTreeView from 'devextreme/ui/tree_view';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoSearchEditorOptionsModule } from 'devextreme-angular/ui/nested';
import { DxiButtonModule } from 'devextreme-angular/ui/nested';
import { DxoOptionsModule } from 'devextreme-angular/ui/nested';

import { DxiTreeViewButtonModule } from 'devextreme-angular/ui/tree-view/nested';
import { DxiTreeViewItemModule } from 'devextreme-angular/ui/tree-view/nested';
import { DxoTreeViewOptionsModule } from 'devextreme-angular/ui/tree-view/nested';
import { DxoTreeViewSearchEditorOptionsModule } from 'devextreme-angular/ui/tree-view/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiTreeViewItemComponent } from 'devextreme-angular/ui/tree-view/nested';


/**
 * [descr:dxTreeView]

 */
@Component({
    selector: 'dx-tree-view',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxTreeViewComponent<TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxTreeView<TKey> = null;

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
     * [descr:dxTreeViewOptions.animationEnabled]
    
     */
    @Input()
    get animationEnabled(): boolean {
        return this._getOption('animationEnabled');
    }
    set animationEnabled(value: boolean) {
        this._setOption('animationEnabled', value);
    }


    /**
     * [descr:dxTreeViewOptions.collapseIcon]
    
     */
    @Input()
    get collapseIcon(): null | string {
        return this._getOption('collapseIcon');
    }
    set collapseIcon(value: null | string) {
        this._setOption('collapseIcon', value);
    }


    /**
     * [descr:dxTreeViewOptions.createChildren]
    
     */
    @Input()
    get createChildren(): ((parentNode: dxTreeViewNode) => any | Array<Record<string, any>>) {
        return this._getOption('createChildren');
    }
    set createChildren(value: ((parentNode: dxTreeViewNode) => any | Array<Record<string, any>>)) {
        this._setOption('createChildren', value);
    }


    /**
     * [descr:dxTreeViewOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<dxTreeViewItem> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<dxTreeViewItem> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxTreeViewOptions.dataStructure]
    
     */
    @Input()
    get dataStructure(): DataStructure {
        return this._getOption('dataStructure');
    }
    set dataStructure(value: DataStructure) {
        this._setOption('dataStructure', value);
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
     * [descr:HierarchicalCollectionWidgetOptions.disabledExpr]
    
     */
    @Input()
    get disabledExpr(): Function | string {
        return this._getOption('disabledExpr');
    }
    set disabledExpr(value: Function | string) {
        this._setOption('disabledExpr', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.displayExpr]
    
     */
    @Input()
    get displayExpr(): ((item: any) => string) | string {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: ((item: any) => string) | string) {
        this._setOption('displayExpr', value);
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
     * [descr:dxTreeViewOptions.expandAllEnabled]
    
     */
    @Input()
    get expandAllEnabled(): boolean {
        return this._getOption('expandAllEnabled');
    }
    set expandAllEnabled(value: boolean) {
        this._setOption('expandAllEnabled', value);
    }


    /**
     * [descr:dxTreeViewOptions.expandedExpr]
    
     */
    @Input()
    get expandedExpr(): Function | string {
        return this._getOption('expandedExpr');
    }
    set expandedExpr(value: Function | string) {
        this._setOption('expandedExpr', value);
    }


    /**
     * [descr:dxTreeViewOptions.expandEvent]
    
     */
    @Input()
    get expandEvent(): TreeViewExpandEvent {
        return this._getOption('expandEvent');
    }
    set expandEvent(value: TreeViewExpandEvent) {
        this._setOption('expandEvent', value);
    }


    /**
     * [descr:dxTreeViewOptions.expandIcon]
    
     */
    @Input()
    get expandIcon(): null | string {
        return this._getOption('expandIcon');
    }
    set expandIcon(value: null | string) {
        this._setOption('expandIcon', value);
    }


    /**
     * [descr:dxTreeViewOptions.expandNodesRecursive]
    
     */
    @Input()
    get expandNodesRecursive(): boolean {
        return this._getOption('expandNodesRecursive');
    }
    set expandNodesRecursive(value: boolean) {
        this._setOption('expandNodesRecursive', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxTreeViewOptions.hasItemsExpr]
    
     */
    @Input()
    get hasItemsExpr(): Function | string {
        return this._getOption('hasItemsExpr');
    }
    set hasItemsExpr(value: Function | string) {
        this._setOption('hasItemsExpr', value);
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
     * [descr:HierarchicalCollectionWidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:CollectionWidgetOptions.itemHoldTimeout]
    
     */
    @Input()
    get itemHoldTimeout(): number {
        return this._getOption('itemHoldTimeout');
    }
    set itemHoldTimeout(value: number) {
        this._setOption('itemHoldTimeout', value);
    }


    /**
     * [descr:dxTreeViewOptions.items]
    
     */
    @Input()
    get items(): Array<dxTreeViewItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxTreeViewItem>) {
        this._setOption('items', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.itemsExpr]
    
     */
    @Input()
    get itemsExpr(): Function | string {
        return this._getOption('itemsExpr');
    }
    set itemsExpr(value: Function | string) {
        this._setOption('itemsExpr', value);
    }


    /**
     * [descr:CollectionWidgetOptions.itemTemplate]
    
     */
    @Input()
    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:CollectionWidgetOptions.noDataText]
    
     */
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }


    /**
     * [descr:dxTreeViewOptions.parentIdExpr]
    
     */
    @Input()
    get parentIdExpr(): Function | string {
        return this._getOption('parentIdExpr');
    }
    set parentIdExpr(value: Function | string) {
        this._setOption('parentIdExpr', value);
    }


    /**
     * [descr:dxTreeViewOptions.rootValue]
    
     */
    @Input()
    get rootValue(): any {
        return this._getOption('rootValue');
    }
    set rootValue(value: any) {
        this._setOption('rootValue', value);
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
     * [descr:dxTreeViewOptions.scrollDirection]
    
     */
    @Input()
    get scrollDirection(): ScrollDirection {
        return this._getOption('scrollDirection');
    }
    set scrollDirection(value: ScrollDirection) {
        this._setOption('scrollDirection', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchEditorOptions]
    
     */
    @Input()
    get searchEditorOptions(): dxTextBoxOptions<any> {
        return this._getOption('searchEditorOptions');
    }
    set searchEditorOptions(value: dxTextBoxOptions<any>) {
        this._setOption('searchEditorOptions', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchEnabled]
    
     */
    @Input()
    get searchEnabled(): boolean {
        return this._getOption('searchEnabled');
    }
    set searchEnabled(value: boolean) {
        this._setOption('searchEnabled', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchExpr]
    
     */
    @Input()
    get searchExpr(): Array<Function | string> | Function | string {
        return this._getOption('searchExpr');
    }
    set searchExpr(value: Array<Function | string> | Function | string) {
        this._setOption('searchExpr', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchMode]
    
     */
    @Input()
    get searchMode(): SearchMode {
        return this._getOption('searchMode');
    }
    set searchMode(value: SearchMode) {
        this._setOption('searchMode', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchTimeout]
    
     */
    @Input()
    get searchTimeout(): number | undefined {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number | undefined) {
        this._setOption('searchTimeout', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchValue]
    
     */
    @Input()
    get searchValue(): string {
        return this._getOption('searchValue');
    }
    set searchValue(value: string) {
        this._setOption('searchValue', value);
    }


    /**
     * [descr:dxTreeViewOptions.selectAllText]
    
     */
    @Input()
    get selectAllText(): string {
        return this._getOption('selectAllText');
    }
    set selectAllText(value: string) {
        this._setOption('selectAllText', value);
    }


    /**
     * [descr:dxTreeViewOptions.selectByClick]
    
     */
    @Input()
    get selectByClick(): boolean {
        return this._getOption('selectByClick');
    }
    set selectByClick(value: boolean) {
        this._setOption('selectByClick', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.selectedExpr]
    
     */
    @Input()
    get selectedExpr(): Function | string {
        return this._getOption('selectedExpr');
    }
    set selectedExpr(value: Function | string) {
        this._setOption('selectedExpr', value);
    }


    /**
     * [descr:dxTreeViewOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): SingleOrMultiple {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: SingleOrMultiple) {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:dxTreeViewOptions.selectNodesRecursive]
    
     */
    @Input()
    get selectNodesRecursive(): boolean {
        return this._getOption('selectNodesRecursive');
    }
    set selectNodesRecursive(value: boolean) {
        this._setOption('selectNodesRecursive', value);
    }


    /**
     * [descr:dxTreeViewOptions.showCheckBoxesMode]
    
     */
    @Input()
    get showCheckBoxesMode(): TreeViewCheckBoxMode {
        return this._getOption('showCheckBoxesMode');
    }
    set showCheckBoxesMode(value: TreeViewCheckBoxMode) {
        this._setOption('showCheckBoxesMode', value);
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
     * [descr:dxTreeViewOptions.useNativeScrolling]
    
     */
    @Input()
    get useNativeScrolling(): boolean {
        return this._getOption('useNativeScrolling');
    }
    set useNativeScrolling(value: boolean) {
        this._setOption('useNativeScrolling', value);
    }


    /**
     * [descr:dxTreeViewOptions.virtualModeEnabled]
    
     */
    @Input()
    get virtualModeEnabled(): boolean {
        return this._getOption('virtualModeEnabled');
    }
    set virtualModeEnabled(value: boolean) {
        this._setOption('virtualModeEnabled', value);
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
    
     * [descr:dxTreeViewOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemCollapsed]
    
    
     */
    @Output() onItemCollapsed: EventEmitter<ItemCollapsedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemExpanded]
    
    
     */
    @Output() onItemExpanded: EventEmitter<ItemExpandedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemHold]
    
    
     */
    @Output() onItemHold: EventEmitter<ItemHoldEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onItemSelectionChanged]
    
    
     */
    @Output() onItemSelectionChanged: EventEmitter<ItemSelectionChangedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onSelectAllValueChanged]
    
    
     */
    @Output() onSelectAllValueChanged: EventEmitter<SelectAllValueChangedEvent>;

    /**
    
     * [descr:dxTreeViewOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

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
    @Output() animationEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() collapseIconChange: EventEmitter<null | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() createChildrenChange: EventEmitter<((parentNode: dxTreeViewNode) => any | Array<Record<string, any>>)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<dxTreeViewItem> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataStructureChange: EventEmitter<DataStructure>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() displayExprChange: EventEmitter<((item: any) => string) | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandAllEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandedExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandEventChange: EventEmitter<TreeViewExpandEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandIconChange: EventEmitter<null | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandNodesRecursiveChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hasItemsExprChange: EventEmitter<Function | string>;

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
    @Output() itemHoldTimeoutChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<dxTreeViewItem>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() parentIdExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rootValueChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollDirectionChange: EventEmitter<ScrollDirection>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchEditorOptionsChange: EventEmitter<dxTextBoxOptions<any>>;

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
    @Output() searchModeChange: EventEmitter<SearchMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchTimeoutChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchValueChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectAllTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectByClickChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<SingleOrMultiple>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectNodesRecursiveChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showCheckBoxesModeChange: EventEmitter<TreeViewCheckBoxMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useNativeScrollingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() virtualModeEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;




    @ContentChildren(DxiTreeViewItemComponent)
    get itemsChildren(): QueryList<DxiTreeViewItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiTreeViewItemComponent');
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
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'itemCollapsed', emit: 'onItemCollapsed' },
            { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
            { subscribe: 'itemExpanded', emit: 'onItemExpanded' },
            { subscribe: 'itemHold', emit: 'onItemHold' },
            { subscribe: 'itemRendered', emit: 'onItemRendered' },
            { subscribe: 'itemSelectionChanged', emit: 'onItemSelectionChanged' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectAllValueChanged', emit: 'onSelectAllValueChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'animationEnabledChange' },
            { emit: 'collapseIconChange' },
            { emit: 'createChildrenChange' },
            { emit: 'dataSourceChange' },
            { emit: 'dataStructureChange' },
            { emit: 'disabledChange' },
            { emit: 'disabledExprChange' },
            { emit: 'displayExprChange' },
            { emit: 'elementAttrChange' },
            { emit: 'expandAllEnabledChange' },
            { emit: 'expandedExprChange' },
            { emit: 'expandEventChange' },
            { emit: 'expandIconChange' },
            { emit: 'expandNodesRecursiveChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'hasItemsExprChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemHoldTimeoutChange' },
            { emit: 'itemsChange' },
            { emit: 'itemsExprChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'keyExprChange' },
            { emit: 'noDataTextChange' },
            { emit: 'parentIdExprChange' },
            { emit: 'rootValueChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollDirectionChange' },
            { emit: 'searchEditorOptionsChange' },
            { emit: 'searchEnabledChange' },
            { emit: 'searchExprChange' },
            { emit: 'searchModeChange' },
            { emit: 'searchTimeoutChange' },
            { emit: 'searchValueChange' },
            { emit: 'selectAllTextChange' },
            { emit: 'selectByClickChange' },
            { emit: 'selectedExprChange' },
            { emit: 'selectionModeChange' },
            { emit: 'selectNodesRecursiveChange' },
            { emit: 'showCheckBoxesModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'useNativeScrollingChange' },
            { emit: 'virtualModeEnabledChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxTreeView(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
        this.setupChanges('searchExpr', changes);
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
    DxiItemModule,
    DxoSearchEditorOptionsModule,
    DxiButtonModule,
    DxoOptionsModule,
    DxiTreeViewButtonModule,
    DxiTreeViewItemModule,
    DxoTreeViewOptionsModule,
    DxoTreeViewSearchEditorOptionsModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxTreeViewComponent
  ],
  exports: [
    DxTreeViewComponent,
    DxiItemModule,
    DxoSearchEditorOptionsModule,
    DxiButtonModule,
    DxoOptionsModule,
    DxiTreeViewButtonModule,
    DxiTreeViewItemModule,
    DxoTreeViewOptionsModule,
    DxoTreeViewSearchEditorOptionsModule,
    DxTemplateModule
  ]
})
export class DxTreeViewModule { }

import type * as DxTreeViewTypes from "devextreme/ui/tree_view_types";
export { DxTreeViewTypes };


