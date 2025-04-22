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

    get aspectRatio(): string {
        return this._getOption('aspectRatio');
    }
    set aspectRatio(value: string) {
        this._setOption('aspectRatio', value);
    }

    get imageExpr(): Function | string {
        return this._getOption('imageExpr');
    }
    set imageExpr(value: Function | string) {
        this._setOption('imageExpr', value);
    }

    get maxHeight(): number {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number) {
        this._setOption('maxHeight', value);
    }

    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }
}
