/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,
    SkipSelf,
    Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import DataSource from 'devextreme/data/data_source';
import { dxTabPanelItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent, SelectionChangedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from 'devextreme/ui/tab_panel';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-form-tab-panel-options',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoFormTabPanelOptionsComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get accessKey(): string {
        return this._getOption('accessKey');
    }
    set accessKey(value: string) {
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
    get bindingOptions(): Record<string, any> {
        return this._getOption('bindingOptions');
    }
    set bindingOptions(value: Record<string, any>) {
        this._setOption('bindingOptions', value);
    }

    @Input()
    get dataSource(): Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string) {
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
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
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
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }

    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
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
    get iconPosition(): "top" | "end" | "bottom" | "start" {
        return this._getOption('iconPosition');
    }
    set iconPosition(value: "top" | "end" | "bottom" | "start") {
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
    get items(): Array<any | dxTabPanelItem | string> {
        return this._getOption('items');
    }
    set items(value: Array<any | dxTabPanelItem | string>) {
        this._setOption('items', value);
    }

    @Input()
    get itemTemplate(): ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template) {
        this._setOption('itemTemplate', value);
    }

    @Input()
    get itemTitleTemplate(): ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template {
        return this._getOption('itemTitleTemplate');
    }
    set itemTitleTemplate(value: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template) {
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
    get stylingMode(): "primary" | "secondary" {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: "primary" | "secondary") {
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
    get tabsPosition(): "bottom" | "left" | "right" | "top" {
        return this._getOption('tabsPosition');
    }
    set tabsPosition(value: "bottom" | "left" | "right" | "top") {
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
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'tabPanelOptions';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost,
            private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            @Host() templateHost: DxTemplateHost,
            private element: ElementRef) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        templateHost.setHost(this);
    }

    setTemplate(template: DxTemplateDirective) {
        this.template = template;
    }
    ngAfterViewInit() {
        extractTemplate(this, this.element, this.renderer, this.document);
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
