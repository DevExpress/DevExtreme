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




import { AnimationConfig } from 'devextreme/animation/fx';
import { PositionConfig } from 'devextreme/animation/position';
import { PositionAlignment, ToolbarItemComponent, ToolbarItemLocation } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { ToolbarLocation } from 'devextreme/ui/popup';
import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiSelectBoxToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-select-box-drop-down-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSelectBoxDropDownOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get closeOnOutsideClick(): boolean | Function {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | Function) {
        this._setOption('closeOnOutsideClick', value);
    }

    @Input()
    get container(): UserDefinedElement | string | undefined {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string | undefined) {
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
    get dragAndResizeArea(): UserDefinedElement | string | undefined {
        return this._getOption('dragAndResizeArea');
    }
    set dragAndResizeArea(value: UserDefinedElement | string | undefined) {
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
    get height(): number | Function | string {
        return this._getOption('height');
    }
    set height(value: number | Function | string) {
        this._setOption('height', value);
    }

    @Input()
    get hideOnOutsideClick(): boolean | Function {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | Function) {
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
    get maxHeight(): number | Function | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number | Function | string) {
        this._setOption('maxHeight', value);
    }

    @Input()
    get maxWidth(): number | Function | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number | Function | string) {
        this._setOption('maxWidth', value);
    }

    @Input()
    get minHeight(): number | Function | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: number | Function | string) {
        this._setOption('minHeight', value);
    }

    @Input()
    get minWidth(): number | Function | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: number | Function | string) {
        this._setOption('minWidth', value);
    }

    @Input()
    get onContentReady(): Function {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: Function) {
        this._setOption('onContentReady', value);
    }

    @Input()
    get onDisposing(): Function {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: Function) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onHidden(): Function {
        return this._getOption('onHidden');
    }
    set onHidden(value: Function) {
        this._setOption('onHidden', value);
    }

    @Input()
    get onHiding(): Function {
        return this._getOption('onHiding');
    }
    set onHiding(value: Function) {
        this._setOption('onHiding', value);
    }

    @Input()
    get onInitialized(): Function {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: Function) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): Function {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: Function) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onResize(): Function {
        return this._getOption('onResize');
    }
    set onResize(value: Function) {
        this._setOption('onResize', value);
    }

    @Input()
    get onResizeEnd(): Function {
        return this._getOption('onResizeEnd');
    }
    set onResizeEnd(value: Function) {
        this._setOption('onResizeEnd', value);
    }

    @Input()
    get onResizeStart(): Function {
        return this._getOption('onResizeStart');
    }
    set onResizeStart(value: Function) {
        this._setOption('onResizeStart', value);
    }

    @Input()
    get onShowing(): Function {
        return this._getOption('onShowing');
    }
    set onShowing(value: Function) {
        this._setOption('onShowing', value);
    }

    @Input()
    get onShown(): Function {
        return this._getOption('onShown');
    }
    set onShown(value: Function) {
        this._setOption('onShown', value);
    }

    @Input()
    get onTitleRendered(): Function {
        return this._getOption('onTitleRendered');
    }
    set onTitleRendered(value: Function) {
        this._setOption('onTitleRendered', value);
    }

    @Input()
    get position(): PositionAlignment | PositionConfig | Function {
        return this._getOption('position');
    }
    set position(value: PositionAlignment | PositionConfig | Function) {
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
    get toolbarItems(): Array<any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, options?: any, showText?: ShowTextMode, template?: any, text?: string, toolbar?: ToolbarLocation, visible?: boolean, widget?: ToolbarItemComponent }> {
        return this._getOption('toolbarItems');
    }
    set toolbarItems(value: Array<any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, options?: any, showText?: ShowTextMode, template?: any, text?: string, toolbar?: ToolbarLocation, visible?: boolean, widget?: ToolbarItemComponent }>) {
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
    get width(): number | Function | string {
        return this._getOption('width');
    }
    set width(value: number | Function | string) {
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
    @Output() heightChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<PositionAlignment | PositionConfig | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string>;
    protected get _optionPath() {
        return 'dropDownOptions';
    }


    @ContentChildren(forwardRef(() => DxiSelectBoxToolbarItemComponent))
    get toolbarItemsChildren(): QueryList<DxiSelectBoxToolbarItemComponent> {
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
    DxoSelectBoxDropDownOptionsComponent
  ],
  exports: [
    DxoSelectBoxDropDownOptionsComponent
  ],
})
export class DxoSelectBoxDropDownOptionsModule { }
