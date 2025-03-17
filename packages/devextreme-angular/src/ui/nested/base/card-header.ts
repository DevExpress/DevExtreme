/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoCardHeader extends NestedOption {
    get captionExpr(): Function | string {
        return this._getOption('captionExpr');
    }
    set captionExpr(value: Function | string) {
        this._setOption('captionExpr', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }
}
