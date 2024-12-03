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
    EventEmitter
} from '@angular/core';


import { AnimationConfig, PositionConfig } from 'devextreme/common/core/animation';
import { event } from 'devextreme/events/events.types';
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent } from 'devextreme/ui/tooltip';
import { Position } from 'devextreme/common';

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

import { DxoTooltipAnimationModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipAtModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipBoundaryOffsetModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipCollisionModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipFromModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipHideModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipHideEventModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipMyModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipOffsetModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipPositionModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipShowModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipShowEventModule } from 'devextreme-angular/ui/tooltip/nested';
import { DxoTooltipToModule } from 'devextreme-angular/ui/tooltip/nested';




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
    instance: DxTooltip = null;

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
    get closeOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('closeOnOutsideClick', value);
    }


    /**
     * [descr:dxPopupOptions.container]
    
     */
    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
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
     * [descr:dxPopoverOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
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
    get hideOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | ((event: event) => boolean)) {
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
    get maxHeight(): (() => number | string) | number | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: (() => number | string) | number | string) {
        this._setOption('maxHeight', value);
    }


    /**
     * [descr:dxOverlayOptions.maxWidth]
    
     */
    @Input()
    get maxWidth(): (() => number | string) | number | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: (() => number | string) | number | string) {
        this._setOption('maxWidth', value);
    }


    /**
     * [descr:dxOverlayOptions.minHeight]
    
     */
    @Input()
    get minHeight(): (() => number | string) | number | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: (() => number | string) | number | string) {
        this._setOption('minHeight', value);
    }


    /**
     * [descr:dxOverlayOptions.minWidth]
    
     */
    @Input()
    get minWidth(): (() => number | string) | number | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: (() => number | string) | number | string) {
        this._setOption('minWidth', value);
    }


    /**
     * [descr:dxPopoverOptions.position]
    
     */
    @Input()
    get position(): Position | PositionConfig {
        return this._getOption('position');
    }
    set position(value: Position | PositionConfig) {
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
    get target(): any | string | undefined {
        return this._getOption('target');
    }
    set target(value: any | string | undefined) {
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
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
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
    @Output() closeOnOutsideClickChange: EventEmitter<boolean | ((event: event) => boolean)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() contentTemplateChange: EventEmitter<any>;

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
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideEventChange: EventEmitter<string | undefined | { delay?: number | undefined, name?: string | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideOnOutsideClickChange: EventEmitter<boolean | ((event: event) => boolean)>;

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
    @Output() maxHeightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxWidthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minHeightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minWidthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<Position | PositionConfig>;

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
    @Output() targetChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;

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
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
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
    DxoTooltipAnimationModule,
    DxoTooltipAtModule,
    DxoTooltipBoundaryOffsetModule,
    DxoTooltipCollisionModule,
    DxoTooltipFromModule,
    DxoTooltipHideModule,
    DxoTooltipHideEventModule,
    DxoTooltipMyModule,
    DxoTooltipOffsetModule,
    DxoTooltipPositionModule,
    DxoTooltipShowModule,
    DxoTooltipShowEventModule,
    DxoTooltipToModule,
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
    DxoTooltipAnimationModule,
    DxoTooltipAtModule,
    DxoTooltipBoundaryOffsetModule,
    DxoTooltipCollisionModule,
    DxoTooltipFromModule,
    DxoTooltipHideModule,
    DxoTooltipHideEventModule,
    DxoTooltipMyModule,
    DxoTooltipOffsetModule,
    DxoTooltipPositionModule,
    DxoTooltipShowModule,
    DxoTooltipShowEventModule,
    DxoTooltipToModule,
    DxTemplateModule
  ]
})
export class DxTooltipModule { }

import type * as DxTooltipTypes from "devextreme/ui/tooltip_types";
export { DxTooltipTypes };


