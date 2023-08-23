/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoAnimationConfig } from './base/animation-config';


@Component({
    selector: 'dxo-animation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'hide',
        'show',
        'duration',
        'easing',
        'enabled',
        'maxPointCountSupported',
        'complete',
        'delay',
        'direction',
        'from',
        'staggerDelay',
        'start',
        'to',
        'type'
    ]
})
export class DxoAnimationComponent extends DxoAnimationConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'animation';
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
    DxoAnimationComponent
  ],
  exports: [
    DxoAnimationComponent
  ],
})
export class DxoAnimationModule { }
