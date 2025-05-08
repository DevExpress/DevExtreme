/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoPaging extends NestedOption {
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get pageIndex(): number {
        return this._getOption('pageIndex');
    }
    set pageIndex(value: number) {
        this._setOption('pageIndex', value);
    }

    get pageSize(): number {
        return this._getOption('pageSize');
    }
    set pageSize(value: number) {
        this._setOption('pageSize', value);
    }
}
