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

export { ExplicitTypes } from 'devextreme/ui/responsive_box';

import DataSource from 'devextreme/data/data_source';
import { dxResponsiveBoxItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent } from 'devextreme/ui/responsive_box';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';

import DxResponsiveBox from 'devextreme/ui/responsive_box';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiColModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxiLocationModule } from 'devextreme-angular/ui/nested';
import { DxiRowModule } from 'devextreme-angular/ui/nested';

import { DxiResponsiveBoxColModule } from 'devextreme-angular/ui/responsive-box/nested';
import { DxiResponsiveBoxItemModule } from 'devextreme-angular/ui/responsive-box/nested';
import { DxiResponsiveBoxLocationModule } from 'devextreme-angular/ui/responsive-box/nested';
import { DxiResponsiveBoxRowModule } from 'devextreme-angular/ui/responsive-box/nested';

import { DxiColComponent } from 'devextreme-angular/ui/nested';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';
import { DxiRowComponent } from 'devextreme-angular/ui/nested';

import { DxiResponsiveBoxColComponent } from 'devextreme-angular/ui/responsive-box/nested';
import { DxiResponsiveBoxItemComponent } from 'devextreme-angular/ui/responsive-box/nested';
import { DxiResponsiveBoxRowComponent } from 'devextreme-angular/ui/responsive-box/nested';


/**
 * [descr:dxResponsiveBox]

 */
@Component({
    selector: 'dx-responsive-box',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxResponsiveBoxComponent<TItem = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxResponsiveBox<TItem, TKey> = null;

    /**
     * [descr:dxResponsiveBoxOptions.cols]
    
     */
    @Input()
    get cols(): { baseSize?: number | string, ratio?: number, screen?: string | undefined, shrink?: number }[] {
        return this._getOption('cols');
    }
    set cols(value: { baseSize?: number | string, ratio?: number, screen?: string | undefined, shrink?: number }[]) {
        this._setOption('cols', value);
    }


    /**
     * [descr:dxResponsiveBoxOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any | dxResponsiveBoxItem | string> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any | dxResponsiveBoxItem | string> | DataSource | DataSourceOptions | null | Store | string) {
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
     * [descr:dxResponsiveBoxOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:WidgetOptions.hoverStateEnabled]
    
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
     * [descr:dxResponsiveBoxOptions.items]
    
     */
    @Input()
    get items(): Array<any | dxResponsiveBoxItem | string> {
        return this._getOption('items');
    }
    set items(value: Array<any | dxResponsiveBoxItem | string>) {
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
     * [descr:dxResponsiveBoxOptions.rows]
    
     */
    @Input()
    get rows(): { baseSize?: number | string, ratio?: number, screen?: string | undefined, shrink?: number }[] {
        return this._getOption('rows');
    }
    set rows(value: { baseSize?: number | string, ratio?: number, screen?: string | undefined, shrink?: number }[]) {
        this._setOption('rows', value);
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
     * [descr:dxResponsiveBoxOptions.screenByWidth]
    
     */
    @Input()
    get screenByWidth(): Function {
        return this._getOption('screenByWidth');
    }
    set screenByWidth(value: Function) {
        this._setOption('screenByWidth', value);
    }


    /**
     * [descr:dxResponsiveBoxOptions.singleColumnScreen]
    
     */
    @Input()
    get singleColumnScreen(): string {
        return this._getOption('singleColumnScreen');
    }
    set singleColumnScreen(value: string) {
        this._setOption('singleColumnScreen', value);
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
     * [descr:dxResponsiveBoxOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxResponsiveBoxOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onItemHold]
    
    
     */
    @Output() onItemHold: EventEmitter<ItemHoldEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxResponsiveBoxOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colsChange: EventEmitter<{ baseSize?: number | string, ratio?: number, screen?: string | undefined, shrink?: number }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any | dxResponsiveBoxItem | string> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

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
    @Output() itemsChange: EventEmitter<Array<any | dxResponsiveBoxItem | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowsChange: EventEmitter<{ baseSize?: number | string, ratio?: number, screen?: string | undefined, shrink?: number }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() screenByWidthChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() singleColumnScreenChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;




    @ContentChildren(DxiResponsiveBoxColComponent)
    get colsChildren(): QueryList<DxiResponsiveBoxColComponent> {
        return this._getOption('cols');
    }
    set colsChildren(value) {
        this._setChildren('cols', value, 'DxiResponsiveBoxColComponent');
    }

    @ContentChildren(DxiResponsiveBoxItemComponent)
    get itemsChildren(): QueryList<DxiResponsiveBoxItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiResponsiveBoxItemComponent');
    }

    @ContentChildren(DxiResponsiveBoxRowComponent)
    get rowsChildren(): QueryList<DxiResponsiveBoxRowComponent> {
        return this._getOption('rows');
    }
    set rowsChildren(value) {
        this._setChildren('rows', value, 'DxiResponsiveBoxRowComponent');
    }


    @ContentChildren(DxiColComponent)
    get colsLegacyChildren(): QueryList<DxiColComponent> {
        return this._getOption('cols');
    }
    set colsLegacyChildren(value) {
        this._setChildren('cols', value, 'DxiColComponent');
    }

    @ContentChildren(DxiItemComponent)
    get itemsLegacyChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsLegacyChildren(value) {
        this._setChildren('items', value, 'DxiItemComponent');
    }

    @ContentChildren(DxiRowComponent)
    get rowsLegacyChildren(): QueryList<DxiRowComponent> {
        return this._getOption('rows');
    }
    set rowsLegacyChildren(value) {
        this._setChildren('rows', value, 'DxiRowComponent');
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
            { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
            { subscribe: 'itemHold', emit: 'onItemHold' },
            { subscribe: 'itemRendered', emit: 'onItemRendered' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'colsChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'heightChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemHoldTimeoutChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'rowsChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'screenByWidthChange' },
            { emit: 'singleColumnScreenChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxResponsiveBox(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('cols', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
        this.setupChanges('rows', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('cols');
        this._idh.doCheck('dataSource');
        this._idh.doCheck('items');
        this._idh.doCheck('rows');
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
    DxiColModule,
    DxiItemModule,
    DxiLocationModule,
    DxiRowModule,
    DxiResponsiveBoxColModule,
    DxiResponsiveBoxItemModule,
    DxiResponsiveBoxLocationModule,
    DxiResponsiveBoxRowModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxResponsiveBoxComponent
  ],
  exports: [
    DxResponsiveBoxComponent,
    DxiColModule,
    DxiItemModule,
    DxiLocationModule,
    DxiRowModule,
    DxiResponsiveBoxColModule,
    DxiResponsiveBoxItemModule,
    DxiResponsiveBoxLocationModule,
    DxiResponsiveBoxRowModule,
    DxTemplateModule
  ]
})
export class DxResponsiveBoxModule { }

import type * as DxResponsiveBoxTypes from "devextreme/ui/responsive_box_types";
export { DxResponsiveBoxTypes };


