/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoConverter extends NestedOption {
    get fromHtml(): Function {
        return this._getOption('fromHtml');
    }
    set fromHtml(value: Function) {
        this._setOption('fromHtml', value);
    }

    get toHtml(): Function {
        return this._getOption('toHtml');
    }
    set toHtml(value: Function) {
        this._setOption('toHtml', value);
    }
}
