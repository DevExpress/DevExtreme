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

export { ExplicitTypes } from 'devextreme/ui/menu';

import DataSource from 'devextreme/data/data_source';
import { AnimationConfig } from 'devextreme/common/core/animation';
import { dxMenuItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, OptionChangedEvent, SelectionChangedEvent, SubmenuHiddenEvent, SubmenuHidingEvent, SubmenuShowingEvent, SubmenuShownEvent, SubmenuDirection } from 'devextreme/ui/menu';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { Orientation, SingleOrNone, SubmenuShowMode } from 'devextreme/common';

import DxMenu from 'devextreme/ui/menu';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
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
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoShowFirstSubmenuModeModule } from 'devextreme-angular/ui/nested';
import { DxoDelayModule } from 'devextreme-angular/ui/nested';
import { DxoShowSubmenuModeModule } from 'devextreme-angular/ui/nested';

import { DxoMenuAnimationModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuAtModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuBoundaryOffsetModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuCollisionModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuDelayModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuFromModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuHideModule } from 'devextreme-angular/ui/menu/nested';
import { DxiMenuItemModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuMyModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuOffsetModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuPositionModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuShowModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuShowFirstSubmenuModeModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuShowSubmenuModeModule } from 'devextreme-angular/ui/menu/nested';
import { DxoMenuToModule } from 'devextreme-angular/ui/menu/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiMenuItemComponent } from 'devextreme-angular/ui/menu/nested';


/**
 * [descr:dxMenu]

 */
