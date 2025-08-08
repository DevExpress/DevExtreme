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
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFormat } from './base/format';

@Component({
    selector: 'dxo-display-format',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoDisplayFormatComponent) => ({
                propertyName: 'displayFormat',
                className: 'DxoDisplayFormatComponent',
                component
            }),
            deps: [DxoDisplayFormatComponent],
         }
         ],
    inputs: [
        'currency',
        'formatter',
        'parser',
        'precision',
        'type',
        'useCurrencyAccountingStyle'
    ]
})
export class DxoDisplayFormatComponent extends DxoFormat implements OnDestroy, OnInit {

    protected get _optionPath() {
        return 'displayFormat';
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
    DxoDisplayFormatComponent
  ],
  exports: [
    DxoDisplayFormatComponent
  ],
})
export class DxoDisplayFormatModule { }
