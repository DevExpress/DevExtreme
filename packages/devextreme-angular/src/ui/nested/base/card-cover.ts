/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoCardCover extends NestedOption {
    get altExpr(): Function | string {
        return this._getOption('altExpr');
    }
    set altExpr(value: Function | string) {
        this._setOption('altExpr', value);
    }

    get imageExpr(): Function | string {
        return this._getOption('imageExpr');
    }
    set imageExpr(value: Function | string) {
        this._setOption('imageExpr', value);
    }
}
