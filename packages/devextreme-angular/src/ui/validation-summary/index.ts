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

export type { ExplicitTypes } from 'devextreme/ui/validation_summary';

import type { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, OptionChangedEvent } from 'devextreme/ui/validation_summary';

import DxValidationSummary from 'devextreme/ui/validation_summary';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper,
    CollectionNestedOption,
} from 'devextreme-angular/core';

import { DxiItemModule } from 'devextreme-angular/ui/nested';

import { DxiValidationSummaryItemModule } from 'devextreme-angular/ui/validation-summary/nested';
import { 
           PROPERTY_TOKEN_items,
     } from 'devextreme-angular/core/tokens';


/**
 * [descr:dxValidationSummary]

 */
@Component({
    selector: 'dx-validation-summary',
    template: '',
    host: { ngSkipHydration: 'true' },
    imports: [ DxIntegrationModule ],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxValidationSummaryComponent<TItem = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }

    instance: DxValidationSummary<TItem, TKey> = null;

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
     * [descr:CollectionWidgetOptions.items]
    
     */
    @Input()
    get items(): Array<any | CollectionWidgetItem | string> {
        return this._getOption('items');
    }
    set items(value: Array<any | CollectionWidgetItem | string>) {
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
     * [descr:dxValidationSummaryOptions.validationGroup]
    
     */
    @Input()
    get validationGroup(): string {
        return this._getOption('validationGroup');
    }
    set validationGroup(value: string) {
        this._setOption('validationGroup', value);
    }

    /**
    
     * [descr:dxValidationSummaryOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxValidationSummaryOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxValidationSummaryOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxValidationSummaryOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxValidationSummaryOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<any | CollectionWidgetItem | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationGroupChange: EventEmitter<string>;




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
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'elementAttrChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'validationGroupChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxValidationSummary(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('items', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
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
    DxValidationSummaryComponent,
    DxiItemModule,
    DxiValidationSummaryItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  exports: [
    DxValidationSummaryComponent,
    DxiItemModule,
    DxiValidationSummaryItemModule,
    DxTemplateModule
  ]
})
export class DxValidationSummaryModule { }

export * from 'devextreme-angular/ui/validation-summary/nested';

import type * as DxValidationSummaryTypes from "devextreme/ui/validation_summary_types";
export { DxValidationSummaryTypes };


