/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { HorizontalAlignment, PositionAlignment, VerticalAlignment } from 'devextreme/common';
import { CollisionResolution, CollisionResolutionCombination } from 'devextreme/common/core/animation';
import { UserDefinedElement } from 'devextreme/core/element';

@Component({
    template: ''
})
export abstract class DxoPositionConfig extends NestedOption {
    get at(): PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment } {
        return this._getOption('at');
    }
    set at(value: PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment }) {
        this._setOption('at', value);
    }

    get boundary(): UserDefinedElement | string | Window {
        return this._getOption('boundary');
    }
    set boundary(value: UserDefinedElement | string | Window) {
        this._setOption('boundary', value);
    }

    get boundaryOffset(): string | { x?: number, y?: number } {
        return this._getOption('boundaryOffset');
    }
    set boundaryOffset(value: string | { x?: number, y?: number }) {
        this._setOption('boundaryOffset', value);
    }

    get collision(): CollisionResolutionCombination | { x?: CollisionResolution, y?: CollisionResolution } {
        return this._getOption('collision');
    }
    set collision(value: CollisionResolutionCombination | { x?: CollisionResolution, y?: CollisionResolution }) {
        this._setOption('collision', value);
    }

    get my(): PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment } {
        return this._getOption('my');
    }
    set my(value: PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment }) {
        this._setOption('my', value);
    }

    get of(): UserDefinedElement | string | Window {
        return this._getOption('of');
    }
    set of(value: UserDefinedElement | string | Window) {
        this._setOption('of', value);
    }

    get offset(): string | { x?: number, y?: number } {
        return this._getOption('offset');
    }
    set offset(value: string | { x?: number, y?: number }) {
        this._setOption('offset', value);
    }
}
