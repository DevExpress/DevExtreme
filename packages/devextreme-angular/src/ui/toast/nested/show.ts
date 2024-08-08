/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { AnimationState, AnimationType } from 'devextreme/animation/fx';
import { Direction } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-toast-show',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoToastShowComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get complete(): Function {
        return this._getOption('complete');
    }
    set complete(value: Function) {
        this._setOption('complete', value);
    }

    @Input()
    get delay(): number {
        return this._getOption('delay');
    }
    set delay(value: number) {
        this._setOption('delay', value);
    }

    @Input()
    get direction(): Direction | undefined {
        return this._getOption('direction');
    }
    set direction(value: Direction | undefined) {
        this._setOption('direction', value);
    }

    @Input()
    get duration(): number {
        return this._getOption('duration');
    }
    set duration(value: number) {
        this._setOption('duration', value);
    }

    @Input()
    get easing(): string {
        return this._getOption('easing');
    }
    set easing(value: string) {
        this._setOption('easing', value);
    }

    @Input()
    get from(): AnimationState {
        return this._getOption('from');
    }
    set from(value: AnimationState) {
        this._setOption('from', value);
    }

    @Input()
    get staggerDelay(): number | undefined {
        return this._getOption('staggerDelay');
    }
    set staggerDelay(value: number | undefined) {
        this._setOption('staggerDelay', value);
    }

    @Input()
    get start(): Function {
        return this._getOption('start');
    }
    set start(value: Function) {
        this._setOption('start', value);
    }

    @Input()
    get to(): AnimationState {
        return this._getOption('to');
    }
    set to(value: AnimationState) {
        this._setOption('to', value);
    }

    @Input()
    get type(): AnimationType {
        return this._getOption('type');
    }
    set type(value: AnimationType) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'show';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoToastShowComponent
  ],
  exports: [
    DxoToastShowComponent
  ],
})
export class DxoToastShowModule { }
