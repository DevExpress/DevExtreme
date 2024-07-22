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
import { DxoAnimationState } from './base/animation-state';


@Component({
    selector: 'dxo-to',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'left',
        'opacity',
        'position',
        'scale',
        'top'
    ]
})
export class DxoToComponent extends DxoAnimationState implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'to';
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
    DxoToComponent
  ],
  exports: [
    DxoToComponent
  ],
})
export class DxoToModule { }
