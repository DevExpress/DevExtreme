/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiChartSeries } from './base/chart-series-dxi';


@Component({
    selector: 'dxi-series',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'aggregation',
        'argumentField',
        'axis',
        'barOverlapGroup',
        'barPadding',
        'barWidth',
        'border',
        'closeValueField',
        'color',
        'cornerRadius',
        'dashStyle',
        'highValueField',
        'hoverMode',
        'hoverStyle',
        'ignoreEmptyPoints',
        'innerColor',
        'label',
        'lowValueField',
        'maxLabelCount',
        'minBarSize',
        'name',
        'opacity',
        'openValueField',
        'pane',
        'point',
        'rangeValue1Field',
        'rangeValue2Field',
        'reduction',
        'selectionMode',
        'selectionStyle',
        'showInLegend',
        'sizeField',
        'stack',
        'tag',
        'tagField',
        'type',
        'valueErrorBar',
        'valueField',
        'visible',
        'width',
        'argumentType',
        'minSegmentSize',
        'smallValuesGrouping',
        'closed'
    ]
})
export class DxiSeriesComponent extends DxiChartSeries {

    protected get _optionPath() {
        return 'series';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiSeriesComponent
  ],
  exports: [
    DxiSeriesComponent
  ],
})
export class DxiSeriesModule { }
