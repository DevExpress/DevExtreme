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
import { DxoChartCommonSeriesSettings } from './base/chart-common-series-settings';


@Component({
    selector: 'dxo-rangebar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'aggregation',
        'area',
        'argumentField',
        'axis',
        'bar',
        'barOverlapGroup',
        'barPadding',
        'barWidth',
        'border',
        'bubble',
        'candlestick',
        'closeValueField',
        'color',
        'cornerRadius',
        'dashStyle',
        'fullstackedarea',
        'fullstackedbar',
        'fullstackedline',
        'fullstackedspline',
        'fullstackedsplinearea',
        'highValueField',
        'hoverMode',
        'hoverStyle',
        'ignoreEmptyPoints',
        'innerColor',
        'label',
        'line',
        'lowValueField',
        'maxLabelCount',
        'minBarSize',
        'opacity',
        'openValueField',
        'pane',
        'point',
        'rangearea',
        'rangebar',
        'rangeValue1Field',
        'rangeValue2Field',
        'reduction',
        'scatter',
        'selectionMode',
        'selectionStyle',
        'showInLegend',
        'sizeField',
        'spline',
        'splinearea',
        'stack',
        'stackedarea',
        'stackedbar',
        'stackedline',
        'stackedspline',
        'stackedsplinearea',
        'steparea',
        'stepline',
        'stock',
        'tagField',
        'type',
        'valueErrorBar',
        'valueField',
        'visible',
        'width'
    ]
})
export class DxoRangebarComponent extends DxoChartCommonSeriesSettings implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'rangebar';
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
    DxoRangebarComponent
  ],
  exports: [
    DxoRangebarComponent
  ],
})
export class DxoRangebarModule { }
