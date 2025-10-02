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
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoLoadIndicatorOptions } from './base/load-indicator-options';


@Component({
    selector: 'dxo-indicator-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'animationType',
        'height',
        'indicatorSrc',
        'width'
    ]
})
export class DxoIndicatorOptionsComponent extends DxoLoadIndicatorOptions implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'indicatorOptions';
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
  imports: [
    DxoIndicatorOptionsComponent
  ],
  exports: [
    DxoIndicatorOptionsComponent
  ],
})
export class DxoIndicatorOptionsModule { }
