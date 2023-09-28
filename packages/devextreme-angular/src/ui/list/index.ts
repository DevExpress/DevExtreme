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
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';

export { ExplicitTypes } from 'devextreme/ui/list';

import DevExpress from 'devextreme/bundles/dx.all';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { ContentReadyEvent, DisposingEvent, GroupRenderedEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemDeletedEvent, ItemDeletingEvent, ItemHoldEvent, ItemRenderedEvent, ItemReorderedEvent, ItemSwipeEvent, OptionChangedEvent, PageLoadingEvent, PullRefreshEvent, ScrollEvent, SelectAllValueChangedEvent, SelectionChangedEvent } from 'devextreme/ui/list';
import { dxSortableOptions } from 'devextreme/ui/sortable';
import { Properties as dxTextBoxOptions } from 'devextreme/ui/text_box';

import DxList from 'devextreme/ui/list';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoItemDraggingModule } from 'devextreme-angular/ui/nested';
import { DxoCursorOffsetModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxiMenuItemModule } from 'devextreme-angular/ui/nested';
import { DxoSearchEditorOptionsModule } from 'devextreme-angular/ui/nested';
import { DxiButtonModule } from 'devextreme-angular/ui/nested';
import { DxoOptionsModule } from 'devextreme-angular/ui/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';
import { DxiMenuItemComponent } from 'devextreme-angular/ui/nested';



/**
 * [descr:dxList]

 */
