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
    SimpleChanges
} from '@angular/core';


import { DisplayMode } from 'devextreme/common';
import { EventInfo } from 'devextreme/common/core/events';

import DxPagination from 'devextreme/ui/pagination';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';






/**
 * [descr:dxPagination]

 */
@Component({
    selector: 'dx-pagination',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxPaginationComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPagination = null;

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
     * [descr:dxPaginationOptions.allowedPageSizes]
    
     */
    @Input()
    get allowedPageSizes(): Array<number | string> {
        return this._getOption('allowedPageSizes');
    }
    set allowedPageSizes(value: Array<number | string>) {
        this._setOption('allowedPageSizes', value);
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
     * [descr:PagerBase.displayMode]
    
     */
    @Input()
    get displayMode(): DisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: DisplayMode) {
        this._setOption('displayMode', value);
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
     * [descr:PagerBase.infoText]
    
     */
    @Input()
    get infoText(): string {
        return this._getOption('infoText');
    }
    set infoText(value: string) {
        this._setOption('infoText', value);
    }


    /**
     * [descr:dxPaginationOptions.itemCount]
    
     */
    @Input()
    get itemCount(): number {
        return this._getOption('itemCount');
    }
    set itemCount(value: number) {
        this._setOption('itemCount', value);
    }


    /**
     * [descr:PagerBase.label]
    
     */
    @Input()
    get label(): string {
        return this._getOption('label');
    }
    set label(value: string) {
        this._setOption('label', value);
    }


    /**
     * [descr:dxPaginationOptions.pageIndex]
    
     */
    @Input()
    get pageIndex(): number {
        return this._getOption('pageIndex');
    }
    set pageIndex(value: number) {
        this._setOption('pageIndex', value);
    }


    /**
     * [descr:dxPaginationOptions.pageSize]
    
     */
    @Input()
    get pageSize(): number {
        return this._getOption('pageSize');
    }
    set pageSize(value: number) {
        this._setOption('pageSize', value);
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
     * [descr:PagerBase.showInfo]
    
     */
    @Input()
    get showInfo(): boolean {
        return this._getOption('showInfo');
    }
    set showInfo(value: boolean) {
        this._setOption('showInfo', value);
    }


    /**
     * [descr:PagerBase.showNavigationButtons]
    
     */
    @Input()
    get showNavigationButtons(): boolean {
        return this._getOption('showNavigationButtons');
    }
    set showNavigationButtons(value: boolean) {
        this._setOption('showNavigationButtons', value);
    }


    /**
     * [descr:PagerBase.showPageSizeSelector]
    
     */
    @Input()
    get showPageSizeSelector(): boolean {
        return this._getOption('showPageSizeSelector');
    }
    set showPageSizeSelector(value: boolean) {
        this._setOption('showPageSizeSelector', value);
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
    
     * [descr:WidgetOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:DOMComponentOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:ComponentOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<Object>;

    /**
    
     * [descr:DOMComponentOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<Object>;

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
    @Output() allowedPageSizesChange: EventEmitter<Array<number | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() displayModeChange: EventEmitter<DisplayMode>;

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
    @Output() infoTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemCountChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showInfoChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showNavigationButtonsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showPageSizeSelectorChange: EventEmitter<boolean>;

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
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowedPageSizesChange' },
            { emit: 'disabledChange' },
            { emit: 'displayModeChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'infoTextChange' },
            { emit: 'itemCountChange' },
            { emit: 'labelChange' },
            { emit: 'pageIndexChange' },
            { emit: 'pageSizeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showInfoChange' },
            { emit: 'showNavigationButtonsChange' },
            { emit: 'showPageSizeSelectorChange' },
            { emit: 'tabIndexChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxPagination(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('allowedPageSizes', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('allowedPageSizes');
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
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxPaginationComponent
  ],
  exports: [
    DxPaginationComponent,
    DxTemplateModule
  ]
})
export class DxPaginationModule { }

import type * as DxPaginationTypes from "devextreme/ui/pagination_types";
export { DxPaginationTypes };


