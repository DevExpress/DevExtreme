/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { SelectAllMode, SingleMultipleOrNone } from 'devextreme/common';
import { SelectionColumnDisplayMode } from 'devextreme/common/grids';
import { DeferredCaseSensitivity } from 'devextreme/ui/data_grid';

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

    get deferredCaseSensitivity(): DeferredCaseSensitivity {
        return this._getOption('deferredCaseSensitivity');
    }
    set deferredCaseSensitivity(value: DeferredCaseSensitivity) {
        this._setOption('deferredCaseSensitivity', value);
    }

    get mode(): SingleMultipleOrNone {
        return this._getOption('mode');
    }
    set mode(value: SingleMultipleOrNone) {
        this._setOption('mode', value);
    }

    get selectAllMode(): SelectAllMode {
        return this._getOption('selectAllMode');
    }
    set selectAllMode(value: SelectAllMode) {
        this._setOption('selectAllMode', value);
    }

    get showCheckBoxesMode(): SelectionColumnDisplayMode {
        return this._getOption('showCheckBoxesMode');
    }
    set showCheckBoxesMode(value: SelectionColumnDisplayMode) {
        this._setOption('showCheckBoxesMode', value);
    }
}
