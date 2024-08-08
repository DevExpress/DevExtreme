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




import { ValueErrorBarDisplayMode, ValueErrorBarType } from 'devextreme/common/charts';

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
    get displayMode(): ValueErrorBarDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: ValueErrorBarDisplayMode) {
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
    get highValueField(): string | undefined {
        return this._getOption('highValueField');
    }
    set highValueField(value: string | undefined) {
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
    get lowValueField(): string | undefined {
        return this._getOption('lowValueField');
    }
    set lowValueField(value: string | undefined) {
        this._setOption('lowValueField', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get type(): ValueErrorBarType | undefined {
        return this._getOption('type');
    }
    set type(value: ValueErrorBarType | undefined) {
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
