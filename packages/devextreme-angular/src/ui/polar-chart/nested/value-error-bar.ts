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
    selector: 'dxo-polar-chart-value-error-bar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartValueErrorBarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get displayMode(): "auto" | "high" | "low" | "none" {
        return this._getOption('displayMode');
    }
    set displayMode(value: "auto" | "high" | "low" | "none") {
        this._setOption('displayMode', value);
    }

    @Input()
    get edgeLength(): number {
        return this._getOption('edgeLength');
    }
    set edgeLength(value: number) {
        this._setOption('edgeLength', value);
    }

    @Input()
    get highValueField(): string {
        return this._getOption('highValueField');
    }
    set highValueField(value: string) {
        this._setOption('highValueField', value);
    }

    @Input()
    get lineWidth(): number {
        return this._getOption('lineWidth');
    }
    set lineWidth(value: number) {
        this._setOption('lineWidth', value);
    }

    @Input()
    get lowValueField(): string {
        return this._getOption('lowValueField');
    }
    set lowValueField(value: string) {
        this._setOption('lowValueField', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get type(): "fixed" | "percent" | "stdDeviation" | "stdError" | "variance" {
        return this._getOption('type');
    }
    set type(value: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance") {
        this._setOption('type', value);
    }

    @Input()
    get value(): number {
        return this._getOption('value');
    }
    set value(value: number) {
        this._setOption('value', value);
    }


    protected get _optionPath() {
        return 'valueErrorBar';
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
    DxoPolarChartValueErrorBarComponent
  ],
  exports: [
    DxoPolarChartValueErrorBarComponent
  ],
})
export class DxoPolarChartValueErrorBarModule { }
