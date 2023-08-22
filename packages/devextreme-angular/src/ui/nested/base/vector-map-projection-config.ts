/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoVectorMapProjectionConfig extends NestedOption {
    get aspectRatio(): number {
        return this._getOption('aspectRatio');
    }
    set aspectRatio(value: number) {
        this._setOption('aspectRatio', value);
    }

    get from(): Function {
        return this._getOption('from');
    }
    set from(value: Function) {
        this._setOption('from', value);
    }

    get to(): Function {
        return this._getOption('to');
    }
    set to(value: Function) {
        this._setOption('to', value);
    }
}
