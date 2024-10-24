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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-data-prepare-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartDataPrepareSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get checkTypeForAllData(): boolean {
        return this._getOption('checkTypeForAllData');
    }
    set checkTypeForAllData(value: boolean) {
        this._setOption('checkTypeForAllData', value);
    }

    @Input()
    get convertToAxisDataType(): boolean {
        return this._getOption('convertToAxisDataType');
    }
    set convertToAxisDataType(value: boolean) {
        this._setOption('convertToAxisDataType', value);
    }

    @Input()
    get sortingMethod(): boolean | ((a: any, b: any) => number) {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: boolean | ((a: any, b: any) => number)) {
        this._setOption('sortingMethod', value);
    }


    protected get _optionPath() {
        return 'dataPrepareSettings';
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
    DxoChartDataPrepareSettingsComponent
  ],
  exports: [
    DxoChartDataPrepareSettingsComponent
  ],
})
export class DxoChartDataPrepareSettingsModule { }
