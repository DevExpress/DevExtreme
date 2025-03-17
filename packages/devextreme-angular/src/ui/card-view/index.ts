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


import DataSource from 'devextreme/data/data_source';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { EventInfo } from 'devextreme/common/core/events';
import { DataErrorOccurredInfo, Pager } from 'devextreme/common/grids';
import { Paging, RemoteOperations, PredefinedToolbarItem, ToolbarItem } from 'devextreme/ui/card_view';

import DxCardView from 'devextreme/ui/card_view';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoPagerModule } from 'devextreme-angular/ui/nested';
import { DxoPagingModule } from 'devextreme-angular/ui/nested';
import { DxoRemoteOperationsModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';

import { DxiCardViewItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewPagerModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewPagingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewRemoteOperationsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewToolbarModule } from 'devextreme-angular/ui/card-view/nested';




/**
 * [descr:dxCardView]

 */
@Component({
    selector: 'dx-card-view',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxCardViewComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxCardView = null;

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
     * [descr:DataControllerOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | Store | string) {
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
     * [descr:DataControllerOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): Array<string> | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Array<string> | string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:PagerOptions.pager]
    
     */
    @Input()
    get pager(): Pager {
        return this._getOption('pager');
    }
    set pager(value: Pager) {
        this._setOption('pager', value);
    }


    /**
     * [descr:DataControllerOptions.paging]
    
     */
    @Input()
    get paging(): Paging {
        return this._getOption('paging');
    }
    set paging(value: Paging) {
        this._setOption('paging', value);
    }


    /**
     * [descr:DataControllerOptions.remoteOperations]
    
     */
    @Input()
    get remoteOperations(): boolean | RemoteOperations | "auto" {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: boolean | RemoteOperations | "auto") {
        this._setOption('remoteOperations', value);
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
     * [descr:ToolbarOptions.toolbar]
    
     */
    @Input()
    get toolbar(): { items?: Array<PredefinedToolbarItem | ToolbarItem> } {
        return this._getOption('toolbar');
    }
    set toolbar(value: { items?: Array<PredefinedToolbarItem | ToolbarItem> }) {
        this._setOption('toolbar', value);
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
    
     * [descr:DataControllerOptions.onDataErrorOccurred]
    
    
     */
    @Output() onDataErrorOccurred: EventEmitter<DataErrorOccurredInfo>;

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
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | Store | string>;

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
    @Output() keyExprChange: EventEmitter<Array<string> | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagerChange: EventEmitter<Pager>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagingChange: EventEmitter<Paging>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() remoteOperationsChange: EventEmitter<boolean | RemoteOperations | "auto">;

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
    @Output() toolbarChange: EventEmitter<{ items?: Array<PredefinedToolbarItem | ToolbarItem> }>;

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
            { subscribe: 'dataErrorOccurred', emit: 'onDataErrorOccurred' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'keyExprChange' },
            { emit: 'pagerChange' },
            { emit: 'pagingChange' },
            { emit: 'remoteOperationsChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'tabIndexChange' },
            { emit: 'toolbarChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxCardView(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('keyExpr', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
        this._idh.doCheck('keyExpr');
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
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoToolbarModule,
    DxiItemModule,
    DxiCardViewItemModule,
    DxoCardViewPagerModule,
    DxoCardViewPagingModule,
    DxoCardViewRemoteOperationsModule,
    DxoCardViewToolbarModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxCardViewComponent
  ],
  exports: [
    DxCardViewComponent,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoToolbarModule,
    DxiItemModule,
    DxiCardViewItemModule,
    DxoCardViewPagerModule,
    DxoCardViewPagingModule,
    DxoCardViewRemoteOperationsModule,
    DxoCardViewToolbarModule,
    DxTemplateModule
  ]
})
export class DxCardViewModule { }

import type * as DxCardViewTypes from "devextreme/ui/card_view_types";
export { DxCardViewTypes };


