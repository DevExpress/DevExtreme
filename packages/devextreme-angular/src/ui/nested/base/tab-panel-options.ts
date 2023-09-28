/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { Position, TabsIconPosition, TabsStyle } from 'devextreme/common';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent, SelectionChangedEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from 'devextreme/ui/tab_panel';

@Component({
    template: ''
})
export abstract class DxoTabPanelOptions extends NestedOption {
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    get animationEnabled(): boolean {
        return this._getOption('animationEnabled');
    }
    set animationEnabled(value: boolean) {
        this._setOption('animationEnabled', value);
    }

    get dataSource(): DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxTabPanelItem | any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxTabPanelItem | any>) {
        this._setOption('dataSource', value);
    }

    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    get iconPosition(): TabsIconPosition {
        return this._getOption('iconPosition');
    }
    set iconPosition(value: TabsIconPosition) {
        this._setOption('iconPosition', value);
    }

    get itemHoldTimeout(): number {
        return this._getOption('itemHoldTimeout');
    }
    set itemHoldTimeout(value: number) {
        this._setOption('itemHoldTimeout', value);
    }

    get items(): Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, tabTemplate?: any, template?: any, text?: string, title?: string }> {
        return this._getOption('items');
    }
    set items(value: Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, tabTemplate?: any, template?: any, text?: string, title?: string }>) {
        this._setOption('items', value);
    }

    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }

    get itemTitleTemplate(): any {
        return this._getOption('itemTitleTemplate');
    }
    set itemTitleTemplate(value: any) {
        this._setOption('itemTitleTemplate', value);
    }

    get loop(): boolean {
        return this._getOption('loop');
    }
    set loop(value: boolean) {
        this._setOption('loop', value);
    }

    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }

    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    get onItemClick(): ((e: ItemClickEvent) => void) {
        return this._getOption('onItemClick');
    }
    set onItemClick(value: ((e: ItemClickEvent) => void)) {
        this._setOption('onItemClick', value);
    }

    get onItemContextMenu(): ((e: ItemContextMenuEvent) => void) {
        return this._getOption('onItemContextMenu');
    }
    set onItemContextMenu(value: ((e: ItemContextMenuEvent) => void)) {
        this._setOption('onItemContextMenu', value);
    }

    get onItemHold(): ((e: ItemHoldEvent) => void) {
        return this._getOption('onItemHold');
    }
    set onItemHold(value: ((e: ItemHoldEvent) => void)) {
        this._setOption('onItemHold', value);
    }

    get onItemRendered(): ((e: ItemRenderedEvent) => void) {
        return this._getOption('onItemRendered');
    }
    set onItemRendered(value: ((e: ItemRenderedEvent) => void)) {
        this._setOption('onItemRendered', value);
    }

    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    get onSelectionChanged(): ((e: SelectionChangedEvent) => void) {
        return this._getOption('onSelectionChanged');
    }
    set onSelectionChanged(value: ((e: SelectionChangedEvent) => void)) {
        this._setOption('onSelectionChanged', value);
    }

    get onTitleClick(): ((e: TitleClickEvent) => void) {
        return this._getOption('onTitleClick');
    }
    set onTitleClick(value: ((e: TitleClickEvent) => void)) {
        this._setOption('onTitleClick', value);
    }

    get onTitleHold(): ((e: TitleHoldEvent) => void) {
        return this._getOption('onTitleHold');
    }
    set onTitleHold(value: ((e: TitleHoldEvent) => void)) {
        this._setOption('onTitleHold', value);
    }

    get onTitleRendered(): ((e: TitleRenderedEvent) => void) {
        return this._getOption('onTitleRendered');
    }
    set onTitleRendered(value: ((e: TitleRenderedEvent) => void)) {
        this._setOption('onTitleRendered', value);
    }

    get repaintChangesOnly(): boolean {
        return this._getOption('repaintChangesOnly');
    }
    set repaintChangesOnly(value: boolean) {
        this._setOption('repaintChangesOnly', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get scrollByContent(): boolean {
        return this._getOption('scrollByContent');
    }
    set scrollByContent(value: boolean) {
        this._setOption('scrollByContent', value);
    }

    get scrollingEnabled(): boolean {
        return this._getOption('scrollingEnabled');
    }
    set scrollingEnabled(value: boolean) {
        this._setOption('scrollingEnabled', value);
    }

    get selectedIndex(): number {
        return this._getOption('selectedIndex');
    }
    set selectedIndex(value: number) {
        this._setOption('selectedIndex', value);
    }

    get selectedItem(): any {
        return this._getOption('selectedItem');
    }
    set selectedItem(value: any) {
        this._setOption('selectedItem', value);
    }

    get showNavButtons(): boolean {
        return this._getOption('showNavButtons');
    }
    set showNavButtons(value: boolean) {
        this._setOption('showNavButtons', value);
    }

    get stylingMode(): TabsStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: TabsStyle) {
        this._setOption('stylingMode', value);
    }

    get swipeEnabled(): boolean {
        return this._getOption('swipeEnabled');
    }
    set swipeEnabled(value: boolean) {
        this._setOption('swipeEnabled', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get tabsPosition(): Position {
        return this._getOption('tabsPosition');
    }
    set tabsPosition(value: Position) {
        this._setOption('tabsPosition', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }
}
