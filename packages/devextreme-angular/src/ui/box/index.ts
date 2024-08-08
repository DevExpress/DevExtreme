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

export { ExplicitTypes } from 'devextreme/ui/box';

import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { BoxDirection, ContentReadyEvent, CrosswiseDistribution, DisposingEvent, Distribution, dxBoxItem, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent, Properties as dxBoxOptions } from 'devextreme/ui/box';

import DxBox from 'devextreme/ui/box';


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
import { DxoBoxModule } from 'devextreme-angular/ui/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';



/**
 * [descr:dxBox]

 */
@Component({
    selector: 'dx-box',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxBoxComponent<TItem = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxBox<TItem, TKey> = null;

    /**
     * [descr:dxBoxOptions.align]
    
     */
    @Input()
    get align(): Distribution {
        return this._getOption('align');
    }
    set align(value: Distribution) {
        this._setOption('align', value);
    }


    /**
     * [descr:dxBoxOptions.crossAlign]
    
     */
    @Input()
    get crossAlign(): CrosswiseDistribution {
        return this._getOption('crossAlign');
    }
    set crossAlign(value: CrosswiseDistribution) {
        this._setOption('crossAlign', value);
    }


    /**
     * [descr:dxBoxOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<dxBoxItem | string | any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<dxBoxItem | string | any>) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxBoxOptions.direction]
    
     */
    @Input()
    get direction(): BoxDirection {
        return this._getOption('direction');
    }
    set direction(value: BoxDirection) {
        this._setOption('direction', value);
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
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
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
     * [descr:dxBoxOptions.items]
    
     */
    @Input()
    get items(): Array<string | any | { baseSize?: number | string, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<string | any | { baseSize?: number | string, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }>) {
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
    
     * [descr:dxBoxOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxBoxOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxBoxOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxBoxOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxBoxOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxBoxOptions.onItemHold]
    
    
     */
    @Output() onItemHold: EventEmitter<ItemHoldEvent>;

    /**
    
     * [descr:dxBoxOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxBoxOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() alignChange: EventEmitter<Distribution>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() crossAlignChange: EventEmitter<CrosswiseDistribution>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Store | DataSource | DataSourceOptions | null | string | Array<dxBoxItem | string | any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() directionChange: EventEmitter<BoxDirection>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string | undefined>;

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
    @Output() itemsChange: EventEmitter<Array<string | any | { baseSize?: number | string, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

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
            { emit: 'alignChange' },
            { emit: 'crossAlignChange' },
            { emit: 'dataSourceChange' },
            { emit: 'directionChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'heightChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemHoldTimeoutChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxBox(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
        this._idh.doCheck('items');
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
    DxoBoxModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxBoxComponent
  ],
  exports: [
    DxBoxComponent,
    DxiItemModule,
    DxoBoxModule,
    DxTemplateModule
  ]
})
export class DxBoxModule { }

import type * as DxBoxTypes from "devextreme/ui/box_types";
export { DxBoxTypes };


