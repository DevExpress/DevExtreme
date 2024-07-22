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




import { FinancialChartReductionLevel } from 'devextreme/viz/chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-reduction-range-selector',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoReductionRangeSelectorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get level(): FinancialChartReductionLevel {
        return this._getOption('level');
    }
    set level(value: FinancialChartReductionLevel) {
        this._setOption('level', value);
    }


    protected get _optionPath() {
        return 'reduction';
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
    DxoReductionRangeSelectorComponent
  ],
  exports: [
    DxoReductionRangeSelectorComponent
  ],
})
export class DxoReductionRangeSelectorModule { }
