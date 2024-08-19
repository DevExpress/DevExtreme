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
import { DxoGaugeIndicator } from './base/gauge-indicator';


@Component({
    selector: 'dxo-subvalue-indicator',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'arrowLength',
        'backgroundColor',
        'baseValue',
        'beginAdaptingAtRadius',
        'color',
        'horizontalOrientation',
        'indentFromCenter',
        'length',
        'offset',
        'palette',
        'secondColor',
        'secondFraction',
        'size',
        'spindleGapSize',
        'spindleSize',
        'text',
        'type',
        'verticalOrientation',
        'width'
    ]
})
export class DxoSubvalueIndicatorComponent extends DxoGaugeIndicator implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'subvalueIndicator';
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
    DxoSubvalueIndicatorComponent
  ],
  exports: [
    DxoSubvalueIndicatorComponent
  ],
})
export class DxoSubvalueIndicatorModule { }
