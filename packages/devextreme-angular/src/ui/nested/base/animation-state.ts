/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { PositionConfig } from 'devextreme/common/core/animation';

@Component({
    template: ''
})
export abstract class DxoAnimationState extends NestedOption {
    get left(): number {
        return this._getOption('left');
    }
    set left(value: number) {
        this._setOption('left', value);
    }

    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    get position(): PositionConfig {
        return this._getOption('position');
    }
    set position(value: PositionConfig) {
        this._setOption('position', value);
    }

    get scale(): number {
        return this._getOption('scale');
    }
    set scale(value: number) {
        this._setOption('scale', value);
    }

    get top(): number {
        return this._getOption('top');
    }
    set top(value: number) {
        this._setOption('top', value);
    }
}
