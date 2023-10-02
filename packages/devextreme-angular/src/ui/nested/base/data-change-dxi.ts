/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { DataChangeType } from 'devextreme/common/grids';

@Component({
    template: ''
})
export abstract class DxiDataChange extends CollectionNestedOption {
    get data(): any {
        return this._getOption('data');
    }
    set data(value: any) {
        this._setOption('data', value);
    }

    get insertAfterKey(): any {
        return this._getOption('insertAfterKey');
    }
    set insertAfterKey(value: any) {
        this._setOption('insertAfterKey', value);
    }

    get insertBeforeKey(): any {
        return this._getOption('insertBeforeKey');
    }
    set insertBeforeKey(value: any) {
        this._setOption('insertBeforeKey', value);
    }

    get key(): any {
        return this._getOption('key');
    }
    set key(value: any) {
        this._setOption('key', value);
    }

    get type(): DataChangeType {
        return this._getOption('type');
    }
    set type(value: DataChangeType) {
        this._setOption('type', value);
    }
}
