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


import { AnimationConfig } from 'devextreme/common/core/animation';
import { ContentReadyEvent, DisposingEvent, InitializedEvent, OptionChangedEvent, RenderedEvent, ShownEvent } from 'devextreme/ui/defer_rendering';
import { DxPromise } from 'devextreme/core/utils/deferred';

import DxDeferRendering from 'devextreme/ui/defer_rendering';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoAnimationModule } from 'devextreme-angular/ui/nested';
import { DxoFromModule } from 'devextreme-angular/ui/nested';
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import { DxoAtModule } from 'devextreme-angular/ui/nested';
import { DxoBoundaryOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoCollisionModule } from 'devextreme-angular/ui/nested';
import { DxoMyModule } from 'devextreme-angular/ui/nested';
import { DxoOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoToModule } from 'devextreme-angular/ui/nested';

import { DxoDeferRenderingAnimationModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingAtModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingBoundaryOffsetModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingCollisionModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingFromModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingMyModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingOffsetModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingPositionModule } from 'devextreme-angular/ui/defer-rendering/nested';
import { DxoDeferRenderingToModule } from 'devextreme-angular/ui/defer-rendering/nested';




/**
 * [descr:dxDeferRendering]

 */
@Component({
    selector: 'dx-defer-rendering',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxDeferRenderingComponent extends DxComponent implements OnDestroy {
    instance: DxDeferRendering = null;

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
     * [descr:dxDeferRenderingOptions.animation]
    
     */
    @Input()
    get animation(): AnimationConfig | undefined {
        return this._getOption('animation');
    }
    set animation(value: AnimationConfig | undefined) {
        this._setOption('animation', value);
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
     * [descr:WidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
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
     * [descr:dxDeferRenderingOptions.renderWhen]
    
     */
    @Input()
    get renderWhen(): boolean | DxPromise | undefined {
        return this._getOption('renderWhen');
    }
    set renderWhen(value: boolean | DxPromise | undefined) {
        this._setOption('renderWhen', value);
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
     * [descr:dxDeferRenderingOptions.showLoadIndicator]
    
     */
    @Input()
    get showLoadIndicator(): boolean {
        return this._getOption('showLoadIndicator');
    }
    set showLoadIndicator(value: boolean) {
        this._setOption('showLoadIndicator', value);
    }


    /**
     * [descr:dxDeferRenderingOptions.staggerItemSelector]
    
     */
    @Input()
    get staggerItemSelector(): string | undefined {
        return this._getOption('staggerItemSelector');
    }
    set staggerItemSelector(value: string | undefined) {
        this._setOption('staggerItemSelector', value);
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
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxDeferRenderingOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxDeferRenderingOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxDeferRenderingOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxDeferRenderingOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxDeferRenderingOptions.onRendered]
    
    
     */
    @Output() onRendered: EventEmitter<RenderedEvent>;

    /**
    
     * [descr:dxDeferRenderingOptions.onShown]
    
    
     */
    @Output() onShown: EventEmitter<ShownEvent>;

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
    @Output() animationChange: EventEmitter<AnimationConfig | undefined>;

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
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

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
    @Output() renderWhenChange: EventEmitter<boolean | DxPromise | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showLoadIndicatorChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() staggerItemSelectorChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            _watcherHelper: WatcherHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'rendered', emit: 'onRendered' },
            { subscribe: 'shown', emit: 'onShown' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'animationChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'renderWhenChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showLoadIndicatorChange' },
            { emit: 'staggerItemSelectorChange' },
            { emit: 'tabIndexChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxDeferRendering(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

}

@NgModule({
  imports: [
    DxoAnimationModule,
    DxoFromModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoToModule,
    DxoDeferRenderingAnimationModule,
    DxoDeferRenderingAtModule,
    DxoDeferRenderingBoundaryOffsetModule,
    DxoDeferRenderingCollisionModule,
    DxoDeferRenderingFromModule,
    DxoDeferRenderingMyModule,
    DxoDeferRenderingOffsetModule,
    DxoDeferRenderingPositionModule,
    DxoDeferRenderingToModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxDeferRenderingComponent
  ],
  exports: [
    DxDeferRenderingComponent,
    DxoAnimationModule,
    DxoFromModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoToModule,
    DxoDeferRenderingAnimationModule,
    DxoDeferRenderingAtModule,
    DxoDeferRenderingBoundaryOffsetModule,
    DxoDeferRenderingCollisionModule,
    DxoDeferRenderingFromModule,
    DxoDeferRenderingMyModule,
    DxoDeferRenderingOffsetModule,
    DxoDeferRenderingPositionModule,
    DxoDeferRenderingToModule,
    DxTemplateModule
  ]
})
export class DxDeferRenderingModule { }

import type * as DxDeferRenderingTypes from "devextreme/ui/defer_rendering_types";
export { DxDeferRenderingTypes };


