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
    selector: 'dxo-chart-reduction',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartReductionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get level(): "close" | "high" | "low" | "open" {
        return this._getOption('level');
    }
    set level(value: "close" | "high" | "low" | "open") {
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
    DxoChartReductionComponent
  ],
  exports: [
    DxoChartReductionComponent
  ],
})
export class DxoChartReductionModule { }
