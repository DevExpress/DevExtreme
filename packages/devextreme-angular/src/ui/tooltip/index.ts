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
import { Position } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent } from 'devextreme/ui/tooltip';

import DxTooltip from 'devextreme/ui/tooltip';


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
import { DxoHideEventModule } from 'devextreme-angular/ui/nested';
import { DxoShowEventModule } from 'devextreme-angular/ui/nested';




/**
 * [descr:dxTooltip]

 */
@Component({
    selector: 'dx-tooltip',
    template: '<ng-content></ng-content>',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxTooltipComponent extends DxComponent implements OnDestroy {
    instance: DxTooltip;

    /**
     * [descr:dxPopoverOptions.animation]
    
     */
    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxPopoverOptions.closeOnOutsideClick]
    
     * @deprecated [depNote:dxPopoverOptions.closeOnOutsideClick]
    
     */
    @Input()
    get closeOnOutsideClick(): boolean | Function {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | Function) {
        this._setOption('closeOnOutsideClick', value);
    }


    /**
     * [descr:dxPopupOptions.container]
    
     */
    @Input()
    get container(): string | UserDefinedElement | undefined {
        return this._getOption('container');
    }
    set container(value: string | UserDefinedElement | undefined) {
        this._setOption('container', value);
    }


    /**
     * [descr:dxOverlayOptions.contentTemplate]
    
     */
    @Input()
    get contentTemplate(): any {
        return this._getOption('contentTemplate');
    }
    set contentTemplate(value: any) {
        this._setOption('contentTemplate', value);
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
     * [descr:dxPopoverOptions.height]
    
     */
    @Input()
    get height(): number | Function | string {
        return this._getOption('height');
    }
    set height(value: number | Function | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxPopoverOptions.hideEvent]
    
     */
    @Input()
    get hideEvent(): string | undefined | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('hideEvent');
    }
    set hideEvent(value: string | undefined | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('hideEvent', value);
    }


    /**
     * [descr:dxPopoverOptions.hideOnOutsideClick]
    
     */
    @Input()
    get hideOnOutsideClick(): boolean | Function {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | Function) {
        this._setOption('hideOnOutsideClick', value);
    }


    /**
     * [descr:dxPopoverOptions.hideOnParentScroll]
    
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
     * [descr:dxOverlayOptions.maxHeight]
    
     */
    @Input()
    get maxHeight(): number | Function | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number | Function | string) {
        this._setOption('maxHeight', value);
    }


    /**
     * [descr:dxOverlayOptions.maxWidth]
    
     */
    @Input()
    get maxWidth(): number | Function | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number | Function | string) {
        this._setOption('maxWidth', value);
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
     * [descr:dxPopoverOptions.position]
    
     */
    @Input()
    get position(): Position | DevExpress.PositionConfig {
        return this._getOption('position');
    }
    set position(value: Position | DevExpress.PositionConfig) {
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
     * [descr:dxPopoverOptions.shading]
    
     */
    @Input()
    get shading(): boolean {
        return this._getOption('shading');
    }
    set shading(value: boolean) {
        this._setOption('shading', value);
    }


    /**
     * [descr:dxOverlayOptions.shadingColor]
    
     */
    @Input()
    get shadingColor(): string {
        return this._getOption('shadingColor');
    }
    set shadingColor(value: string) {
        this._setOption('shadingColor', value);
    }


    /**
     * [descr:dxPopoverOptions.showEvent]
    
     */
    @Input()
    get showEvent(): string | undefined | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('showEvent');
    }
    set showEvent(value: string | undefined | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('showEvent', value);
    }


    /**
     * [descr:dxPopoverOptions.target]
    
     */
    @Input()
    get target(): string | UserDefinedElement | undefined {
        return this._getOption('target');
    }
    set target(value: string | UserDefinedElement | undefined) {
        this._setOption('target', value);
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
     * [descr:dxPopoverOptions.width]
    
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
    
     * [descr:dxTooltipOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxTooltipOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxTooltipOptions.onHidden]
    
    
     */
    @Output() onHidden: EventEmitter<HiddenEvent>;

    /**
    
     * [descr:dxTooltipOptions.onHiding]
    
    
     */
    @Output() onHiding: EventEmitter<HidingEvent>;

    /**
    
     * [descr:dxTooltipOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxTooltipOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxTooltipOptions.onShowing]
    
    
     */
    @Output() onShowing: EventEmitter<ShowingEvent>;

    /**
    
     * [descr:dxTooltipOptions.onShown]
    
    
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
    @Output() contentTemplateChange: EventEmitter<any>;

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
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideEventChange: EventEmitter<string | undefined | { delay?: number | undefined, name?: string | undefined }>;

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
    @Output() maxHeightChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxWidthChange: EventEmitter<number | Function | string>;

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
    @Output() positionChange: EventEmitter<Position | DevExpress.PositionConfig>;

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
    @Output() showEventChange: EventEmitter<string | undefined | { delay?: number | undefined, name?: string | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetChange: EventEmitter<string | UserDefinedElement | undefined>;

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
            { emit: 'contentTemplateChange' },
            { emit: 'copyRootClassesToWrapperChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'heightChange' },
            { emit: 'hideEventChange' },
            { emit: 'hideOnOutsideClickChange' },
            { emit: 'hideOnParentScrollChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'maxHeightChange' },
            { emit: 'maxWidthChange' },
            { emit: 'minHeightChange' },
            { emit: 'minWidthChange' },
            { emit: 'positionChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'shadingChange' },
            { emit: 'shadingColorChange' },
            { emit: 'showEventChange' },
            { emit: 'targetChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wrapperAttrChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxTooltip(element, options);
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
    DxoHideEventModule,
    DxoShowEventModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxTooltipComponent
  ],
  exports: [
    DxTooltipComponent,
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
    DxoHideEventModule,
    DxoShowEventModule,
    DxTemplateModule
  ]
})
export class DxTooltipModule { }

import type * as DxTooltipTypes from "devextreme/ui/tooltip_types";
export { DxTooltipTypes };


