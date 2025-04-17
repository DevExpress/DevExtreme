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
import { DxoFormat } from './base/format';


@Component({
    selector: 'dxo-value-format',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'currency',
        'formatter',
        'parser',
        'precision',
        'type',
        'useCurrencyAccountingStyle'
    ]
})
export class DxoValueFormatComponent extends DxoFormat implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'valueFormat';
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
    DxoValueFormatComponent
  ],
  exports: [
    DxoValueFormatComponent
  ],
})
export class DxoValueFormatModule { }
