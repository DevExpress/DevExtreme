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

export { ExplicitTypes } from 'devextreme/ui/context_menu';

import DataSource from 'devextreme/data/data_source';
import { AnimationConfig, PositionConfig } from 'devextreme/common/core/animation';
import { event } from 'devextreme/events/events.types';
import { dxContextMenuItem, ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, OptionChangedEvent, PositioningEvent, SelectionChangedEvent, ShowingEvent, ShownEvent, ContextSubmenuDirection } from 'devextreme/ui/context_menu';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { SingleOrNone, SubmenuShowMode } from 'devextreme/common';

import DxContextMenu from 'devextreme/ui/context_menu';


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
import { DxoShowEventModule } from 'devextreme-angular/ui/nested';
import { DxoShowSubmenuModeModule } from 'devextreme-angular/ui/nested';
import { DxoDelayModule } from 'devextreme-angular/ui/nested';

import { DxoContextMenuAnimationModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuAtModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuBoundaryOffsetModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuCollisionModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuDelayModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuFromModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuHideModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxiContextMenuItemModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuMyModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuOffsetModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuPositionModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuShowModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuShowEventModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuShowSubmenuModeModule } from 'devextreme-angular/ui/context-menu/nested';
import { DxoContextMenuToModule } from 'devextreme-angular/ui/context-menu/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiContextMenuItemComponent } from 'devextreme-angular/ui/context-menu/nested';


/**
 * [descr:dxContextMenu]

 */
