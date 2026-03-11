/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import type { ChartSeries } from 'devextreme/viz/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-series-template',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorSeriesTemplateComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeSeries(): ((seriesName: any) => ChartSeries) {
        return this._getOption('customizeSeries');
    }
    set customizeSeries(value: ((seriesName: any) => ChartSeries)) {
        this._setOption('customizeSeries', value);
    }

    @Input()
    get nameField(): string {
        return this._getOption('nameField');
    }
    set nameField(value: string) {
        this._setOption('nameField', value);
    }


    protected get _optionPath() {
        return 'seriesTemplate';
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
    DxoRangeSelectorSeriesTemplateComponent
  ],
  exports: [
    DxoRangeSelectorSeriesTemplateComponent
  ],
})
export class DxoRangeSelectorSeriesTemplateModule { }
