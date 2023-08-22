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
    selector: 'dxo-from',
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
export class DxoFromComponent extends DxoAnimationState implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'from';
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
    DxoFromComponent
  ],
  exports: [
    DxoFromComponent
  ],
})
export class DxoFromModule { }
