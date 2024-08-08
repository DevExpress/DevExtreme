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




import { Format } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-format',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartFormatComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get currency(): string {
        return this._getOption('currency');
    }
    set currency(value: string) {
        this._setOption('currency', value);
    }

    @Input()
    get formatter(): Function {
        return this._getOption('formatter');
    }
    set formatter(value: Function) {
        this._setOption('formatter', value);
    }

    @Input()
    get parser(): Function {
        return this._getOption('parser');
    }
    set parser(value: Function) {
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
    get type(): Format | string {
        return this._getOption('type');
    }
    set type(value: Format | string) {
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
        return 'format';
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
    DxoChartFormatComponent
  ],
  exports: [
    DxoChartFormatComponent
  ],
})
export class DxoChartFormatModule { }
