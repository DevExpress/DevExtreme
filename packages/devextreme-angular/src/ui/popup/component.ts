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


import { AnimationConfig, PositionConfig } from 'devextreme/common/core/animation';
import { event } from 'devextreme/events/events.types';
import { EventInfo } from 'devextreme/common/core/events';
import { PositionAlignment } from 'devextreme/common';
import { dxPopupToolbarItem } from 'devextreme/ui/popup';

import DxPopup from 'devextreme/ui/popup';


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

import { DxoPopupAnimationModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupAtModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupBoundaryOffsetModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupCollisionModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupFromModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupHideModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupMyModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupOffsetModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupPositionModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupShowModule } from 'devextreme-angular/ui/popup/nested';
import { DxoPopupToModule } from 'devextreme-angular/ui/popup/nested';
import { DxiPopupToolbarItemModule } from 'devextreme-angular/ui/popup/nested';


import { DxiPopupToolbarItemComponent } from 'devextreme-angular/ui/popup/nested';


/**
 * [descr:dxPopup]

 */
@Component({
    selector: 'dx-popup',
    template: '<ng-content></ng-content>',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxPopupComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPopup = null;

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
     * [descr:dxPopupOptions.animation]
    
     */
    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxOverlayOptions.closeOnOutsideClick]
    
     * @deprecated [depNote:dxOverlayOptions.closeOnOutsideClick]
    
     */
    @Input()
    get closeOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('closeOnOutsideClick', value);
    }


    /**
     * [descr:dxPopupOptions.container]
    
     */
    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
        this._setOption('container', value);
    }


    /**
     * [descr:dxOverlayOptions.contentTemplate]
    
     */
    @Input()
    get contentTemplate(): any {
        return this._getOption('contentTemplate');
    }
    set contentTemplate(value: any) {
        this._setOption('contentTemplate', value);
    }


    /**
     * [descr:dxOverlayOptions.deferRendering]
    
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
     * [descr:dxPopupOptions.dragAndResizeArea]
    
     */
    @Input()
    get dragAndResizeArea(): any | string | undefined {
        return this._getOption('dragAndResizeArea');
    }
    set dragAndResizeArea(value: any | string | undefined) {
        this._setOption('dragAndResizeArea', value);
    }


    /**
     * [descr:dxPopupOptions.dragEnabled]
    
     */
    @Input()
    get dragEnabled(): boolean {
        return this._getOption('dragEnabled');
    }
    set dragEnabled(value: boolean) {
        this._setOption('dragEnabled', value);
    }


    /**
     * [descr:dxPopupOptions.dragOutsideBoundary]
    
     */
    @Input()
    get dragOutsideBoundary(): boolean {
        return this._getOption('dragOutsideBoundary');
    }
    set dragOutsideBoundary(value: boolean) {
        this._setOption('dragOutsideBoundary', value);
    }


    /**
     * [descr:dxPopupOptions.enableBodyScroll]
    
     */
    @Input()
    get enableBodyScroll(): boolean {
        return this._getOption('enableBodyScroll');
    }
    set enableBodyScroll(value: boolean) {
        this._setOption('enableBodyScroll', value);
    }


    /**
     * [descr:dxPopupOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxPopupOptions.fullScreen]
    
     */
    @Input()
    get fullScreen(): boolean {
        return this._getOption('fullScreen');
    }
    set fullScreen(value: boolean) {
        this._setOption('fullScreen', value);
    }


    /**
     * [descr:dxPopupOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxOverlayOptions.hideOnOutsideClick]
    
     */
    @Input()
    get hideOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('hideOnOutsideClick', value);
    }


    /**
     * [descr:dxOverlayOptions.hideOnParentScroll]
    
     */
    @Input()
    get hideOnParentScroll(): boolean {
        return this._getOption('hideOnParentScroll');
    }
    set hideOnParentScroll(value: boolean) {
        this._setOption('hideOnParentScroll', value);
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
     * [descr:dxOverlayOptions.maxHeight]
    
     */
    @Input()
    get maxHeight(): (() => number | string) | number | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: (() => number | string) | number | string) {
        this._setOption('maxHeight', value);
    }


    /**
     * [descr:dxOverlayOptions.maxWidth]
    
     */
    @Input()
    get maxWidth(): (() => number | string) | number | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: (() => number | string) | number | string) {
        this._setOption('maxWidth', value);
    }


    /**
     * [descr:dxOverlayOptions.minHeight]
    
     */
    @Input()
    get minHeight(): (() => number | string) | number | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: (() => number | string) | number | string) {
        this._setOption('minHeight', value);
    }


    /**
     * [descr:dxOverlayOptions.minWidth]
    
     */
    @Input()
    get minWidth(): (() => number | string) | number | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: (() => number | string) | number | string) {
        this._setOption('minWidth', value);
    }


    /**
     * [descr:dxPopupOptions.position]
    
     */
    @Input()
    get position(): Function | PositionAlignment | PositionConfig {
        return this._getOption('position');
    }
    set position(value: Function | PositionAlignment | PositionConfig) {
        this._setOption('position', value);
    }


    /**
     * [descr:dxPopupOptions.resizeEnabled]
    
     */
    @Input()
    get resizeEnabled(): boolean {
        return this._getOption('resizeEnabled');
    }
    set resizeEnabled(value: boolean) {
        this._setOption('resizeEnabled', value);
    }


    /**
     * [descr:dxPopupOptions.restorePosition]
    
     */
    @Input()
    get restorePosition(): boolean {
        return this._getOption('restorePosition');
    }
    set restorePosition(value: boolean) {
        this._setOption('restorePosition', value);
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
     * [descr:dxOverlayOptions.shading]
    
     */
    @Input()
    get shading(): boolean {
        return this._getOption('shading');
    }
    set shading(value: boolean) {
        this._setOption('shading', value);
    }


    /**
     * [descr:dxOverlayOptions.shadingColor]
    
     */
    @Input()
    get shadingColor(): string {
        return this._getOption('shadingColor');
    }
    set shadingColor(value: string) {
        this._setOption('shadingColor', value);
    }


    /**
     * [descr:dxPopupOptions.showCloseButton]
    
     */
    @Input()
    get showCloseButton(): boolean {
        return this._getOption('showCloseButton');
    }
    set showCloseButton(value: boolean) {
        this._setOption('showCloseButton', value);
    }


    /**
     * [descr:dxPopupOptions.showTitle]
    
     */
    @Input()
    get showTitle(): boolean {
        return this._getOption('showTitle');
    }
    set showTitle(value: boolean) {
        this._setOption('showTitle', value);
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
     * [descr:dxPopupOptions.title]
    
     */
    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxPopupOptions.titleTemplate]
    
     */
    @Input()
    get titleTemplate(): any {
        return this._getOption('titleTemplate');
    }
    set titleTemplate(value: any) {
        this._setOption('titleTemplate', value);
    }


    /**
     * [descr:dxPopupOptions.toolbarItems]
    
     */
    @Input()
    get toolbarItems(): Array<dxPopupToolbarItem> {
        return this._getOption('toolbarItems');
    }
    set toolbarItems(value: Array<dxPopupToolbarItem>) {
        this._setOption('toolbarItems', value);
    }


    /**
     * [descr:dxOverlayOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:dxPopupOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxOverlayOptions.wrapperAttr]
    
     */
    @Input()
    get wrapperAttr(): any {
        return this._getOption('wrapperAttr');
    }
    set wrapperAttr(value: any) {
        this._setOption('wrapperAttr', value);
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
    
     * [descr:dxOverlayOptions.onHidden]
    
    
     */
    @Output() onHidden: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:dxOverlayOptions.onHiding]
    
    
     */
    @Output() onHiding: EventEmitter<Object>;

    /**
    
     * [descr:ComponentOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<Object>;

    /**
    
     * [descr:DOMComponentOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<Object>;

    /**
    
     * [descr:dxPopupOptions.onResize]
    
    
     */
    @Output() onResize: EventEmitter<Object>;

    /**
    
     * [descr:dxPopupOptions.onResizeEnd]
    
    
     */
    @Output() onResizeEnd: EventEmitter<Object>;

    /**
    
     * [descr:dxPopupOptions.onResizeStart]
    
    
     */
    @Output() onResizeStart: EventEmitter<Object>;

    /**
    
     * [descr:dxOverlayOptions.onShowing]
    
    
     */
    @Output() onShowing: EventEmitter<Object>;

    /**
    
     * [descr:dxOverlayOptions.onShown]
    
    
     */
    @Output() onShown: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:dxPopupOptions.onTitleRendered]
    
    
     */
    @Output() onTitleRendered: EventEmitter<Object>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

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
    @Output() containerChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() contentTemplateChange: EventEmitter<any>;

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
    @Output() dragAndResizeAreaChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dragEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dragOutsideBoundaryChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() enableBodyScrollChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fullScreenChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideOnOutsideClickChange: EventEmitter<boolean | ((event: event) => boolean)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideOnParentScrollChange: EventEmitter<boolean>;

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
    @Output() maxHeightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxWidthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minHeightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minWidthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<Function | PositionAlignment | PositionConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resizeEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() restorePositionChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() shadingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() shadingColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showCloseButtonChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showTitleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarItemsChange: EventEmitter<Array<dxPopupToolbarItem>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wrapperAttrChange: EventEmitter<any>;




    @ContentChildren(DxiPopupToolbarItemComponent)
    get toolbarItemsChildren(): QueryList<DxiPopupToolbarItemComponent> {
        return this._getOption('toolbarItems');
    }
    set toolbarItemsChildren(value) {
        this.setContentChildren('toolbarItems', value, 'DxiPopupToolbarItemComponent');
        this.setChildren('toolbarItems', value);
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
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'resize', emit: 'onResize' },
            { subscribe: 'resizeEnd', emit: 'onResizeEnd' },
            { subscribe: 'resizeStart', emit: 'onResizeStart' },
            { subscribe: 'showing', emit: 'onShowing' },
            { subscribe: 'shown', emit: 'onShown' },
            { subscribe: 'titleRendered', emit: 'onTitleRendered' },
            { emit: 'accessKeyChange' },
            { emit: 'animationChange' },
            { emit: 'closeOnOutsideClickChange' },
            { emit: 'containerChange' },
            { emit: 'contentTemplateChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'dragAndResizeAreaChange' },
            { emit: 'dragEnabledChange' },
            { emit: 'dragOutsideBoundaryChange' },
            { emit: 'enableBodyScrollChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'fullScreenChange' },
            { emit: 'heightChange' },
            { emit: 'hideOnOutsideClickChange' },
            { emit: 'hideOnParentScrollChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'maxHeightChange' },
            { emit: 'maxWidthChange' },
            { emit: 'minHeightChange' },
            { emit: 'minWidthChange' },
            { emit: 'positionChange' },
            { emit: 'resizeEnabledChange' },
            { emit: 'restorePositionChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'shadingChange' },
            { emit: 'shadingColorChange' },
            { emit: 'showCloseButtonChange' },
            { emit: 'showTitleChange' },
            { emit: 'tabIndexChange' },
            { emit: 'titleChange' },
            { emit: 'titleTemplateChange' },
            { emit: 'toolbarItemsChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wrapperAttrChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxPopup(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('toolbarItems', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('toolbarItems');
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
    DxoPopupAnimationModule,
    DxoPopupAtModule,
    DxoPopupBoundaryOffsetModule,
    DxoPopupCollisionModule,
    DxoPopupFromModule,
    DxoPopupHideModule,
    DxoPopupMyModule,
    DxoPopupOffsetModule,
    DxoPopupPositionModule,
    DxoPopupShowModule,
    DxoPopupToModule,
    DxiPopupToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxPopupComponent
  ],
  exports: [
    DxPopupComponent,
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
    DxoPopupAnimationModule,
    DxoPopupAtModule,
    DxoPopupBoundaryOffsetModule,
    DxoPopupCollisionModule,
    DxoPopupFromModule,
    DxoPopupHideModule,
    DxoPopupMyModule,
    DxoPopupOffsetModule,
    DxoPopupPositionModule,
    DxoPopupShowModule,
    DxoPopupToModule,
    DxiPopupToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxPopupModule { }

import type * as DxPopupTypes from "devextreme/ui/popup_types";
export { DxPopupTypes };


