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


import DataSource from 'devextreme/data/data_source';
import { dxDropDownButtonItem, ButtonClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, OptionChangedEvent, SelectionChangedEvent } from 'devextreme/ui/drop_down_button';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxPopupOptions } from 'devextreme/ui/popup';
import { ButtonStyle, ButtonType } from 'devextreme/common';

import DxDropDownButton from 'devextreme/ui/drop_down_button';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoDropDownOptionsModule } from 'devextreme-angular/ui/nested';
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
import { DxiItemModule } from 'devextreme-angular/ui/nested';

import { DxoDropDownButtonAnimationModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonAtModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonBoundaryOffsetModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonCollisionModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonDropDownOptionsModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonFromModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonHideModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxiDropDownButtonItemModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonMyModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonOffsetModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonPositionModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonShowModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxoDropDownButtonToModule } from 'devextreme-angular/ui/drop-down-button/nested';
import { DxiDropDownButtonToolbarItemModule } from 'devextreme-angular/ui/drop-down-button/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiDropDownButtonItemComponent } from 'devextreme-angular/ui/drop-down-button/nested';


/**
 * [descr:dxDropDownButton]

 */
@Component({
    selector: 'dx-drop-down-button',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxDropDownButtonComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxDropDownButton = null;

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
     * [descr:dxDropDownButtonOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any | dxDropDownButtonItem> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any | dxDropDownButtonItem> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.deferRendering]
    
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
     * [descr:dxDropDownButtonOptions.displayExpr]
    
     */
    @Input()
    get displayExpr(): ((itemData: any) => string) | string | undefined {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: ((itemData: any) => string) | string | undefined) {
        this._setOption('displayExpr', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.dropDownContentTemplate]
    
     */
    @Input()
    get dropDownContentTemplate(): any {
        return this._getOption('dropDownContentTemplate');
    }
    set dropDownContentTemplate(value: any) {
        this._setOption('dropDownContentTemplate', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.dropDownOptions]
    
     */
    @Input()
    get dropDownOptions(): dxPopupOptions<any> {
        return this._getOption('dropDownOptions');
    }
    set dropDownOptions(value: dxPopupOptions<any>) {
        this._setOption('dropDownOptions', value);
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
     * [descr:dxDropDownButtonOptions.focusStateEnabled]
    
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
     * [descr:dxDropDownButtonOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.icon]
    
     */
    @Input()
    get icon(): string | undefined {
        return this._getOption('icon');
    }
    set icon(value: string | undefined) {
        this._setOption('icon', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.items]
    
     */
    @Input()
    get items(): Array<any | dxDropDownButtonItem> {
        return this._getOption('items');
    }
    set items(value: Array<any | dxDropDownButtonItem>) {
        this._setOption('items', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.itemTemplate]
    
     */
    @Input()
    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.noDataText]
    
     */
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.opened]
    
     */
    @Input()
    get opened(): boolean {
        return this._getOption('opened');
    }
    set opened(value: boolean) {
        this._setOption('opened', value);
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
     * [descr:dxDropDownButtonOptions.selectedItem]
    
     */
    @Input()
    get selectedItem(): any | number | string {
        return this._getOption('selectedItem');
    }
    set selectedItem(value: any | number | string) {
        this._setOption('selectedItem', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.selectedItemKey]
    
     */
    @Input()
    get selectedItemKey(): number | string {
        return this._getOption('selectedItemKey');
    }
    set selectedItemKey(value: number | string) {
        this._setOption('selectedItemKey', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.showArrowIcon]
    
     */
    @Input()
    get showArrowIcon(): boolean {
        return this._getOption('showArrowIcon');
    }
    set showArrowIcon(value: boolean) {
        this._setOption('showArrowIcon', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.splitButton]
    
     */
    @Input()
    get splitButton(): boolean {
        return this._getOption('splitButton');
    }
    set splitButton(value: boolean) {
        this._setOption('splitButton', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.stylingMode]
    
     */
    @Input()
    get stylingMode(): ButtonStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: ButtonStyle) {
        this._setOption('stylingMode', value);
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
     * [descr:dxDropDownButtonOptions.template]
    
     */
    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.text]
    
     */
    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.type]
    
     */
    @Input()
    get type(): ButtonType {
        return this._getOption('type');
    }
    set type(value: ButtonType) {
        this._setOption('type', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.useItemTextAsTitle]
    
     */
    @Input()
    get useItemTextAsTitle(): boolean {
        return this._getOption('useItemTextAsTitle');
    }
    set useItemTextAsTitle(value: boolean) {
        this._setOption('useItemTextAsTitle', value);
    }


    /**
     * [descr:dxDropDownButtonOptions.useSelectMode]
    
     */
    @Input()
    get useSelectMode(): boolean {
        return this._getOption('useSelectMode');
    }
    set useSelectMode(value: boolean) {
        this._setOption('useSelectMode', value);
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
     * [descr:dxDropDownButtonOptions.wrapItemText]
    
     */
    @Input()
    get wrapItemText(): boolean {
        return this._getOption('wrapItemText');
    }
    set wrapItemText(value: boolean) {
        this._setOption('wrapItemText', value);
    }

    /**
    
     * [descr:dxDropDownButtonOptions.onButtonClick]
    
    
     */
    @Output() onButtonClick: EventEmitter<ButtonClickEvent>;

    /**
    
     * [descr:dxDropDownButtonOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxDropDownButtonOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxDropDownButtonOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxDropDownButtonOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxDropDownButtonOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxDropDownButtonOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

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
    @Output() dataSourceChange: EventEmitter<Array<any | dxDropDownButtonItem> | DataSource | DataSourceOptions | null | Store | string>;

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
    @Output() displayExprChange: EventEmitter<((itemData: any) => string) | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownContentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropDownOptionsChange: EventEmitter<dxPopupOptions<any>>;

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
    @Output() iconChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<any | dxDropDownButtonItem>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyExprChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() openedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemChange: EventEmitter<any | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemKeyChange: EventEmitter<number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showArrowIconChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() splitButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stylingModeChange: EventEmitter<ButtonStyle>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() templateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() typeChange: EventEmitter<ButtonType>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useItemTextAsTitleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useSelectModeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wrapItemTextChange: EventEmitter<boolean>;




    @ContentChildren(DxiDropDownButtonItemComponent)
    get itemsChildren(): QueryList<DxiDropDownButtonItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiDropDownButtonItemComponent');
    }


    @ContentChildren(DxiItemComponent)
    get itemsLegacyChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsLegacyChildren(value) {
        this._setChildren('items', value, 'DxiItemComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'buttonClick', emit: 'onButtonClick' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'dataSourceChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'displayExprChange' },
            { emit: 'dropDownContentTemplateChange' },
            { emit: 'dropDownOptionsChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'iconChange' },
            { emit: 'itemsChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'keyExprChange' },
            { emit: 'noDataTextChange' },
            { emit: 'openedChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'selectedItemChange' },
            { emit: 'selectedItemKeyChange' },
            { emit: 'showArrowIconChange' },
            { emit: 'splitButtonChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'templateChange' },
            { emit: 'textChange' },
            { emit: 'typeChange' },
            { emit: 'useItemTextAsTitleChange' },
            { emit: 'useSelectModeChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wrapItemTextChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxDropDownButton(element, options);
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
    DxoDropDownOptionsModule,
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
    DxiItemModule,
    DxoDropDownButtonAnimationModule,
    DxoDropDownButtonAtModule,
    DxoDropDownButtonBoundaryOffsetModule,
    DxoDropDownButtonCollisionModule,
    DxoDropDownButtonDropDownOptionsModule,
    DxoDropDownButtonFromModule,
    DxoDropDownButtonHideModule,
    DxiDropDownButtonItemModule,
    DxoDropDownButtonMyModule,
    DxoDropDownButtonOffsetModule,
    DxoDropDownButtonPositionModule,
    DxoDropDownButtonShowModule,
    DxoDropDownButtonToModule,
    DxiDropDownButtonToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxDropDownButtonComponent
  ],
  exports: [
    DxDropDownButtonComponent,
    DxoDropDownOptionsModule,
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
    DxiItemModule,
    DxoDropDownButtonAnimationModule,
    DxoDropDownButtonAtModule,
    DxoDropDownButtonBoundaryOffsetModule,
    DxoDropDownButtonCollisionModule,
    DxoDropDownButtonDropDownOptionsModule,
    DxoDropDownButtonFromModule,
    DxoDropDownButtonHideModule,
    DxiDropDownButtonItemModule,
    DxoDropDownButtonMyModule,
    DxoDropDownButtonOffsetModule,
    DxoDropDownButtonPositionModule,
    DxoDropDownButtonShowModule,
    DxoDropDownButtonToModule,
    DxiDropDownButtonToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxDropDownButtonModule { }

import type * as DxDropDownButtonTypes from "devextreme/ui/drop_down_button_types";
export { DxDropDownButtonTypes };


