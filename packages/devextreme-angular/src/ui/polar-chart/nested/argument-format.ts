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
    selector: 'dxo-polar-chart-argument-format',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartArgumentFormatComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get currency(): string {
        return this._getOption('currency');
    }
    set currency(value: string) {
        this._setOption('currency', value);
    }

    @Input()
    get formatter(): ((value: number | Date) => string) {
        return this._getOption('formatter');
    }
    set formatter(value: ((value: number | Date) => string)) {
        this._setOption('formatter', value);
    }

    @Input()
    get parser(): ((value: string) => number | Date) {
        return this._getOption('parser');
    }
    set parser(value: ((value: string) => number | Date)) {
        this._setOption('parser', value);
    }

    @Input()
    get precision(): number {
        return this._getOption('precision');
    }
    set precision(value: number) {
        this._setOption('precision', value);
    }

    @Input()
    get type(): "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime" {
        return this._getOption('type');
    }
    set type(value: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime") {
        this._setOption('type', value);
    }

    @Input()
    get useCurrencyAccountingStyle(): boolean {
        return this._getOption('useCurrencyAccountingStyle');
    }
    set useCurrencyAccountingStyle(value: boolean) {
        this._setOption('useCurrencyAccountingStyle', value);
    }


    protected get _optionPath() {
        return 'argumentFormat';
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
    DxoPolarChartArgumentFormatComponent
  ],
  exports: [
    DxoPolarChartArgumentFormatComponent
  ],
})
export class DxoPolarChartArgumentFormatModule { }
