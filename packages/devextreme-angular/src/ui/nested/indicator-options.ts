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
import { DxoLoadPanelIndicatorProperties } from './base/load-panel-indicator-properties';

@Component({
    selector: 'dxo-indicator-options',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'animationType',
        'height',
        'src',
        'width'
    ]
})
export class DxoIndicatorOptionsComponent extends DxoLoadPanelIndicatorProperties implements OnDestroy, OnInit  {

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
