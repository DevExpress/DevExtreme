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


import { ClickEvent, DisposingEvent, InitializedEvent, MapProvider, MapType, MarkerAddedEvent, MarkerRemovedEvent, OptionChangedEvent, ReadyEvent, RouteAddedEvent, RouteMode, RouteRemovedEvent } from 'devextreme/ui/map';

import DxMap from 'devextreme/ui/map';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoApiKeyModule } from 'devextreme-angular/ui/nested';
import { DxiCenterModule } from 'devextreme-angular/ui/nested';
import { DxiMarkerModule } from 'devextreme-angular/ui/nested';
import { DxiLocationModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxiRouteModule } from 'devextreme-angular/ui/nested';

import { DxiCenterComponent } from 'devextreme-angular/ui/nested';
import { DxiMarkerComponent } from 'devextreme-angular/ui/nested';
import { DxiRouteComponent } from 'devextreme-angular/ui/nested';



/**
 * [descr:dxMap]

 */
@Component({
    selector: 'dx-map',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxMapComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxMap = null;

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
     * [descr:dxMapOptions.apiKey]
    
     */
    @Input()
    get apiKey(): string | { bing?: string, google?: string, googleStatic?: string } {
        return this._getOption('apiKey');
    }
    set apiKey(value: string | { bing?: string, google?: string, googleStatic?: string }) {
        this._setOption('apiKey', value);
    }


    /**
     * [descr:dxMapOptions.autoAdjust]
    
     */
    @Input()
    get autoAdjust(): boolean {
        return this._getOption('autoAdjust');
    }
    set autoAdjust(value: boolean) {
        this._setOption('autoAdjust', value);
    }


    /**
     * [descr:dxMapOptions.center]
    
     */
    @Input()
    get center(): string | Array<number | { lat?: number, lng?: number }> {
        return this._getOption('center');
    }
    set center(value: string | Array<number | { lat?: number, lng?: number }>) {
        this._setOption('center', value);
    }


    /**
     * [descr:dxMapOptions.controls]
    
     */
    @Input()
    get controls(): boolean {
        return this._getOption('controls');
    }
    set controls(value: boolean) {
        this._setOption('controls', value);
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
     * [descr:dxMapOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxMapOptions.height]
    
     */
    @Input()
    get height(): number | Function | string {
        return this._getOption('height');
    }
    set height(value: number | Function | string) {
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
     * [descr:dxMapOptions.markerIconSrc]
    
     */
    @Input()
    get markerIconSrc(): string {
        return this._getOption('markerIconSrc');
    }
    set markerIconSrc(value: string) {
        this._setOption('markerIconSrc', value);
    }


    /**
     * [descr:dxMapOptions.markers]
    
     */
    @Input()
    get markers(): Array<any | { iconSrc?: string, location?: string | Array<number | { lat?: number, lng?: number }>, onClick?: Function, tooltip?: string | { isShown?: boolean, text?: string } }> {
        return this._getOption('markers');
    }
    set markers(value: Array<any | { iconSrc?: string, location?: string | Array<number | { lat?: number, lng?: number }>, onClick?: Function, tooltip?: string | { isShown?: boolean, text?: string } }>) {
        this._setOption('markers', value);
    }


    /**
     * [descr:dxMapOptions.provider]
    
     */
    @Input()
    get provider(): MapProvider {
        return this._getOption('provider');
    }
    set provider(value: MapProvider) {
        this._setOption('provider', value);
    }


    /**
     * [descr:dxMapOptions.routes]
    
     */
    @Input()
    get routes(): Array<any | { color?: string, locations?: Array<any | { lat?: number, lng?: number }>, mode?: RouteMode, opacity?: number, weight?: number }> {
        return this._getOption('routes');
    }
    set routes(value: Array<any | { color?: string, locations?: Array<any | { lat?: number, lng?: number }>, mode?: RouteMode, opacity?: number, weight?: number }>) {
        this._setOption('routes', value);
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
     * [descr:dxMapOptions.type]
    
     */
    @Input()
    get type(): MapType {
        return this._getOption('type');
    }
    set type(value: MapType) {
        this._setOption('type', value);
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
     * [descr:dxMapOptions.width]
    
     */
    @Input()
    get width(): number | Function | string {
        return this._getOption('width');
    }
    set width(value: number | Function | string) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxMapOptions.zoom]
    
     */
    @Input()
    get zoom(): number {
        return this._getOption('zoom');
    }
    set zoom(value: number) {
        this._setOption('zoom', value);
    }

    /**
    
     * [descr:dxMapOptions.onClick]
    
    
     */
    @Output() onClick: EventEmitter<ClickEvent>;

    /**
    
     * [descr:dxMapOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxMapOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxMapOptions.onMarkerAdded]
    
    
     */
    @Output() onMarkerAdded: EventEmitter<MarkerAddedEvent>;

    /**
    
     * [descr:dxMapOptions.onMarkerRemoved]
    
    
     */
    @Output() onMarkerRemoved: EventEmitter<MarkerRemovedEvent>;

    /**
    
     * [descr:dxMapOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxMapOptions.onReady]
    
    
     */
    @Output() onReady: EventEmitter<ReadyEvent>;

    /**
    
     * [descr:dxMapOptions.onRouteAdded]
    
    
     */
    @Output() onRouteAdded: EventEmitter<RouteAddedEvent>;

    /**
    
     * [descr:dxMapOptions.onRouteRemoved]
    
    
     */
    @Output() onRouteRemoved: EventEmitter<RouteRemovedEvent>;

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
    @Output() apiKeyChange: EventEmitter<string | { bing?: string, google?: string, googleStatic?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() autoAdjustChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() centerChange: EventEmitter<string | Array<number | { lat?: number, lng?: number }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() controlsChange: EventEmitter<boolean>;

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
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string>;

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
    @Output() markerIconSrcChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() markersChange: EventEmitter<Array<any | { iconSrc?: string, location?: string | Array<number | { lat?: number, lng?: number }>, onClick?: Function, tooltip?: string | { isShown?: boolean, text?: string } }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() providerChange: EventEmitter<MapProvider>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() routesChange: EventEmitter<Array<any | { color?: string, locations?: Array<any | { lat?: number, lng?: number }>, mode?: RouteMode, opacity?: number, weight?: number }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() typeChange: EventEmitter<MapType>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomChange: EventEmitter<number>;




    @ContentChildren(DxiCenterComponent)
    get centerChildren(): QueryList<DxiCenterComponent> {
        return this._getOption('center');
    }
    set centerChildren(value) {
        this.setChildren('center', value);
    }

    @ContentChildren(DxiMarkerComponent)
    get markersChildren(): QueryList<DxiMarkerComponent> {
        return this._getOption('markers');
    }
    set markersChildren(value) {
        this.setChildren('markers', value);
    }

    @ContentChildren(DxiRouteComponent)
    get routesChildren(): QueryList<DxiRouteComponent> {
        return this._getOption('routes');
    }
    set routesChildren(value) {
        this.setChildren('routes', value);
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'click', emit: 'onClick' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'markerAdded', emit: 'onMarkerAdded' },
            { subscribe: 'markerRemoved', emit: 'onMarkerRemoved' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'ready', emit: 'onReady' },
            { subscribe: 'routeAdded', emit: 'onRouteAdded' },
            { subscribe: 'routeRemoved', emit: 'onRouteRemoved' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'apiKeyChange' },
            { emit: 'autoAdjustChange' },
            { emit: 'centerChange' },
            { emit: 'controlsChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'markerIconSrcChange' },
            { emit: 'markersChange' },
            { emit: 'providerChange' },
            { emit: 'routesChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'tabIndexChange' },
            { emit: 'typeChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'zoomChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxMap(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('center', changes);
        this.setupChanges('markers', changes);
        this.setupChanges('routes', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('center');
        this._idh.doCheck('markers');
        this._idh.doCheck('routes');
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
    DxoApiKeyModule,
    DxiCenterModule,
    DxiMarkerModule,
    DxiLocationModule,
    DxoTooltipModule,
    DxiRouteModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxMapComponent
  ],
  exports: [
    DxMapComponent,
    DxoApiKeyModule,
    DxiCenterModule,
    DxiMarkerModule,
    DxiLocationModule,
    DxoTooltipModule,
    DxiRouteModule,
    DxTemplateModule
  ]
})
export class DxMapModule { }

import type * as DxMapTypes from "devextreme/ui/map_types";
export { DxMapTypes };


