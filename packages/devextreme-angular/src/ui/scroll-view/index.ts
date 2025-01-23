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


import { ScrollDirection } from 'devextreme/common';
import { DisposingEvent, InitializedEvent, OptionChangedEvent, PullDownEvent, ReachBottomEvent, ScrollEvent, UpdatedEvent } from 'devextreme/ui/scroll_view';

import DxScrollView from 'devextreme/ui/scroll_view';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';






/**
 * [descr:dxScrollView]

 */
@Component({
    selector: 'dx-scroll-view',
    template: '<ng-content></ng-content>',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxScrollViewComponent extends DxComponent implements OnDestroy {
    instance: DxScrollView = null;

    /**
     * [descr:dxScrollableOptions.bounceEnabled]
    
     */
    @Input()
    get bounceEnabled(): boolean {
        return this._getOption('bounceEnabled');
    }
    set bounceEnabled(value: boolean) {
        this._setOption('bounceEnabled', value);
    }


    /**
     * [descr:dxScrollableOptions.direction]
    
     */
    @Input()
    get direction(): ScrollDirection {
        return this._getOption('direction');
    }
    set direction(value: ScrollDirection) {
        this._setOption('direction', value);
    }


    /**
     * [descr:dxScrollableOptions.disabled]
    
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
     * [descr:dxScrollViewOptions.pulledDownText]
    
     */
    @Input()
    get pulledDownText(): string {
        return this._getOption('pulledDownText');
    }
    set pulledDownText(value: string) {
        this._setOption('pulledDownText', value);
    }


    /**
     * [descr:dxScrollViewOptions.pullingDownText]
    
     */
    @Input()
    get pullingDownText(): string {
        return this._getOption('pullingDownText');
    }
    set pullingDownText(value: string) {
        this._setOption('pullingDownText', value);
    }


    /**
     * [descr:dxScrollViewOptions.reachBottomText]
    
     */
    @Input()
    get reachBottomText(): string {
        return this._getOption('reachBottomText');
    }
    set reachBottomText(value: string) {
        this._setOption('reachBottomText', value);
    }


    /**
     * [descr:dxScrollViewOptions.refreshingText]
    
     */
    @Input()
    get refreshingText(): string {
        return this._getOption('refreshingText');
    }
    set refreshingText(value: string) {
        this._setOption('refreshingText', value);
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
     * [descr:dxScrollableOptions.scrollByContent]
    
     */
    @Input()
    get scrollByContent(): boolean {
        return this._getOption('scrollByContent');
    }
    set scrollByContent(value: boolean) {
        this._setOption('scrollByContent', value);
    }


    /**
     * [descr:dxScrollableOptions.scrollByThumb]
    
     */
    @Input()
    get scrollByThumb(): boolean {
        return this._getOption('scrollByThumb');
    }
    set scrollByThumb(value: boolean) {
        this._setOption('scrollByThumb', value);
    }


    /**
     * [descr:dxScrollableOptions.showScrollbar]
    
     */
    @Input()
    get showScrollbar(): "onScroll" | "onHover" | "always" | "never" {
        return this._getOption('showScrollbar');
    }
    set showScrollbar(value: "onScroll" | "onHover" | "always" | "never") {
        this._setOption('showScrollbar', value);
    }


    /**
     * [descr:dxScrollableOptions.useNative]
    
     */
    @Input()
    get useNative(): boolean {
        return this._getOption('useNative');
    }
    set useNative(value: boolean) {
        this._setOption('useNative', value);
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
    
     * [descr:dxScrollViewOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxScrollViewOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxScrollViewOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxScrollViewOptions.onPullDown]
    
    
     */
    @Output() onPullDown: EventEmitter<PullDownEvent>;

    /**
    
     * [descr:dxScrollViewOptions.onReachBottom]
    
    
     */
    @Output() onReachBottom: EventEmitter<ReachBottomEvent>;

    /**
    
     * [descr:dxScrollViewOptions.onScroll]
    
    
     */
    @Output() onScroll: EventEmitter<ScrollEvent>;

    /**
    
     * [descr:dxScrollViewOptions.onUpdated]
    
    
     */
    @Output() onUpdated: EventEmitter<UpdatedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() bounceEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() directionChange: EventEmitter<ScrollDirection>;

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
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pulledDownTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pullingDownTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() reachBottomTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() refreshingTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollByContentChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollByThumbChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showScrollbarChange: EventEmitter<"onScroll" | "onHover" | "always" | "never">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useNativeChange: EventEmitter<boolean>;

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
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'pullDown', emit: 'onPullDown' },
            { subscribe: 'reachBottom', emit: 'onReachBottom' },
            { subscribe: 'scroll', emit: 'onScroll' },
            { subscribe: 'updated', emit: 'onUpdated' },
            { emit: 'bounceEnabledChange' },
            { emit: 'directionChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'heightChange' },
            { emit: 'pulledDownTextChange' },
            { emit: 'pullingDownTextChange' },
            { emit: 'reachBottomTextChange' },
            { emit: 'refreshingTextChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollByContentChange' },
            { emit: 'scrollByThumbChange' },
            { emit: 'showScrollbarChange' },
            { emit: 'useNativeChange' },
            { emit: 'widthChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxScrollView(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

}

@NgModule({
  imports: [
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxScrollViewComponent
  ],
  exports: [
    DxScrollViewComponent,
    DxTemplateModule
  ]
})
export class DxScrollViewModule { }

import type * as DxScrollViewTypes from "devextreme/ui/scroll_view_types";
export { DxScrollViewTypes };


