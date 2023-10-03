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
    EventEmitter
} from '@angular/core';


import { AnimationConfig } from 'devextreme/animation/fx';
import DevExpress from 'devextreme/bundles/dx.all';
import { PositionAlignment } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent } from 'devextreme/ui/load_panel';

import DxLoadPanel from 'devextreme/ui/load_panel';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';

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




/**
 * [descr:dxLoadPanel]

 */
@Component({
    selector: 'dx-load-panel',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxLoadPanelComponent extends DxComponent implements OnDestroy {
    instance: DxLoadPanel;

    /**
     * [descr:dxLoadPanelOptions.animation]
    
     */
    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxOverlayOptions.closeOnOutsideClick]
    
     * @deprecated [depNote:dxOverlayOptions.closeOnOutsideClick]
    
     */
    @Input()
    get closeOnOutsideClick(): boolean | Function {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | Function) {
        this._setOption('closeOnOutsideClick', value);
    }


    /**
     * [descr:dxLoadPanelOptions.container]
    
     */
    @Input()
    get container(): string | UserDefinedElement | undefined {
        return this._getOption('container');
    }
    set container(value: string | UserDefinedElement | undefined) {
        this._setOption('container', value);
    }


    /**
     * [descr:dxOverlayOptions.copyRootClassesToWrapper]
    
     * @deprecated [depNote:dxOverlayOptions.copyRootClassesToWrapper]
    
     */
    @Input()
    get copyRootClassesToWrapper(): boolean {
        return this._getOption('copyRootClassesToWrapper');
    }
    set copyRootClassesToWrapper(value: boolean) {
        this._setOption('copyRootClassesToWrapper', value);
    }


    /**
     * [descr:dxOverlayOptions.deferRendering]
    
     */
    @Input()
    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }


    /**
     * [descr:dxLoadPanelOptions.delay]
    
     */
    @Input()
    get delay(): number {
        return this._getOption('delay');
    }
    set delay(value: number) {
        this._setOption('delay', value);
    }


    /**
     * [descr:dxOverlayOptions.elementAttr]
    
     * @deprecated [depNote:dxOverlayOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxLoadPanelOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxLoadPanelOptions.height]
    
     */
    @Input()
    get height(): number | Function | string {
        return this._getOption('height');
    }
    set height(value: number | Function | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxOverlayOptions.hideOnOutsideClick]
    
     */
    @Input()
    get hideOnOutsideClick(): boolean | Function {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | Function) {
        this._setOption('hideOnOutsideClick', value);
    }


    /**
     * [descr:dxOverlayOptions.hideOnParentScroll]
    
     */
    @Input()
    get hideOnParentScroll(): boolean {
        return this._getOption('hideOnParentScroll');
    }
    set hideOnParentScroll(value: boolean) {
        this._setOption('hideOnParentScroll', value);
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
     * [descr:dxLoadPanelOptions.indicatorSrc]
    
     */
    @Input()
    get indicatorSrc(): string {
        return this._getOption('indicatorSrc');
    }
    set indicatorSrc(value: string) {
        this._setOption('indicatorSrc', value);
    }


    /**
     * [descr:dxLoadPanelOptions.maxHeight]
    
     */
    @Input()
    get maxHeight(): number | Function | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number | Function | string) {
        this._setOption('maxHeight', value);
    }


    /**
     * [descr:dxLoadPanelOptions.maxWidth]
    
     */
    @Input()
    get maxWidth(): number | Function | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number | Function | string) {
        this._setOption('maxWidth', value);
    }


    /**
     * [descr:dxLoadPanelOptions.message]
    
     */
    @Input()
    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }


    /**
     * [descr:dxOverlayOptions.minHeight]
    
     */
    @Input()
    get minHeight(): number | Function | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: number | Function | string) {
        this._setOption('minHeight', value);
    }


    /**
     * [descr:dxOverlayOptions.minWidth]
    
     */
    @Input()
    get minWidth(): number | Function | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: number | Function | string) {
        this._setOption('minWidth', value);
    }


    /**
     * [descr:dxLoadPanelOptions.position]
    
     */
    @Input()
    get position(): PositionAlignment | DevExpress.PositionConfig | Function {
        return this._getOption('position');
    }
    set position(value: PositionAlignment | DevExpress.PositionConfig | Function) {
        this._setOption('position', value);
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
     * [descr:dxOverlayOptions.shading]
    
     */
    @Input()
    get shading(): boolean {
        return this._getOption('shading');
    }
    set shading(value: boolean) {
        this._setOption('shading', value);
    }


    /**
     * [descr:dxLoadPanelOptions.shadingColor]
    
     */
    @Input()
    get shadingColor(): string {
        return this._getOption('shadingColor');
    }
    set shadingColor(value: string) {
        this._setOption('shadingColor', value);
    }


    /**
     * [descr:dxLoadPanelOptions.showIndicator]
    
     */
    @Input()
    get showIndicator(): boolean {
        return this._getOption('showIndicator');
    }
    set showIndicator(value: boolean) {
        this._setOption('showIndicator', value);
    }


    /**
     * [descr:dxLoadPanelOptions.showPane]
    
     */
    @Input()
    get showPane(): boolean {
        return this._getOption('showPane');
    }
    set showPane(value: boolean) {
        this._setOption('showPane', value);
    }


    /**
     * [descr:dxOverlayOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:dxLoadPanelOptions.width]
    
     */
    @Input()
    get width(): number | Function | string {
        return this._getOption('width');
    }
    set width(value: number | Function | string) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxOverlayOptions.wrapperAttr]
    
     */
    @Input()
    get wrapperAttr(): any {
        return this._getOption('wrapperAttr');
    }
    set wrapperAttr(value: any) {
        this._setOption('wrapperAttr', value);
    }

    /**
    
     * [descr:dxLoadPanelOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onHidden]
    
    
     */
    @Output() onHidden: EventEmitter<HiddenEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onHiding]
    
    
     */
    @Output() onHiding: EventEmitter<HidingEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onShowing]
    
    
     */
    @Output() onShowing: EventEmitter<ShowingEvent>;

    /**
    
     * [descr:dxLoadPanelOptions.onShown]
    
    
     */
    @Output() onShown: EventEmitter<ShownEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<{ hide?: AnimationConfig, show?: AnimationConfig }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() closeOnOutsideClickChange: EventEmitter<boolean | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerChange: EventEmitter<string | UserDefinedElement | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() copyRootClassesToWrapperChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() deferRenderingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() delayChange: EventEmitter<number>;

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
    @Output() hideOnOutsideClickChange: EventEmitter<boolean | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideOnParentScrollChange: EventEmitter<boolean>;

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
    @Output() indicatorSrcChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxHeightChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxWidthChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() messageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minHeightChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minWidthChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<PositionAlignment | DevExpress.PositionConfig | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() shadingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() shadingColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showIndicatorChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showPaneChange: EventEmitter<boolean>;

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
    @Output() wrapperAttrChange: EventEmitter<any>;







    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            _watcherHelper: WatcherHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'hidden', emit: 'onHidden' },
            { subscribe: 'hiding', emit: 'onHiding' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'showing', emit: 'onShowing' },
            { subscribe: 'shown', emit: 'onShown' },
            { emit: 'animationChange' },
            { emit: 'closeOnOutsideClickChange' },
            { emit: 'containerChange' },
            { emit: 'copyRootClassesToWrapperChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'delayChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hideOnOutsideClickChange' },
            { emit: 'hideOnParentScrollChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'indicatorSrcChange' },
            { emit: 'maxHeightChange' },
            { emit: 'maxWidthChange' },
            { emit: 'messageChange' },
            { emit: 'minHeightChange' },
            { emit: 'minWidthChange' },
            { emit: 'positionChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'shadingChange' },
            { emit: 'shadingColorChange' },
            { emit: 'showIndicatorChange' },
            { emit: 'showPaneChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wrapperAttrChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxLoadPanel(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

}

@NgModule({
  imports: [
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
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxLoadPanelComponent
  ],
  exports: [
    DxLoadPanelComponent,
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
    DxTemplateModule
  ]
})
export class DxLoadPanelModule { }

import type * as DxLoadPanelTypes from "devextreme/ui/load_panel_types";
export { DxLoadPanelTypes };


