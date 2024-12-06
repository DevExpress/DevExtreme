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
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent, TitleRenderedEvent } from 'devextreme/ui/popover';
import { Position } from 'devextreme/common';
import { dxPopupToolbarItem } from 'devextreme/ui/popup';

import DxPopover from 'devextreme/ui/popover';


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
import { DxoHideEventModule } from 'devextreme-angular/ui/nested';
import { DxoShowEventModule } from 'devextreme-angular/ui/nested';

import { DxoPopoverAnimationModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverAtModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverBoundaryOffsetModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverCollisionModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverFromModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverHideModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverHideEventModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverMyModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverOffsetModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverPositionModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverShowModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverShowEventModule } from 'devextreme-angular/ui/popover/nested';
import { DxoPopoverToModule } from 'devextreme-angular/ui/popover/nested';
import { DxiPopoverToolbarItemModule } from 'devextreme-angular/ui/popover/nested';


import { DxiPopoverToolbarItemComponent } from 'devextreme-angular/ui/popover/nested';


/**
 * [descr:dxPopover]

 */
@Component({
    selector: 'dx-popover',
    template: '<ng-content></ng-content>',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxPopoverComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPopover = null;

    /**
     * [descr:dxPopoverOptions.animation]
    
     */
    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxPopoverOptions.closeOnOutsideClick]
    
     * @deprecated [depNote:dxPopoverOptions.closeOnOutsideClick]
    
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
     * [descr:dxPopoverOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxPopoverOptions.hideEvent]
    
     */
    @Input()
    get hideEvent(): string | undefined | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('hideEvent');
    }
    set hideEvent(value: string | undefined | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('hideEvent', value);
    }


    /**
     * [descr:dxPopoverOptions.hideOnOutsideClick]
    
     */
    @Input()
    get hideOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('hideOnOutsideClick', value);
    }


    /**
     * [descr:dxPopoverOptions.hideOnParentScroll]
    
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
     * [descr:dxPopoverOptions.position]
    
     */
    @Input()
    get position(): Position | PositionConfig {
        return this._getOption('position');
    }
    set position(value: Position | PositionConfig) {
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
     * [descr:dxPopoverOptions.shading]
    
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
     * [descr:dxPopoverOptions.showEvent]
    
     */
    @Input()
    get showEvent(): string | undefined | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('showEvent');
    }
    set showEvent(value: string | undefined | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('showEvent', value);
    }


    /**
     * [descr:dxPopoverOptions.showTitle]
    
     */
    @Input()
    get showTitle(): boolean {
        return this._getOption('showTitle');
    }
    set showTitle(value: boolean) {
        this._setOption('showTitle', value);
    }


    /**
     * [descr:dxPopoverOptions.target]
    
     */
    @Input()
    get target(): any | string | undefined {
        return this._getOption('target');
    }
    set target(value: any | string | undefined) {
        this._setOption('target', value);
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
     * [descr:dxPopoverOptions.width]
    
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
    
     * [descr:dxPopoverOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxPopoverOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxPopoverOptions.onHidden]
    
    
     */
    @Output() onHidden: EventEmitter<HiddenEvent>;

    /**
    
     * [descr:dxPopoverOptions.onHiding]
    
    
     */
    @Output() onHiding: EventEmitter<HidingEvent>;

    /**
    
     * [descr:dxPopoverOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxPopoverOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxPopoverOptions.onShowing]
    
    
     */
    @Output() onShowing: EventEmitter<ShowingEvent>;

    /**
    
     * [descr:dxPopoverOptions.onShown]
    
    
     */
    @Output() onShown: EventEmitter<ShownEvent>;

    /**
    
     * [descr:dxPopoverOptions.onTitleRendered]
    
    
     */
    @Output() onTitleRendered: EventEmitter<TitleRenderedEvent>;

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
    @Output() enableBodyScrollChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideEventChange: EventEmitter<string | undefined | { delay?: number | undefined, name?: string | undefined }>;

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
    @Output() positionChange: EventEmitter<Position | PositionConfig>;

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
    @Output() showEventChange: EventEmitter<string | undefined | { delay?: number | undefined, name?: string | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showTitleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetChange: EventEmitter<any | string | undefined>;

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




    @ContentChildren(DxiPopoverToolbarItemComponent)
    get toolbarItemsChildren(): QueryList<DxiPopoverToolbarItemComponent> {
        return this._getOption('toolbarItems');
    }
    set toolbarItemsChildren(value) {
        this.setContentChildren('toolbarItems', value, 'DxiPopoverToolbarItemComponent');
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
            { subscribe: 'showing', emit: 'onShowing' },
            { subscribe: 'shown', emit: 'onShown' },
            { subscribe: 'titleRendered', emit: 'onTitleRendered' },
            { emit: 'animationChange' },
            { emit: 'closeOnOutsideClickChange' },
            { emit: 'containerChange' },
            { emit: 'contentTemplateChange' },
            { emit: 'deferRenderingChange' },
            { emit: 'disabledChange' },
            { emit: 'enableBodyScrollChange' },
            { emit: 'heightChange' },
            { emit: 'hideEventChange' },
            { emit: 'hideOnOutsideClickChange' },
            { emit: 'hideOnParentScrollChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'maxHeightChange' },
            { emit: 'maxWidthChange' },
            { emit: 'minHeightChange' },
            { emit: 'minWidthChange' },
            { emit: 'positionChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'shadingChange' },
            { emit: 'shadingColorChange' },
            { emit: 'showCloseButtonChange' },
            { emit: 'showEventChange' },
            { emit: 'showTitleChange' },
            { emit: 'targetChange' },
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

        return new DxPopover(element, options);
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
    DxoHideEventModule,
    DxoShowEventModule,
    DxoPopoverAnimationModule,
    DxoPopoverAtModule,
    DxoPopoverBoundaryOffsetModule,
    DxoPopoverCollisionModule,
    DxoPopoverFromModule,
    DxoPopoverHideModule,
    DxoPopoverHideEventModule,
    DxoPopoverMyModule,
    DxoPopoverOffsetModule,
    DxoPopoverPositionModule,
    DxoPopoverShowModule,
    DxoPopoverShowEventModule,
    DxoPopoverToModule,
    DxiPopoverToolbarItemModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxPopoverComponent
  ],
  exports: [
    DxPopoverComponent,
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
    DxoHideEventModule,
    DxoShowEventModule,
    DxoPopoverAnimationModule,
    DxoPopoverAtModule,
    DxoPopoverBoundaryOffsetModule,
    DxoPopoverCollisionModule,
    DxoPopoverFromModule,
    DxoPopoverHideModule,
    DxoPopoverHideEventModule,
    DxoPopoverMyModule,
    DxoPopoverOffsetModule,
    DxoPopoverPositionModule,
    DxoPopoverShowModule,
    DxoPopoverShowEventModule,
    DxoPopoverToModule,
    DxiPopoverToolbarItemModule,
    DxTemplateModule
  ]
})
export class DxPopoverModule { }

import type * as DxPopoverTypes from "devextreme/ui/popover_types";
export { DxPopoverTypes };


