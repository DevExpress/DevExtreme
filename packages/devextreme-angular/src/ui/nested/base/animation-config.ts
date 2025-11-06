/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Direction } from 'devextreme/common';
import { AnimationState, AnimationType } from 'devextreme/common/core/animation';

@Component({
    template: ''
})
export abstract class DxoAnimationConfig extends NestedOption {
    get complete(): Function {
        return this._getOption('complete');
    }
    set complete(value: Function) {
        this._setOption('complete', value);
    }

    get delay(): number {
        return this._getOption('delay');
    }
    set delay(value: number) {
        this._setOption('delay', value);
    }

    get direction(): Direction | undefined {
        return this._getOption('direction');
    }
    set direction(value: Direction | undefined) {
        this._setOption('direction', value);
    }

    get duration(): number {
        return this._getOption('duration');
    }
    set duration(value: number) {
        this._setOption('duration', value);
    }

    get easing(): string {
        return this._getOption('easing');
    }
    set easing(value: string) {
        this._setOption('easing', value);
    }

    get from(): AnimationState {
        return this._getOption('from');
    }
    set from(value: AnimationState) {
        this._setOption('from', value);
    }

    get staggerDelay(): number | undefined {
        return this._getOption('staggerDelay');
    }
    set staggerDelay(value: number | undefined) {
        this._setOption('staggerDelay', value);
    }

    get start(): Function {
        return this._getOption('start');
    }
    set start(value: Function) {
        this._setOption('start', value);
    }

    get to(): AnimationState {
        return this._getOption('to');
    }
    set to(value: AnimationState) {
        this._setOption('to', value);
    }

    get type(): AnimationType {
        return this._getOption('type');
    }
    set type(value: AnimationType) {
        this._setOption('type', value);
    }
}
