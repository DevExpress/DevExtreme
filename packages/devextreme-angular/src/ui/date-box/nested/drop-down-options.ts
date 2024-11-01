/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import dxOverlay from 'devextreme/ui/overlay';
import DOMComponent from 'devextreme/core/dom_component';
import dxPopup from 'devextreme/ui/popup';
import { AnimationConfig, PositionConfig } from 'devextreme/common/core/animation';
import { event } from 'devextreme/events/events.types';
import { EventInfo } from 'devextreme/common/core/events';
import { Component as CoreComponent } from 'devextreme/core/component';
import { PositionAlignment } from 'devextreme/common';
import { dxPopupToolbarItem } from 'devextreme/ui/popup';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiDateBoxToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-date-box-drop-down-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDateBoxDropDownOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }

    @Input()
    get closeOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('closeOnOutsideClick', value);
    }

    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
        this._setOption('container', value);
    }

    @Input()
    get contentTemplate(): any {
        return this._getOption('contentTemplate');
    }
    set contentTemplate(value: any) {
        this._setOption('contentTemplate', value);
    }

    @Input()
    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get dragAndResizeArea(): any | string | undefined {
        return this._getOption('dragAndResizeArea');
    }
    set dragAndResizeArea(value: any | string | undefined) {
        this._setOption('dragAndResizeArea', value);
    }

    @Input()
    get dragEnabled(): boolean {
        return this._getOption('dragEnabled');
    }
    set dragEnabled(value: boolean) {
        this._setOption('dragEnabled', value);
    }

    @Input()
    get dragOutsideBoundary(): boolean {
        return this._getOption('dragOutsideBoundary');
    }
    set dragOutsideBoundary(value: boolean) {
        this._setOption('dragOutsideBoundary', value);
    }

    @Input()
    get enableBodyScroll(): boolean {
        return this._getOption('enableBodyScroll');
    }
    set enableBodyScroll(value: boolean) {
        this._setOption('enableBodyScroll', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get fullScreen(): boolean {
        return this._getOption('fullScreen');
    }
    set fullScreen(value: boolean) {
        this._setOption('fullScreen', value);
    }

    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }

    @Input()
    get hideOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('hideOnOutsideClick', value);
    }

    @Input()
    get hideOnParentScroll(): boolean {
        return this._getOption('hideOnParentScroll');
    }
    set hideOnParentScroll(value: boolean) {
        this._setOption('hideOnParentScroll', value);
    }

    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    @Input()
    get maxHeight(): (() => number | string) | number | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: (() => number | string) | number | string) {
        this._setOption('maxHeight', value);
    }

    @Input()
    get maxWidth(): (() => number | string) | number | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: (() => number | string) | number | string) {
        this._setOption('maxWidth', value);
    }

    @Input()
    get minHeight(): (() => number | string) | number | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: (() => number | string) | number | string) {
        this._setOption('minHeight', value);
    }

    @Input()
    get minWidth(): (() => number | string) | number | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: (() => number | string) | number | string) {
        this._setOption('minWidth', value);
    }

    @Input()
    get onContentReady(): ((e: EventInfo<any>) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: EventInfo<any>) => void)) {
        this._setOption('onContentReady', value);
    }

    @Input()
    get onDisposing(): ((e: EventInfo<any>) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: EventInfo<any>) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onHidden(): ((e: EventInfo<any>) => void) {
        return this._getOption('onHidden');
    }
    set onHidden(value: ((e: EventInfo<any>) => void)) {
        this._setOption('onHidden', value);
    }

    @Input()
    get onHiding(): ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void) {
        return this._getOption('onHiding');
    }
    set onHiding(value: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)) {
        this._setOption('onHiding', value);
    }

    @Input()
    get onInitialized(): ((e: { component: CoreComponent<any>, element: any }) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: { component: CoreComponent<any>, element: any }) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onResize(): ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void) {
        return this._getOption('onResize');
    }
    set onResize(value: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)) {
        this._setOption('onResize', value);
    }

    @Input()
    get onResizeEnd(): ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void) {
        return this._getOption('onResizeEnd');
    }
    set onResizeEnd(value: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)) {
        this._setOption('onResizeEnd', value);
    }

    @Input()
    get onResizeStart(): ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void) {
        return this._getOption('onResizeStart');
    }
    set onResizeStart(value: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)) {
        this._setOption('onResizeStart', value);
    }

    @Input()
    get onShowing(): ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void) {
        return this._getOption('onShowing');
    }
    set onShowing(value: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)) {
        this._setOption('onShowing', value);
    }

    @Input()
    get onShown(): ((e: EventInfo<any>) => void) {
        return this._getOption('onShown');
    }
    set onShown(value: ((e: EventInfo<any>) => void)) {
        this._setOption('onShown', value);
    }

    @Input()
    get onTitleRendered(): ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void) {
        return this._getOption('onTitleRendered');
    }
    set onTitleRendered(value: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void)) {
        this._setOption('onTitleRendered', value);
    }

    @Input()
    get position(): Function | PositionAlignment | PositionConfig {
        return this._getOption('position');
    }
    set position(value: Function | PositionAlignment | PositionConfig) {
        this._setOption('position', value);
    }

    @Input()
    get resizeEnabled(): boolean {
        return this._getOption('resizeEnabled');
    }
    set resizeEnabled(value: boolean) {
        this._setOption('resizeEnabled', value);
    }

    @Input()
    get restorePosition(): boolean {
        return this._getOption('restorePosition');
    }
    set restorePosition(value: boolean) {
        this._setOption('restorePosition', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get shading(): boolean {
        return this._getOption('shading');
    }
    set shading(value: boolean) {
        this._setOption('shading', value);
    }

    @Input()
    get shadingColor(): string {
        return this._getOption('shadingColor');
    }
    set shadingColor(value: string) {
        this._setOption('shadingColor', value);
    }

    @Input()
    get showCloseButton(): boolean {
        return this._getOption('showCloseButton');
    }
    set showCloseButton(value: boolean) {
        this._setOption('showCloseButton', value);
    }

    @Input()
    get showTitle(): boolean {
        return this._getOption('showTitle');
    }
    set showTitle(value: boolean) {
        this._setOption('showTitle', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get titleTemplate(): any {
        return this._getOption('titleTemplate');
    }
    set titleTemplate(value: any) {
        this._setOption('titleTemplate', value);
    }

    @Input()
    get toolbarItems(): Array<dxPopupToolbarItem> {
        return this._getOption('toolbarItems');
    }
    set toolbarItems(value: Array<dxPopupToolbarItem>) {
        this._setOption('toolbarItems', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }

    @Input()
    get wrapperAttr(): any {
        return this._getOption('wrapperAttr');
    }
    set wrapperAttr(value: any) {
        this._setOption('wrapperAttr', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<Function | PositionAlignment | PositionConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;
    protected get _optionPath() {
        return 'dropDownOptions';
    }


    @ContentChildren(forwardRef(() => DxiDateBoxToolbarItemComponent))
    get toolbarItemsChildren(): QueryList<DxiDateBoxToolbarItemComponent> {
        return this._getOption('toolbarItems');
    }
    set toolbarItemsChildren(value) {
        this.setChildren('toolbarItems', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'heightChange' },
            { emit: 'positionChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoDateBoxDropDownOptionsComponent
  ],
  exports: [
    DxoDateBoxDropDownOptionsComponent
  ],
})
export class DxoDateBoxDropDownOptionsModule { }
