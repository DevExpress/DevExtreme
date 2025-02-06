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


import { ResizeHandle, DisposingEvent, InitializedEvent, OptionChangedEvent, ResizeEvent, ResizeEndEvent, ResizeStartEvent } from 'devextreme/ui/resizable';

import DxResizable from 'devextreme/ui/resizable';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';






/**
 * [descr:dxResizable]

 */
@Component({
    selector: 'dx-resizable',
    template: '<ng-content></ng-content>',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxResizableComponent extends DxComponent implements OnDestroy {
    instance: DxResizable = null;

    /**
     * [descr:dxResizableOptions.area]
    
     */
    @Input()
    get area(): any | string | undefined {
        return this._getOption('area');
    }
    set area(value: any | string | undefined) {
        this._setOption('area', value);
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
     * [descr:dxResizableOptions.handles]
    
     */
    @Input()
    get handles(): ResizeHandle | string {
        return this._getOption('handles');
    }
    set handles(value: ResizeHandle | string) {
        this._setOption('handles', value);
    }


    /**
     * [descr:dxResizableOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxResizableOptions.keepAspectRatio]
    
     */
    @Input()
    get keepAspectRatio(): boolean {
        return this._getOption('keepAspectRatio');
    }
    set keepAspectRatio(value: boolean) {
        this._setOption('keepAspectRatio', value);
    }


    /**
     * [descr:dxResizableOptions.maxHeight]
    
     */
    @Input()
    get maxHeight(): number {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number) {
        this._setOption('maxHeight', value);
    }


    /**
     * [descr:dxResizableOptions.maxWidth]
    
     */
    @Input()
    get maxWidth(): number {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number) {
        this._setOption('maxWidth', value);
    }


    /**
     * [descr:dxResizableOptions.minHeight]
    
     */
    @Input()
    get minHeight(): number {
        return this._getOption('minHeight');
    }
    set minHeight(value: number) {
        this._setOption('minHeight', value);
    }


    /**
     * [descr:dxResizableOptions.minWidth]
    
     */
    @Input()
    get minWidth(): number {
        return this._getOption('minWidth');
    }
    set minWidth(value: number) {
        this._setOption('minWidth', value);
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
     * [descr:dxResizableOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxResizableOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxResizableOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxResizableOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxResizableOptions.onResize]
    
    
     */
    @Output() onResize: EventEmitter<ResizeEvent>;

    /**
    
     * [descr:dxResizableOptions.onResizeEnd]
    
    
     */
    @Output() onResizeEnd: EventEmitter<ResizeEndEvent>;

    /**
    
     * [descr:dxResizableOptions.onResizeStart]
    
    
     */
    @Output() onResizeStart: EventEmitter<ResizeStartEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() areaChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() handlesChange: EventEmitter<ResizeHandle | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keepAspectRatioChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxHeightChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minHeightChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;








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
            { subscribe: 'resize', emit: 'onResize' },
            { subscribe: 'resizeEnd', emit: 'onResizeEnd' },
            { subscribe: 'resizeStart', emit: 'onResizeStart' },
            { emit: 'areaChange' },
            { emit: 'elementAttrChange' },
            { emit: 'handlesChange' },
            { emit: 'heightChange' },
            { emit: 'keepAspectRatioChange' },
            { emit: 'maxHeightChange' },
            { emit: 'maxWidthChange' },
            { emit: 'minHeightChange' },
            { emit: 'minWidthChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'widthChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxResizable(element, options);
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
    DxResizableComponent
  ],
  exports: [
    DxResizableComponent,
    DxTemplateModule
  ]
})
export class DxResizableModule { }

import type * as DxResizableTypes from "devextreme/ui/resizable_types";
export { DxResizableTypes };