@Component({
    selector: 'dx-context-menu',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxContextMenuComponent<TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxContextMenu<TKey> = null;

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
     * [descr:dxContextMenuOptions.closeOnOutsideClick]
    
     * @deprecated [depNote:dxContextMenuOptions.closeOnOutsideClick]
    
     */
    @Input()
    get closeOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('closeOnOutsideClick', value);
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
     * [descr:dxContextMenuOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<dxContextMenuItem> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<dxContextMenuItem> | DataSource | DataSourceOptions | null | Store | string) {
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
     * [descr:dxContextMenuOptions.hideOnOutsideClick]
    
     */
    @Input()
    get hideOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('hideOnOutsideClick', value);
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
     * [descr:dxContextMenuOptions.items]
    
     */
    @Input()
    get items(): Array<dxContextMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxContextMenuItem>) {
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
     * [descr:dxContextMenuOptions.position]
    
     */
    @Input()
    get position(): PositionConfig {
        return this._getOption('position');
    }
    set position(value: PositionConfig) {
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
     * [descr:dxContextMenuOptions.showEvent]
    
     */
    @Input()
    get showEvent(): string | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('showEvent');
    }
    set showEvent(value: string | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('showEvent', value);
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
     * [descr:dxContextMenuOptions.submenuDirection]
    
     */
    @Input()
    get submenuDirection(): ContextSubmenuDirection {
        return this._getOption('submenuDirection');
    }
    set submenuDirection(value: ContextSubmenuDirection) {
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
     * [descr:dxContextMenuOptions.target]
    
     */
    @Input()
    get target(): any | string | undefined {
        return this._getOption('target');
    }
    set target(value: any | string | undefined) {
        this._setOption('target', value);
    }


    /**
     * [descr:dxContextMenuOptions.visible]
    
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
    
     * [descr:dxContextMenuOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onHidden]
    
    
     */
    @Output() onHidden: EventEmitter<HiddenEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onHiding]
    
    
     */
    @Output() onHiding: EventEmitter<HidingEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onItemContextMenu]
    
    
     */
    @Output() onItemContextMenu: EventEmitter<ItemContextMenuEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onItemRendered]
    
    
     */
    @Output() onItemRendered: EventEmitter<ItemRenderedEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onPositioning]
    
    
     */
    @Output() onPositioning: EventEmitter<PositioningEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onShowing]
    
    
     */
    @Output() onShowing: EventEmitter<ShowingEvent>;

    /**
    
     * [descr:dxContextMenuOptions.onShown]
    
    
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
    @Output() animationChange: EventEmitter<{ hide?: AnimationConfig, show?: AnimationConfig }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() closeOnOutsideClickChange: EventEmitter<boolean | ((event: event) => boolean)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cssClassChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<dxContextMenuItem> | DataSource | DataSourceOptions | null | Store | string>;

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
    @Output() hideOnOutsideClickChange: EventEmitter<boolean | ((event: event) => boolean)>;

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
    @Output() itemsChange: EventEmitter<Array<dxContextMenuItem>>;

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
    @Output() positionChange: EventEmitter<PositionConfig>;

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
    @Output() showEventChange: EventEmitter<string | { delay?: number | undefined, name?: string | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showSubmenuModeChange: EventEmitter<SubmenuShowMode | { delay?: number | { hide?: number, show?: number }, name?: SubmenuShowMode }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() submenuDirectionChange: EventEmitter<ContextSubmenuDirection>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

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
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;




    @ContentChildren(DxiContextMenuItemComponent)
    get itemsChildren(): QueryList<DxiContextMenuItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setContentChildren('items', value, 'DxiContextMenuItemComponent');
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
            { subscribe: 'hidden', emit: 'onHidden' },
            { subscribe: 'hiding', emit: 'onHiding' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
            { subscribe: 'itemRendered', emit: 'onItemRendered' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'positioning', emit: 'onPositioning' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'showing', emit: 'onShowing' },
            { subscribe: 'shown', emit: 'onShown' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'animationChange' },
            { emit: 'closeOnOutsideClickChange' },
            { emit: 'cssClassChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'disabledExprChange' },
            { emit: 'displayExprChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hideOnOutsideClickChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemsChange' },
            { emit: 'itemsExprChange' },
            { emit: 'itemTemplateChange' },
            { emit: 'positionChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'selectByClickChange' },
            { emit: 'selectedExprChange' },
            { emit: 'selectedItemChange' },
            { emit: 'selectionModeChange' },
            { emit: 'showEventChange' },
            { emit: 'showSubmenuModeChange' },
            { emit: 'submenuDirectionChange' },
            { emit: 'tabIndexChange' },
            { emit: 'targetChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxContextMenu(element, options);
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
    DxoShowEventModule,
    DxoShowSubmenuModeModule,
    DxoDelayModule,
    DxoContextMenuAnimationModule,
    DxoContextMenuAtModule,
    DxoContextMenuBoundaryOffsetModule,
    DxoContextMenuCollisionModule,
    DxoContextMenuDelayModule,
    DxoContextMenuFromModule,
    DxoContextMenuHideModule,
    DxiContextMenuItemModule,
    DxoContextMenuMyModule,
    DxoContextMenuOffsetModule,
    DxoContextMenuPositionModule,
    DxoContextMenuShowModule,
    DxoContextMenuShowEventModule,
    DxoContextMenuShowSubmenuModeModule,
    DxoContextMenuToModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxContextMenuComponent
  ],
  exports: [
    DxContextMenuComponent,
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
    DxoShowEventModule,
    DxoShowSubmenuModeModule,
    DxoDelayModule,
    DxoContextMenuAnimationModule,
    DxoContextMenuAtModule,
    DxoContextMenuBoundaryOffsetModule,
    DxoContextMenuCollisionModule,
    DxoContextMenuDelayModule,
    DxoContextMenuFromModule,
    DxoContextMenuHideModule,
    DxiContextMenuItemModule,
    DxoContextMenuMyModule,
    DxoContextMenuOffsetModule,
    DxoContextMenuPositionModule,
    DxoContextMenuShowModule,
    DxoContextMenuShowEventModule,
    DxoContextMenuShowSubmenuModeModule,
    DxoContextMenuToModule,
    DxTemplateModule
  ]
})
export class DxContextMenuModule { }

import type * as DxContextMenuTypes from "devextreme/ui/context_menu_types";
export { DxContextMenuTypes };


