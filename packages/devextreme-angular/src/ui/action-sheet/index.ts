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

export { ExplicitTypes } from 'devextreme/ui/action_sheet';

import { ButtonStyle, ButtonType } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { CancelClickEvent, ContentReadyEvent, DisposingEvent, dxActionSheetItem, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent } from 'devextreme/ui/action_sheet';

import DxActionSheet from 'devextreme/ui/action_sheet';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiItemModule } from 'devextreme-angular/ui/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';



/**
 * [descr:dxActionSheet]

 */
@Component({
    selector: 'dx-action-sheet',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxActionSheetComponent<TItem = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxActionSheet<TItem, TKey> = null;

    /**
     * [descr:dxActionSheetOptions.cancelText]
    
     */
    @Input()
    get cancelText(): string {
        return this._getOption('cancelText');
    }
    set cancelText(value: string) {
        this._setOption('cancelText', value);
    }


    /**
     * [descr:dxActionSheetOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<dxActionSheetItem | string | any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<dxActionSheetItem | string | any>) {
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
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
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
     * [descr:CollectionWidgetOptions.itemHoldTimeout]
    
     */
    @Input()
    get itemHoldTimeout(): number {
        return this._getOption('itemHoldTimeout');
    }
    set itemHoldTimeout(value: number) {
        this._setOption('itemHoldTimeout', value);
    }


    /**
     * [descr:dxActionSheetOptions.items]
    
     */
    @Input()
    get items(): Array<string | any | { disabled?: boolean, icon?: string, onClick?: Function, stylingMode?: ButtonStyle, template?: any, text?: string, type?: ButtonType }> {
        return this._getOption('items');
    }
    set items(value: Array<string | any | { disabled?: boolean, icon?: string, onClick?: Function, stylingMode?: ButtonStyle, template?: any, text?: string, type?: ButtonType }>) {
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
     * [descr:dxActionSheetOptions.showCancelButton]
    
     */
    @Input()
    get showCancelButton(): boolean {
        return this._getOption('showCancelButton');
    }
    set showCancelButton(value: boolean) {
        this._setOption('showCancelButton', value);
    }


    /**
     * [descr:dxActionSheetOptions.showTitle]
    
     */
    @Input()
    get showTitle(): boolean {
        return this._getOption('showTitle');
    }
    set showTitle(value: boolean) {
        this._setOption('showTitle', value);
    }


    /**
     * [descr:dxActionSheetOptions.target]
    
     */
    @Input()
    get target(): UserDefinedElement | string {
        return this._getOption('target');
    }
    set target(value: UserDefinedElement | string) {
        this._setOption('target', value);
    }


    /**
     * [descr:dxActionSheetOptions.title]
    
     */
    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxActionSheetOptions.usePopover]
    
     */
    @Input()
    get usePopover(): boolean {
        return this._getOption('usePopover');
    }
    set usePopover(value: boolean) {
        this._setOption('usePopover', value);
    }


    /**
     * [descr:dxActionSheetOptions.visible]
    
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
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxActionSheetOptions.onCancelClick]
    
    
     */
    @Output() onCancelClick: EventEmitter<CancelClickEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onItemHold]
    
    
     */
    @Output() onItemHold: EventEmitter<ItemHoldEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxActionSheetOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cancelTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Store | DataSource | DataSourceOptions | null | string | Array<dxActionSheetItem | string | any>>;

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
    @Output() heightChange: EventEmitter<number | Function | string | undefined>;

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
    @Output() itemHoldTimeoutChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<string | any | { disabled?: boolean, icon?: string, onClick?: Function, stylingMode?: ButtonStyle, template?: any, text?: string, type?: ButtonType }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showCancelButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showTitleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetChange: EventEmitter<UserDefinedElement | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() usePopoverChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;




    @ContentChildren(DxiItemComponent)
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'cancelClick', emit: 'onCancelClick' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
            { subscribe: 'itemHold', emit: 'onItemHold' },
            { subscribe: 'itemRendered', emit: 'onItemRendered' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'cancelTextChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemHoldTimeoutChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showCancelButtonChange' },
            { emit: 'showTitleChange' },
            { emit: 'targetChange' },
            { emit: 'titleChange' },
            { emit: 'usePopoverChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxActionSheet(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
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
    DxiItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxActionSheetComponent
  ],
  exports: [
    DxActionSheetComponent,
    DxiItemModule,
    DxTemplateModule
  ]
})
export class DxActionSheetModule { }

import type * as DxActionSheetTypes from "devextreme/ui/action_sheet_types";
export { DxActionSheetTypes };


