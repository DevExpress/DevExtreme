/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxiChatError extends CollectionNestedOption {
    get id(): number | string {
        return this._getOption('id');
    }
    set id(value: number | string) {
        this._setOption('id', value);
    }

    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }
}
