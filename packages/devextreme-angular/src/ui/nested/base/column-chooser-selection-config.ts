/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoColumnChooserSelectionConfig extends NestedOption {
    get allowSelectAll(): boolean {
        return this._getOption('allowSelectAll');
    }
    set allowSelectAll(value: boolean) {
        this._setOption('allowSelectAll', value);
    }

    get recursive(): boolean {
        return this._getOption('recursive');
    }
    set recursive(value: boolean) {
        this._setOption('recursive', value);
    }

    get selectByClick(): boolean {
        return this._getOption('selectByClick');
    }
    set selectByClick(value: boolean) {
        this._setOption('selectByClick', value);
    }

    get deferred(): boolean {
        return this._getOption('deferred');
    }
    set deferred(value: boolean) {
        this._setOption('deferred', value);
    }

    get mode(): string {
        return this._getOption('mode');
    }
    set mode(value: string) {
        this._setOption('mode', value);
    }

    get selectAllMode(): string {
        return this._getOption('selectAllMode');
    }
    set selectAllMode(value: string) {
        this._setOption('selectAllMode', value);
    }

    get showCheckBoxesMode(): string {
        return this._getOption('showCheckBoxesMode');
    }
    set showCheckBoxesMode(value: string) {
        this._setOption('showCheckBoxesMode', value);
    }
}
