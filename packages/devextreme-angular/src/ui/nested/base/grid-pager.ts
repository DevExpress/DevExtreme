/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { DisplayMode, Mode } from 'devextreme/common';
import { PagerPageSize } from 'devextreme/common/grids';

@Component({
    template: ''
})
export abstract class DxoGridPager extends NestedOption {
    get allowedPageSizes(): Mode | Array<PagerPageSize | number> {
        return this._getOption('allowedPageSizes');
    }
    set allowedPageSizes(value: Mode | Array<PagerPageSize | number>) {
        this._setOption('allowedPageSizes', value);
    }

    get displayMode(): DisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: DisplayMode) {
        this._setOption('displayMode', value);
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

    get visible(): Mode | boolean {
        return this._getOption('visible');
    }
    set visible(value: Mode | boolean) {
        this._setOption('visible', value);
    }
}
