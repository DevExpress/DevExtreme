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
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { Position, TabsIconPosition, TabsStyle } from 'devextreme/common';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { ContentReadyEvent, DisposingEvent, dxTabPanelItem, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent, SelectionChangedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from 'devextreme/ui/tab_panel';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiFormItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-form-tab-panel-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFormTabPanelOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get animationEnabled(): boolean {
        return this._getOption('animationEnabled');
    }
    set animationEnabled(value: boolean) {
        this._setOption('animationEnabled', value);
    }

    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<dxTabPanelItem | string | any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<dxTabPanelItem | string | any>) {
        this._setOption('dataSource', value);
    }

    @Input()
    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
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
    get iconPosition(): TabsIconPosition {
        return this._getOption('iconPosition');
    }
    set iconPosition(value: TabsIconPosition) {
        this._setOption('iconPosition', value);
    }

    @Input()
    get itemHoldTimeout(): number {
        return this._getOption('itemHoldTimeout');
    }
    set itemHoldTimeout(value: number) {
        this._setOption('itemHoldTimeout', value);
    }

    @Input()
    get items(): Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, tabTemplate?: any, template?: any, text?: string, title?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, tabTemplate?: any, template?: any, text?: string, title?: string, visible?: boolean }>) {
        this._setOption('items', value);
    }

    @Input()
    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }

    @Input()
    get itemTitleTemplate(): any {
        return this._getOption('itemTitleTemplate');
    }
    set itemTitleTemplate(value: any) {
        this._setOption('itemTitleTemplate', value);
    }

    @Input()
    get loop(): boolean {
        return this._getOption('loop');
    }
    set loop(value: boolean) {
        this._setOption('loop', value);
    }

    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }

    @Input()
    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
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
    get onItemClick(): ((e: ItemClickEvent) => void) {
        return this._getOption('onItemClick');
    }
    set onItemClick(value: ((e: ItemClickEvent) => void)) {
        this._setOption('onItemClick', value);
    }

    @Input()
    get onItemContextMenu(): ((e: ItemContextMenuEvent) => void) {
        return this._getOption('onItemContextMenu');
    }
    set onItemContextMenu(value: ((e: ItemContextMenuEvent) => void)) {
        this._setOption('onItemContextMenu', value);
    }

    @Input()
    get onItemHold(): ((e: ItemHoldEvent) => void) {
        return this._getOption('onItemHold');
    }
    set onItemHold(value: ((e: ItemHoldEvent) => void)) {
        this._setOption('onItemHold', value);
    }

    @Input()
    get onItemRendered(): ((e: ItemRenderedEvent) => void) {
        return this._getOption('onItemRendered');
    }
    set onItemRendered(value: ((e: ItemRenderedEvent) => void)) {
        this._setOption('onItemRendered', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onSelectionChanged(): ((e: SelectionChangedEvent) => void) {
        return this._getOption('onSelectionChanged');
    }
    set onSelectionChanged(value: ((e: SelectionChangedEvent) => void)) {
        this._setOption('onSelectionChanged', value);
    }

    @Input()
    get onSelectionChanging(): ((e: SelectionChangingEvent) => void) {
        return this._getOption('onSelectionChanging');
    }
    set onSelectionChanging(value: ((e: SelectionChangingEvent) => void)) {
        this._setOption('onSelectionChanging', value);
    }

    @Input()
    get onTitleClick(): ((e: TitleClickEvent) => void) {
        return this._getOption('onTitleClick');
    }
    set onTitleClick(value: ((e: TitleClickEvent) => void)) {
        this._setOption('onTitleClick', value);
    }

    @Input()
    get onTitleHold(): ((e: TitleHoldEvent) => void) {
        return this._getOption('onTitleHold');
    }
    set onTitleHold(value: ((e: TitleHoldEvent) => void)) {
        this._setOption('onTitleHold', value);
    }

    @Input()
    get onTitleRendered(): ((e: TitleRenderedEvent) => void) {
        return this._getOption('onTitleRendered');
    }
    set onTitleRendered(value: ((e: TitleRenderedEvent) => void)) {
        this._setOption('onTitleRendered', value);
    }

    @Input()
    get repaintChangesOnly(): boolean {
        return this._getOption('repaintChangesOnly');
    }
    set repaintChangesOnly(value: boolean) {
        this._setOption('repaintChangesOnly', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get scrollByContent(): boolean {
        return this._getOption('scrollByContent');
    }
    set scrollByContent(value: boolean) {
        this._setOption('scrollByContent', value);
    }

    @Input()
    get scrollingEnabled(): boolean {
        return this._getOption('scrollingEnabled');
    }
    set scrollingEnabled(value: boolean) {
        this._setOption('scrollingEnabled', value);
    }

    @Input()
    get selectedIndex(): number {
        return this._getOption('selectedIndex');
    }
    set selectedIndex(value: number) {
        this._setOption('selectedIndex', value);
    }

    @Input()
    get selectedItem(): any {
        return this._getOption('selectedItem');
    }
    set selectedItem(value: any) {
        this._setOption('selectedItem', value);
    }

    @Input()
    get showNavButtons(): boolean {
        return this._getOption('showNavButtons');
    }
    set showNavButtons(value: boolean) {
        this._setOption('showNavButtons', value);
    }

    @Input()
    get stylingMode(): TabsStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: TabsStyle) {
        this._setOption('stylingMode', value);
    }

    @Input()
    get swipeEnabled(): boolean {
        return this._getOption('swipeEnabled');
    }
    set swipeEnabled(value: boolean) {
        this._setOption('swipeEnabled', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get tabsPosition(): Position {
        return this._getOption('tabsPosition');
    }
    set tabsPosition(value: Position) {
        this._setOption('tabsPosition', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, tabTemplate?: any, template?: any, text?: string, title?: string, visible?: boolean }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemChange: EventEmitter<any>;
    protected get _optionPath() {
        return 'tabPanelOptions';
    }


    @ContentChildren(forwardRef(() => DxiFormItemComponent))
    get itemsChildren(): QueryList<DxiFormItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'itemsChange' },
            { emit: 'selectedIndexChange' },
            { emit: 'selectedItemChange' }
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
    DxoFormTabPanelOptionsComponent
  ],
  exports: [
    DxoFormTabPanelOptionsComponent
  ],
})
export class DxoFormTabPanelOptionsModule { }
