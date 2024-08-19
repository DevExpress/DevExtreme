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
    selector: 'dxo-show',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'complete',
        'delay',
        'direction',
        'duration',
        'easing',
        'from',
        'staggerDelay',
        'start',
        'to',
        'type'
    ]
})
export class DxoShowComponent extends DxoAnimationConfig implements OnDestroy, OnInit  {

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
    DxoShowComponent
  ],
  exports: [
    DxoShowComponent
  ],
})
export class DxoShowModule { }
