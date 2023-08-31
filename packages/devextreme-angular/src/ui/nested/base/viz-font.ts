/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoVizFont extends NestedOption {
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    get family(): string {
        return this._getOption('family');
    }
    set family(value: string) {
        this._setOption('family', value);
    }

    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    get size(): number | string {
        return this._getOption('size');
    }
    set size(value: number | string) {
        this._setOption('size', value);
    }

    get weight(): number {
        return this._getOption('weight');
    }
    set weight(value: number) {
        this._setOption('weight', value);
    }
}
