/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoUser extends NestedOption {
    get avatarUrl(): string {
        return this._getOption('avatarUrl');
    }
    set avatarUrl(value: string) {
        this._setOption('avatarUrl', value);
    }

    get firstName(): string {
        return this._getOption('firstName');
    }
    set firstName(value: string) {
        this._setOption('firstName', value);
    }

    get id(): number {
        return this._getOption('id');
    }
    set id(value: number) {
        this._setOption('id', value);
    }

    get lastName(): string {
        return this._getOption('lastName');
    }
    set lastName(value: string) {
        this._setOption('lastName', value);
    }
}
