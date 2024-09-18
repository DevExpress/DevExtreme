/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Mode } from 'devextreme/common';
import { PagerDisplayMode, PagerPageSize } from 'devextreme/ui/pager';

@Component({
    template: ''
})
export abstract class DxoPager extends NestedOption {
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    get allowedPageSizes(): Mode | Array<PagerPageSize | number> {
        return this._getOption('allowedPageSizes');
    }
    set allowedPageSizes(value: Mode | Array<PagerPageSize | number>) {
        this._setOption('allowedPageSizes', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get displayMode(): PagerDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: PagerDisplayMode) {
        this._setOption('displayMode', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
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

    get infoText(): string {
        return this._getOption('infoText');
    }
    set infoText(value: string) {
        this._setOption('infoText', value);
    }

    get label(): string {
        return this._getOption('label');
    }
    set label(value: string) {
        this._setOption('label', value);
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

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get showInfo(): boolean {
        return this._getOption('showInfo');
    }
    set showInfo(value: boolean) {
        this._setOption('showInfo', value);
    }

    get showNavigationButtons(): boolean {
        return this._getOption('showNavigationButtons');
    }
    set showNavigationButtons(value: boolean) {
        this._setOption('showNavigationButtons', value);
    }

    get showPageSizeSelector(): boolean {
        return this._getOption('showPageSizeSelector');
    }
    set showPageSizeSelector(value: boolean) {
        this._setOption('showPageSizeSelector', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get visible(): Mode | boolean {
        return this._getOption('visible');
    }
    set visible(value: Mode | boolean) {
        this._setOption('visible', value);
    }

    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }
}
