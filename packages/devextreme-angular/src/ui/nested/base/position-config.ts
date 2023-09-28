/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { UserDefinedElement } from 'devextreme/core/element';

@Component({
    template: ''
})
export abstract class DxoPositionConfig extends NestedOption {
    get at(): string | { x?: string, y?: string } {
        return this._getOption('at');
    }
    set at(value: string | { x?: string, y?: string }) {
        this._setOption('at', value);
    }

    get boundary(): string | UserDefinedElement | Window {
        return this._getOption('boundary');
    }
    set boundary(value: string | UserDefinedElement | Window) {
        this._setOption('boundary', value);
    }

    get boundaryOffset(): string | { x?: number, y?: number } {
        return this._getOption('boundaryOffset');
    }
    set boundaryOffset(value: string | { x?: number, y?: number }) {
        this._setOption('boundaryOffset', value);
    }

    get collision(): string | { x?: string, y?: string } {
        return this._getOption('collision');
    }
    set collision(value: string | { x?: string, y?: string }) {
        this._setOption('collision', value);
    }

    get my(): string | { x?: string, y?: string } {
        return this._getOption('my');
    }
    set my(value: string | { x?: string, y?: string }) {
        this._setOption('my', value);
    }

    get of(): string | UserDefinedElement | Window {
        return this._getOption('of');
    }
    set of(value: string | UserDefinedElement | Window) {
        this._setOption('of', value);
    }

    get offset(): string | { x?: number, y?: number } {
        return this._getOption('offset');
    }
    set offset(value: string | { x?: number, y?: number }) {
        this._setOption('offset', value);
    }
}
