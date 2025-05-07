/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Position, PositionAlignment, ToolbarItemComponent, ToolbarItemLocation } from 'devextreme/common';
import { AnimationConfig, PositionConfig } from 'devextreme/common/core/animation';
import { UserDefinedElement } from 'devextreme/core/element';
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent, TitleRenderedEvent } from 'devextreme/ui/popover';
import { ToolbarLocation } from 'devextreme/ui/popup';
import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';

@Component({
    template: ''
})
export abstract class DxoPopupOptions extends NestedOption {
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }

    get closeOnOutsideClick(): boolean | Function {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | Function) {
        this._setOption('closeOnOutsideClick', value);
    }

    get container(): UserDefinedElement | string | undefined {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string | undefined) {
        this._setOption('container', value);
    }

    get contentTemplate(): any {
        return this._getOption('contentTemplate');
    }
    set contentTemplate(value: any) {
        this._setOption('contentTemplate', value);
    }

    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get dragAndResizeArea(): UserDefinedElement | string | undefined {
        return this._getOption('dragAndResizeArea');
    }
    set dragAndResizeArea(value: UserDefinedElement | string | undefined) {
        this._setOption('dragAndResizeArea', value);
    }

    get dragEnabled(): boolean {
        return this._getOption('dragEnabled');
    }
    set dragEnabled(value: boolean) {
        this._setOption('dragEnabled', value);
    }

    get dragOutsideBoundary(): boolean {
        return this._getOption('dragOutsideBoundary');
    }
    set dragOutsideBoundary(value: boolean) {
        this._setOption('dragOutsideBoundary', value);
    }

    get enableBodyScroll(): boolean {
        return this._getOption('enableBodyScroll');
    }
    set enableBodyScroll(value: boolean) {
        this._setOption('enableBodyScroll', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get fullScreen(): boolean {
        return this._getOption('fullScreen');
    }
    set fullScreen(value: boolean) {
        this._setOption('fullScreen', value);
    }

    get height(): number | Function | string {
        return this._getOption('height');
    }
    set height(value: number | Function | string) {
        this._setOption('height', value);
    }

    get hideOnOutsideClick(): boolean | Function {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | Function) {
        this._setOption('hideOnOutsideClick', value);
    }

    get hideOnParentScroll(): boolean {
        return this._getOption('hideOnParentScroll');
    }
    set hideOnParentScroll(value: boolean) {
        this._setOption('hideOnParentScroll', value);
    }

    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    get maxHeight(): number | Function | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number | Function | string) {
        this._setOption('maxHeight', value);
    }

    get maxWidth(): number | Function | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number | Function | string) {
        this._setOption('maxWidth', value);
    }

    get minHeight(): number | Function | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: number | Function | string) {
        this._setOption('minHeight', value);
    }

    get minWidth(): number | Function | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: number | Function | string) {
        this._setOption('minWidth', value);
    }

    get onContentReady(): Function {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: Function) {
        this._setOption('onContentReady', value);
    }

    get onDisposing(): Function {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: Function) {
        this._setOption('onDisposing', value);
    }

    get onHidden(): Function {
        return this._getOption('onHidden');
    }
    set onHidden(value: Function) {
        this._setOption('onHidden', value);
    }

    get onHiding(): Function {
        return this._getOption('onHiding');
    }
    set onHiding(value: Function) {
        this._setOption('onHiding', value);
    }

    get onInitialized(): Function {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: Function) {
        this._setOption('onInitialized', value);
    }

    get onOptionChanged(): Function {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: Function) {
        this._setOption('onOptionChanged', value);
    }

    get onResize(): Function {
        return this._getOption('onResize');
    }
    set onResize(value: Function) {
        this._setOption('onResize', value);
    }

    get onResizeEnd(): Function {
        return this._getOption('onResizeEnd');
    }
    set onResizeEnd(value: Function) {
        this._setOption('onResizeEnd', value);
    }

    get onResizeStart(): Function {
        return this._getOption('onResizeStart');
    }
    set onResizeStart(value: Function) {
        this._setOption('onResizeStart', value);
    }

    get onShowing(): Function {
        return this._getOption('onShowing');
    }
    set onShowing(value: Function) {
        this._setOption('onShowing', value);
    }

    get onShown(): Function {
        return this._getOption('onShown');
    }
    set onShown(value: Function) {
        this._setOption('onShown', value);
    }

    get onTitleRendered(): Function {
        return this._getOption('onTitleRendered');
    }
    set onTitleRendered(value: Function) {
        this._setOption('onTitleRendered', value);
    }

    get position(): PositionAlignment | PositionConfig | Function | Position {
        return this._getOption('position');
    }
    set position(value: PositionAlignment | PositionConfig | Function | Position) {
        this._setOption('position', value);
    }

    get resizeEnabled(): boolean {
        return this._getOption('resizeEnabled');
    }
    set resizeEnabled(value: boolean) {
        this._setOption('resizeEnabled', value);
    }

    get restorePosition(): boolean {
        return this._getOption('restorePosition');
    }
    set restorePosition(value: boolean) {
        this._setOption('restorePosition', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get shading(): boolean {
        return this._getOption('shading');
    }
    set shading(value: boolean) {
        this._setOption('shading', value);
    }

    get shadingColor(): string {
        return this._getOption('shadingColor');
    }
    set shadingColor(value: string) {
        this._setOption('shadingColor', value);
    }

    get showCloseButton(): boolean {
        return this._getOption('showCloseButton');
    }
    set showCloseButton(value: boolean) {
        this._setOption('showCloseButton', value);
    }

    get showTitle(): boolean {
        return this._getOption('showTitle');
    }
    set showTitle(value: boolean) {
        this._setOption('showTitle', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    get titleTemplate(): any {
        return this._getOption('titleTemplate');
    }
    set titleTemplate(value: any) {
        this._setOption('titleTemplate', value);
    }

    get toolbarItems(): Array<any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, options?: any, showText?: ShowTextMode, template?: any, text?: string, toolbar?: ToolbarLocation, visible?: boolean, widget?: ToolbarItemComponent }> {
        return this._getOption('toolbarItems');
    }
    set toolbarItems(value: Array<any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, options?: any, showText?: ShowTextMode, template?: any, text?: string, toolbar?: ToolbarLocation, visible?: boolean, widget?: ToolbarItemComponent }>) {
        this._setOption('toolbarItems', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number | Function | string {
        return this._getOption('width');
    }
    set width(value: number | Function | string) {
        this._setOption('width', value);
    }

    get wrapperAttr(): any {
        return this._getOption('wrapperAttr');
    }
    set wrapperAttr(value: any) {
        this._setOption('wrapperAttr', value);
    }

    get hideEvent(): string | undefined | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('hideEvent');
    }
    set hideEvent(value: string | undefined | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('hideEvent', value);
    }

    get showEvent(): string | undefined | { delay?: number | undefined, name?: string | undefined } {
        return this._getOption('showEvent');
    }
    set showEvent(value: string | undefined | { delay?: number | undefined, name?: string | undefined }) {
        this._setOption('showEvent', value);
    }

    get target(): UserDefinedElement | string | undefined {
        return this._getOption('target');
    }
    set target(value: UserDefinedElement | string | undefined) {
        this._setOption('target', value);
    }
}