@Component({
    selector: 'dx-menu',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxMenuComponent<TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxMenu<TKey> = null;

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
     * [descr:dxMenuBaseOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxMenuOptions.adaptivityEnabled]
    
     */
    @Input()
    get adaptivityEnabled(): boolean {
        return this._getOption('adaptivityEnabled');
    }
    set adaptivityEnabled(value: boolean) {
        this._setOption('adaptivityEnabled', value);
    }


    /**
     * [descr:dxMenuBaseOptions.animation]
    
     */
    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxMenuBaseOptions.cssClass]
    
     */
    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }


    /**
     * [descr:dxMenuOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<dxMenuItem> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<dxMenuItem> | DataSource | DataSourceOptions | null | Store | string) {
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
     * [descr:HierarchicalCollectionWidgetOptions.disabledExpr]
    
     */
    @Input()
    get disabledExpr(): Function | string {
        return this._getOption('disabledExpr');
    }
    set disabledExpr(value: Function | string) {
        this._setOption('disabledExpr', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.displayExpr]
    
     */
    @Input()
    get displayExpr(): ((item: any) => string) | string {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: ((item: any) => string) | string) {
        this._setOption('displayExpr', value);
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
     * [descr:HierarchicalCollectionWidgetOptions.focusStateEnabled]
    
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
     * [descr:dxMenuOptions.hideSubmenuOnMouseLeave]
    
     */
    @Input()
    get hideSubmenuOnMouseLeave(): boolean {
        return this._getOption('hideSubmenuOnMouseLeave');
    }
    set hideSubmenuOnMouseLeave(value: boolean) {
        this._setOption('hideSubmenuOnMouseLeave', value);
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
     * [descr:HierarchicalCollectionWidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxMenuOptions.items]
    
     */
    @Input()
    get items(): Array<dxMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxMenuItem>) {
        this._setOption('items', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.itemsExpr]
    
     */
    @Input()
    get itemsExpr(): Function | string {
        return this._getOption('itemsExpr');
    }
    set itemsExpr(value: Function | string) {
        this._setOption('itemsExpr', value);
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
     * [descr:dxMenuOptions.orientation]
    
     */
    @Input()
    get orientation(): Orientation {
        return this._getOption('orientation');
    }
    set orientation(value: Orientation) {
        this._setOption('orientation', value);
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
     * [descr:dxMenuBaseOptions.selectByClick]
    
     */
    @Input()
    get selectByClick(): boolean {
        return this._getOption('selectByClick');
    }
    set selectByClick(value: boolean) {
        this._setOption('selectByClick', value);
    }


    /**
     * [descr:HierarchicalCollectionWidgetOptions.selectedExpr]
    
     */
    @Input()
    get selectedExpr(): Function | string {
        return this._getOption('selectedExpr');
    }
    set selectedExpr(value: Function | string) {
        this._setOption('selectedExpr', value);
    }


    /**
     * [descr:CollectionWidgetOptions.selectedItem]
    
     */
    @Input()
    get selectedItem(): any {
        return this._getOption('selectedItem');
    }
    set selectedItem(value: any) {
        this._setOption('selectedItem', value);
    }


    /**
     * [descr:dxMenuBaseOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): SingleOrNone {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: SingleOrNone) {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:dxMenuOptions.showFirstSubmenuMode]
    
     */
    @Input()
    get showFirstSubmenuMode(): SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode } {
        return this._getOption('showFirstSubmenuMode');
    }
    set showFirstSubmenuMode(value: SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode }) {
        this._setOption('showFirstSubmenuMode', value);
    }


    /**
     * [descr:dxMenuBaseOptions.showSubmenuMode]
    
     */
    @Input()
    get showSubmenuMode(): SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode } {
        return this._getOption('showSubmenuMode');
    }
    set showSubmenuMode(value: SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode }) {
        this._setOption('showSubmenuMode', value);
    }


    /**
     * [descr:dxMenuOptions.submenuDirection]
    
     */
    @Input()
    get submenuDirection(): SubmenuDirection {
        return this._getOption('submenuDirection');
    }
    set submenuDirection(value: SubmenuDirection) {
        this._setOption('submenuDirection', value);
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
    
     * [descr:dxMenuOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxMenuOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxMenuOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxMenuOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxMenuOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxMenuOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxMenuOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxMenuOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxMenuOptions.onSubmenuHidden]
    
    
     */
    @Output() onSubmenuHidden: EventEmitter<SubmenuHiddenEvent>;

    /**
    
     * [descr:dxMenuOptions.onSubmenuHiding]
    
    
     */
    @Output() onSubmenuHiding: EventEmitter<SubmenuHidingEvent>;

    /**
    
     * [descr:dxMenuOptions.onSubmenuShowing]
    
    
     */
    @Output() onSubmenuShowing: EventEmitter<SubmenuShowingEvent>;

    /**
    
     * [descr:dxMenuOptions.onSubmenuShown]
    
    
     */
    @Output() onSubmenuShown: EventEmitter<SubmenuShownEvent>;

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
    @Output() adaptivityEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<{ hide?: AnimationConfig, show?: AnimationConfig }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cssClassChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<dxMenuItem> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() displayExprChange: EventEmitter<((item: any) => string) | string>;

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
    @Output() hideSubmenuOnMouseLeaveChange: EventEmitter<boolean>;

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
    @Output() itemsChange: EventEmitter<Array<dxMenuItem>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() orientationChange: EventEmitter<Orientation>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectByClickChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<SingleOrNone>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showFirstSubmenuModeChange: EventEmitter<SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showSubmenuModeChange: EventEmitter<SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() submenuDirectionChange: EventEmitter<SubmenuDirection>;

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




    @ContentChildren(DxiMenuItemComponent)
    get itemsChildren(): QueryList<DxiMenuItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setContentChildren('items', value, 'DxiMenuItemComponent');
        this.setChildren('items', value);
    }


    @ContentChildren(DxiItemComponent)
    get itemsLegacyChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsLegacyChildren(value) {
        if (this.checkContentChildren('items', value, 'DxiItemComponent')) {
           this.setChildren('items', value);
        }
    }




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
            { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
            { subscribe: 'itemRendered', emit: 'onItemRendered' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'submenuHidden', emit: 'onSubmenuHidden' },
            { subscribe: 'submenuHiding', emit: 'onSubmenuHiding' },
            { subscribe: 'submenuShowing', emit: 'onSubmenuShowing' },
            { subscribe: 'submenuShown', emit: 'onSubmenuShown' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'adaptivityEnabledChange' },
            { emit: 'animationChange' },
            { emit: 'cssClassChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'disabledExprChange' },
            { emit: 'displayExprChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hideSubmenuOnMouseLeaveChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemsChange' },
            { emit: 'itemsExprChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'orientationChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'selectByClickChange' },
            { emit: 'selectedExprChange' },
            { emit: 'selectedItemChange' },
            { emit: 'selectionModeChange' },
            { emit: 'showFirstSubmenuModeChange' },
            { emit: 'showSubmenuModeChange' },
            { emit: 'submenuDirectionChange' },
            { emit: 'tabIndexChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxMenu(element, options);
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
    DxoShowFirstSubmenuModeModule,
    DxoDelayModule,
    DxoShowSubmenuModeModule,
    DxoMenuAnimationModule,
    DxoMenuAtModule,
    DxoMenuBoundaryOffsetModule,
    DxoMenuCollisionModule,
    DxoMenuDelayModule,
    DxoMenuFromModule,
    DxoMenuHideModule,
    DxiMenuItemModule,
    DxoMenuMyModule,
    DxoMenuOffsetModule,
    DxoMenuPositionModule,
    DxoMenuShowModule,
    DxoMenuShowFirstSubmenuModeModule,
    DxoMenuShowSubmenuModeModule,
    DxoMenuToModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxMenuComponent
  ],
  exports: [
    DxMenuComponent,
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
    DxoShowFirstSubmenuModeModule,
    DxoDelayModule,
    DxoShowSubmenuModeModule,
    DxoMenuAnimationModule,
    DxoMenuAtModule,
    DxoMenuBoundaryOffsetModule,
    DxoMenuCollisionModule,
    DxoMenuDelayModule,
    DxoMenuFromModule,
    DxoMenuHideModule,
    DxiMenuItemModule,
    DxoMenuMyModule,
    DxoMenuOffsetModule,
    DxoMenuPositionModule,
    DxoMenuShowModule,
    DxoMenuShowFirstSubmenuModeModule,
    DxoMenuShowSubmenuModeModule,
    DxoMenuToModule,
    DxTemplateModule
  ]
})
export class DxMenuModule { }

import type * as DxMenuTypes from "devextreme/ui/menu_types";
export { DxMenuTypes };


