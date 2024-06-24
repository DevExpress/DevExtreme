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




import { Orientation } from 'devextreme/common';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { ContentReadyEvent, DisposingEvent, dxSplitterItem, InitializedEvent, ItemClickEvent, ItemCollapsedEvent, ItemContextMenuEvent, ItemExpandedEvent, ItemRenderedEvent, OptionChangedEvent, Properties as dxSplitterOptions, ResizeEndEvent, ResizeEvent, ResizeStartEvent } from 'devextreme/ui/splitter';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-splitter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSplitterComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowKeyboardNavigation(): boolean {
        return this._getOption('allowKeyboardNavigation');
    }
    set allowKeyboardNavigation(value: boolean) {
        this._setOption('allowKeyboardNavigation', value);
    }

    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<dxSplitterItem> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<dxSplitterItem>) {
        this._setOption('dataSource', value);
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
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    @Input()
    get items(): Array<any | { collapsed?: boolean, collapsedSize?: number | string | undefined, collapsible?: boolean, maxSize?: number | string | undefined, minSize?: number | string | undefined, resizable?: boolean, size?: number | string | undefined, splitter?: dxSplitterOptions | undefined, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<any | { collapsed?: boolean, collapsedSize?: number | string | undefined, collapsible?: boolean, maxSize?: number | string | undefined, minSize?: number | string | undefined, resizable?: boolean, size?: number | string | undefined, splitter?: dxSplitterOptions | undefined, template?: any, text?: string, visible?: boolean }>) {
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
    get onItemCollapsed(): ((e: ItemCollapsedEvent) => void) {
        return this._getOption('onItemCollapsed');
    }
    set onItemCollapsed(value: ((e: ItemCollapsedEvent) => void)) {
        this._setOption('onItemCollapsed', value);
    }

    @Input()
    get onItemContextMenu(): ((e: ItemContextMenuEvent) => void) {
        return this._getOption('onItemContextMenu');
    }
    set onItemContextMenu(value: ((e: ItemContextMenuEvent) => void)) {
        this._setOption('onItemContextMenu', value);
    }

    @Input()
    get onItemExpanded(): ((e: ItemExpandedEvent) => void) {
        return this._getOption('onItemExpanded');
    }
    set onItemExpanded(value: ((e: ItemExpandedEvent) => void)) {
        this._setOption('onItemExpanded', value);
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
    get onResize(): ((e: ResizeEvent) => void) {
        return this._getOption('onResize');
    }
    set onResize(value: ((e: ResizeEvent) => void)) {
        this._setOption('onResize', value);
    }

    @Input()
    get onResizeEnd(): ((e: ResizeEndEvent) => void) {
        return this._getOption('onResizeEnd');
    }
    set onResizeEnd(value: ((e: ResizeEndEvent) => void)) {
        this._setOption('onResizeEnd', value);
    }

    @Input()
    get onResizeStart(): ((e: ResizeStartEvent) => void) {
        return this._getOption('onResizeStart');
    }
    set onResizeStart(value: ((e: ResizeStartEvent) => void)) {
        this._setOption('onResizeStart', value);
    }

    @Input()
    get orientation(): Orientation {
        return this._getOption('orientation');
    }
    set orientation(value: Orientation) {
        this._setOption('orientation', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get separatorSize(): number {
        return this._getOption('separatorSize');
    }
    set separatorSize(value: number) {
        this._setOption('separatorSize', value);
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
    @Output() itemsChange: EventEmitter<Array<any | { collapsed?: boolean, collapsedSize?: number | string | undefined, collapsible?: boolean, maxSize?: number | string | undefined, minSize?: number | string | undefined, resizable?: boolean, size?: number | string | undefined, splitter?: dxSplitterOptions | undefined, template?: any, text?: string, visible?: boolean }>>;
    protected get _optionPath() {
        return 'splitter';
    }


    @ContentChildren(forwardRef(() => DxiItemComponent))
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'itemsChange' }
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
    DxoSplitterComponent
  ],
  exports: [
    DxoSplitterComponent
  ],
})
export class DxoSplitterModule { }
