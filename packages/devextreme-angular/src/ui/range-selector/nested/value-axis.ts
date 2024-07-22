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




import { ChartsDataType } from 'devextreme/common/charts';
import { ChartAxisScale } from 'devextreme/viz/range_selector';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-value-axis-range-selector',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoValueAxisRangeSelectorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get inverted(): boolean {
        return this._getOption('inverted');
    }
    set inverted(value: boolean) {
        this._setOption('inverted', value);
    }

    @Input()
    get logarithmBase(): number {
        return this._getOption('logarithmBase');
    }
    set logarithmBase(value: number) {
        this._setOption('logarithmBase', value);
    }

    @Input()
    get max(): number | undefined {
        return this._getOption('max');
    }
    set max(value: number | undefined) {
        this._setOption('max', value);
    }

    @Input()
    get min(): number | undefined {
        return this._getOption('min');
    }
    set min(value: number | undefined) {
        this._setOption('min', value);
    }

    @Input()
    get type(): ChartAxisScale | undefined {
        return this._getOption('type');
    }
    set type(value: ChartAxisScale | undefined) {
        this._setOption('type', value);
    }

    @Input()
    get valueType(): ChartsDataType | undefined {
        return this._getOption('valueType');
    }
    set valueType(value: ChartsDataType | undefined) {
        this._setOption('valueType', value);
    }


    protected get _optionPath() {
        return 'valueAxis';
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
    DxoValueAxisRangeSelectorComponent
  ],
  exports: [
    DxoValueAxisRangeSelectorComponent
  ],
})
export class DxoValueAxisRangeSelectorModule { }