@Component({
    selector: 'dx-list',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxListComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxList;

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
     * [descr:dxListOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxListOptions.allowItemDeleting]
    
     */
    @Input()
    get allowItemDeleting(): boolean {
        return this._getOption('allowItemDeleting');
    }
    set allowItemDeleting(value: boolean) {
        this._setOption('allowItemDeleting', value);
    }


    /**
     * [descr:dxListOptions.bounceEnabled]
    
     */
    @Input()
    get bounceEnabled(): boolean {
        return this._getOption('bounceEnabled');
    }
    set bounceEnabled(value: boolean) {
        this._setOption('bounceEnabled', value);
    }


    /**
     * [descr:dxListOptions.collapsibleGroups]
    
     */
    @Input()
    get collapsibleGroups(): boolean {
        return this._getOption('collapsibleGroups');
    }
    set collapsibleGroups(value: boolean) {
        this._setOption('collapsibleGroups', value);
    }


    /**
     * [descr:dxListOptions.dataSource]
    
     */
    @Input()
    get dataSource(): DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxListItem | any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxListItem | any>) {
        this._setOption('dataSource', value);
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
     * [descr:dxListOptions.displayExpr]
    
     */
    @Input()
    get displayExpr(): Function | string | undefined {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: Function | string | undefined) {
        this._setOption('displayExpr', value);
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
     * [descr:dxListOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxListOptions.grouped]
    
     */
    @Input()
    get grouped(): boolean {
        return this._getOption('grouped');
    }
    set grouped(value: boolean) {
        this._setOption('grouped', value);
    }


    /**
     * [descr:dxListOptions.groupTemplate]
    
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
     * [descr:dxListOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxListOptions.indicateLoading]
    
     */
    @Input()
    get indicateLoading(): boolean {
        return this._getOption('indicateLoading');
    }
    set indicateLoading(value: boolean) {
        this._setOption('indicateLoading', value);
    }


    /**
     * [descr:dxListOptions.itemDeleteMode]
    
     */
    @Input()
    get itemDeleteMode(): string {
        return this._getOption('itemDeleteMode');
    }
    set itemDeleteMode(value: string) {
        this._setOption('itemDeleteMode', value);
    }


    /**
     * [descr:dxListOptions.itemDragging]
    
     */
    @Input()
    get itemDragging(): dxSortableOptions {
        return this._getOption('itemDragging');
    }
    set itemDragging(value: dxSortableOptions) {
        this._setOption('itemDragging', value);
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
     * [descr:dxListOptions.items]
    
     */
    @Input()
    get items(): Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, key?: string, showChevron?: boolean, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, key?: string, showChevron?: boolean, template?: any, text?: string, visible?: boolean }>) {
        this._setOption('items', value);
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
     * [descr:CollectionWidgetOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:dxListOptions.menuItems]
    
     */
    @Input()
    get menuItems(): Array<any | { action?: Function, text?: string }> {
        return this._getOption('menuItems');
    }
    set menuItems(value: Array<any | { action?: Function, text?: string }>) {
        this._setOption('menuItems', value);
    }


    /**
     * [descr:dxListOptions.menuMode]
    
     */
    @Input()
    get menuMode(): string {
        return this._getOption('menuMode');
    }
    set menuMode(value: string) {
        this._setOption('menuMode', value);
    }


    /**
     * [descr:dxListOptions.nextButtonText]
    
     */
    @Input()
    get nextButtonText(): string {
        return this._getOption('nextButtonText');
    }
    set nextButtonText(value: string) {
        this._setOption('nextButtonText', value);
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
     * [descr:dxListOptions.pageLoadingText]
    
     */
    @Input()
    get pageLoadingText(): string {
        return this._getOption('pageLoadingText');
    }
    set pageLoadingText(value: string) {
        this._setOption('pageLoadingText', value);
    }


    /**
     * [descr:dxListOptions.pageLoadMode]
    
     */
    @Input()
    get pageLoadMode(): string {
        return this._getOption('pageLoadMode');
    }
    set pageLoadMode(value: string) {
        this._setOption('pageLoadMode', value);
    }


    /**
     * [descr:dxListOptions.pulledDownText]
    
     */
    @Input()
    get pulledDownText(): string {
        return this._getOption('pulledDownText');
    }
    set pulledDownText(value: string) {
        this._setOption('pulledDownText', value);
    }


    /**
     * [descr:dxListOptions.pullingDownText]
    
     */
    @Input()
    get pullingDownText(): string {
        return this._getOption('pullingDownText');
    }
    set pullingDownText(value: string) {
        this._setOption('pullingDownText', value);
    }


    /**
     * [descr:dxListOptions.pullRefreshEnabled]
    
     */
    @Input()
    get pullRefreshEnabled(): boolean {
        return this._getOption('pullRefreshEnabled');
    }
    set pullRefreshEnabled(value: boolean) {
        this._setOption('pullRefreshEnabled', value);
    }


    /**
     * [descr:dxListOptions.refreshingText]
    
     */
    @Input()
    get refreshingText(): string {
        return this._getOption('refreshingText');
    }
    set refreshingText(value: string) {
        this._setOption('refreshingText', value);
    }


    /**
     * [descr:dxListOptions.repaintChangesOnly]
    
     */
    @Input()
    get repaintChangesOnly(): boolean {
        return this._getOption('repaintChangesOnly');
    }
    set repaintChangesOnly(value: boolean) {
        this._setOption('repaintChangesOnly', value);
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
     * [descr:dxListOptions.scrollByContent]
    
     */
    @Input()
    get scrollByContent(): boolean {
        return this._getOption('scrollByContent');
    }
    set scrollByContent(value: boolean) {
        this._setOption('scrollByContent', value);
    }


    /**
     * [descr:dxListOptions.scrollByThumb]
    
     */
    @Input()
    get scrollByThumb(): boolean {
        return this._getOption('scrollByThumb');
    }
    set scrollByThumb(value: boolean) {
        this._setOption('scrollByThumb', value);
    }


    /**
     * [descr:dxListOptions.scrollingEnabled]
    
     */
    @Input()
    get scrollingEnabled(): boolean {
        return this._getOption('scrollingEnabled');
    }
    set scrollingEnabled(value: boolean) {
        this._setOption('scrollingEnabled', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchEditorOptions]
    
     */
    @Input()
    get searchEditorOptions(): dxTextBoxOptions {
        return this._getOption('searchEditorOptions');
    }
    set searchEditorOptions(value: dxTextBoxOptions) {
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
    get searchExpr(): Function | string | Array<Function | string> {
        return this._getOption('searchExpr');
    }
    set searchExpr(value: Function | string | Array<Function | string>) {
        this._setOption('searchExpr', value);
    }


    /**
     * [descr:SearchBoxMixinOptions.searchMode]
    
     */
    @Input()
    get searchMode(): string {
        return this._getOption('searchMode');
    }
    set searchMode(value: string) {
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
     * [descr:dxListOptions.selectAllMode]
    
     */
    @Input()
    get selectAllMode(): string {
        return this._getOption('selectAllMode');
    }
    set selectAllMode(value: string) {
        this._setOption('selectAllMode', value);
    }


    /**
     * [descr:dxListOptions.selectAllText]
    
     */
    @Input()
    get selectAllText(): string {
        return this._getOption('selectAllText');
    }
    set selectAllText(value: string) {
        this._setOption('selectAllText', value);
    }


    /**
     * [descr:dxListOptions.selectByClick]
    
     */
    @Input()
    get selectByClick(): boolean {
        return this._getOption('selectByClick');
    }
    set selectByClick(value: boolean) {
        this._setOption('selectByClick', value);
    }


    /**
     * [descr:CollectionWidgetOptions.selectedItemKeys]
    
     */
    @Input()
    get selectedItemKeys(): Array<any> {
        return this._getOption('selectedItemKeys');
    }
    set selectedItemKeys(value: Array<any>) {
        this._setOption('selectedItemKeys', value);
    }


    /**
     * [descr:CollectionWidgetOptions.selectedItems]
    
     */
    @Input()
    get selectedItems(): Array<any> {
        return this._getOption('selectedItems');
    }
    set selectedItems(value: Array<any>) {
        this._setOption('selectedItems', value);
    }


    /**
     * [descr:dxListOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): string {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: string) {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:dxListOptions.showScrollbar]
    
     */
    @Input()
    get showScrollbar(): string {
        return this._getOption('showScrollbar');
    }
    set showScrollbar(value: string) {
        this._setOption('showScrollbar', value);
    }


    /**
     * [descr:dxListOptions.showSelectionControls]
    
     */
    @Input()
    get showSelectionControls(): boolean {
        return this._getOption('showSelectionControls');
    }
    set showSelectionControls(value: boolean) {
        this._setOption('showSelectionControls', value);
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
     * [descr:dxListOptions.useNativeScrolling]
    
     */
    @Input()
    get useNativeScrolling(): boolean {
        return this._getOption('useNativeScrolling');
    }
    set useNativeScrolling(value: boolean) {
        this._setOption('useNativeScrolling', value);
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
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxListOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxListOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxListOptions.onGroupRendered]
    
    
     */
    @Output() onGroupRendered: EventEmitter<GroupRenderedEvent>;

    /**
    
     * [descr:dxListOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxListOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxListOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxListOptions.onItemDeleted]
    
    
     */
    @Output() onItemDeleted: EventEmitter<ItemDeletedEvent>;

    /**
    
     * [descr:dxListOptions.onItemDeleting]
    
    
     */
    @Output() onItemDeleting: EventEmitter<ItemDeletingEvent>;

    /**
    
     * [descr:dxListOptions.onItemHold]
    
    
     */
    @Output() onItemHold: EventEmitter<ItemHoldEvent>;

    /**
    
     * [descr:dxListOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxListOptions.onItemReordered]
    
    
     */
    @Output() onItemReordered: EventEmitter<ItemReorderedEvent>;

    /**
    
     * [descr:dxListOptions.onItemSwipe]
    
    
     */
    @Output() onItemSwipe: EventEmitter<ItemSwipeEvent>;

    /**
    
     * [descr:dxListOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxListOptions.onPageLoading]
    
    
     */
    @Output() onPageLoading: EventEmitter<PageLoadingEvent>;

    /**
    
     * [descr:dxListOptions.onPullRefresh]
    
    
     */
    @Output() onPullRefresh: EventEmitter<PullRefreshEvent>;

    /**
    
     * [descr:dxListOptions.onScroll]
    
    
     */
    @Output() onScroll: EventEmitter<ScrollEvent>;

    /**
    
     * [descr:dxListOptions.onSelectAllValueChanged]
    
    
     */
    @Output() onSelectAllValueChanged: EventEmitter<SelectAllValueChangedEvent>;

    /**
    
     * [descr:dxListOptions.onSelectionChanged]
    
    
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
    @Output() allowItemDeletingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() bounceEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() collapsibleGroupsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxListItem | any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() displayExprChange: EventEmitter<Function | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

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
    @Output() indicateLoadingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemDeleteModeChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemDraggingChange: EventEmitter<dxSortableOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemHoldTimeoutChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, key?: string, showChevron?: boolean, template?: any, text?: string, visible?: boolean }>>;

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
    @Output() menuItemsChange: EventEmitter<Array<any | { action?: Function, text?: string }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() menuModeChange: EventEmitter<string>;

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
    @Output() pageLoadingTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageLoadModeChange: EventEmitter<string>;

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
    @Output() repaintChangesOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollByContentChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollByThumbChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchEditorOptionsChange: EventEmitter<dxTextBoxOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchExprChange: EventEmitter<Function | string | Array<Function | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchModeChange: EventEmitter<string>;

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
    @Output() selectAllModeChange: EventEmitter<string>;

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
    @Output() selectedItemKeysChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemsChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showScrollbarChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showSelectionControlsChange: EventEmitter<boolean>;

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
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;




    @ContentChildren(DxiItemComponent)
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(DxiMenuItemComponent)
    get menuItemsChildren(): QueryList<DxiMenuItemComponent> {
        return this._getOption('menuItems');
    }
    set menuItemsChildren(value) {
        this.setChildren('menuItems', value);
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
            { subscribe: 'groupRendered', emit: 'onGroupRendered' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
            { subscribe: 'itemDeleted', emit: 'onItemDeleted' },
            { subscribe: 'itemDeleting', emit: 'onItemDeleting' },
            { subscribe: 'itemHold', emit: 'onItemHold' },
            { subscribe: 'itemRendered', emit: 'onItemRendered' },
            { subscribe: 'itemReordered', emit: 'onItemReordered' },
            { subscribe: 'itemSwipe', emit: 'onItemSwipe' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'pageLoading', emit: 'onPageLoading' },
            { subscribe: 'pullRefresh', emit: 'onPullRefresh' },
            { subscribe: 'scroll', emit: 'onScroll' },
            { subscribe: 'selectAllValueChanged', emit: 'onSelectAllValueChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowItemDeletingChange' },
            { emit: 'bounceEnabledChange' },
            { emit: 'collapsibleGroupsChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'displayExprChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'groupedChange' },
            { emit: 'groupTemplateChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'indicateLoadingChange' },
            { emit: 'itemDeleteModeChange' },
            { emit: 'itemDraggingChange' },
            { emit: 'itemHoldTimeoutChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'keyExprChange' },
            { emit: 'menuItemsChange' },
            { emit: 'menuModeChange' },
            { emit: 'nextButtonTextChange' },
            { emit: 'noDataTextChange' },
            { emit: 'pageLoadingTextChange' },
            { emit: 'pageLoadModeChange' },
            { emit: 'pulledDownTextChange' },
            { emit: 'pullingDownTextChange' },
            { emit: 'pullRefreshEnabledChange' },
            { emit: 'refreshingTextChange' },
            { emit: 'repaintChangesOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollByContentChange' },
            { emit: 'scrollByThumbChange' },
            { emit: 'scrollingEnabledChange' },
            { emit: 'searchEditorOptionsChange' },
            { emit: 'searchEnabledChange' },
            { emit: 'searchExprChange' },
            { emit: 'searchModeChange' },
            { emit: 'searchTimeoutChange' },
            { emit: 'searchValueChange' },
            { emit: 'selectAllModeChange' },
            { emit: 'selectAllTextChange' },
            { emit: 'selectByClickChange' },
            { emit: 'selectedItemKeysChange' },
            { emit: 'selectedItemsChange' },
            { emit: 'selectionModeChange' },
            { emit: 'showScrollbarChange' },
            { emit: 'showSelectionControlsChange' },
            { emit: 'tabIndexChange' },
            { emit: 'useNativeScrollingChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxList(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
        this.setupChanges('menuItems', changes);
        this.setupChanges('searchExpr', changes);
        this.setupChanges('selectedItemKeys', changes);
        this.setupChanges('selectedItems', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
        this._idh.doCheck('items');
        this._idh.doCheck('menuItems');
        this._idh.doCheck('searchExpr');
        this._idh.doCheck('selectedItemKeys');
        this._idh.doCheck('selectedItems');
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
    DxoItemDraggingModule,
    DxoCursorOffsetModule,
    DxiItemModule,
    DxiMenuItemModule,
    DxoSearchEditorOptionsModule,
    DxiButtonModule,
    DxoOptionsModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxListComponent
  ],
  exports: [
    DxListComponent,
    DxoItemDraggingModule,
    DxoCursorOffsetModule,
    DxiItemModule,
    DxiMenuItemModule,
    DxoSearchEditorOptionsModule,
    DxiButtonModule,
    DxoOptionsModule,
    DxTemplateModule
  ]
})
export class DxListModule { }

import type * as DxListTypes from "devextreme/ui/list_types";
export { DxListTypes };


