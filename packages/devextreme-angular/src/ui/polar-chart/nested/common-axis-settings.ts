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




import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-common-axis-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartCommonAxisSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get constantLineStyle(): Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", label?: Record<string, any> | { font?: Font, visible?: boolean }, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", label?: Record<string, any> | { font?: Font, visible?: boolean }, width?: number }) {
        this._setOption('constantLineStyle', value);
    }

    @Input()
    get discreteAxisDivisionMode(): "betweenLabels" | "crossLabels" {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: "betweenLabels" | "crossLabels") {
        this._setOption('discreteAxisDivisionMode', value);
    }

    @Input()
    get endOnTick(): boolean {
        return this._getOption('endOnTick');
    }
    set endOnTick(value: boolean) {
        this._setOption('endOnTick', value);
    }

    @Input()
    get grid(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('grid');
    }
    set grid(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('grid', value);
    }

    @Input()
    get inverted(): boolean {
        return this._getOption('inverted');
    }
    set inverted(value: boolean) {
        this._setOption('inverted', value);
    }

    @Input()
    get label(): Record<string, any> | { font?: Font, indentFromAxis?: number, overlappingBehavior?: "hide" | "none", visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { font?: Font, indentFromAxis?: number, overlappingBehavior?: "hide" | "none", visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get minorGrid(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorGrid');
    }
    set minorGrid(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('minorGrid', value);
    }

    @Input()
    get minorTick(): Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('minorTick', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get stripStyle(): Record<string, any> | { label?: Record<string, any> | { font?: Font } } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: Record<string, any> | { label?: Record<string, any> | { font?: Font } }) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get tick(): Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('tick', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'commonAxisSettings';
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
    DxoPolarChartCommonAxisSettingsComponent
  ],
  exports: [
    DxoPolarChartCommonAxisSettingsComponent
  ],
})
export class DxoPolarChartCommonAxisSettingsModule { }
