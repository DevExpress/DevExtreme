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




import { DashStyle, DiscreteAxisDivisionMode, Font, LabelOverlap } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-common-axis-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCommonAxisSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean | undefined {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean | undefined) {
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
    get constantLineStyle(): { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }) {
        this._setOption('constantLineStyle', value);
    }

    @Input()
    get discreteAxisDivisionMode(): DiscreteAxisDivisionMode {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: DiscreteAxisDivisionMode) {
        this._setOption('discreteAxisDivisionMode', value);
    }

    @Input()
    get endOnTick(): boolean | undefined {
        return this._getOption('endOnTick');
    }
    set endOnTick(value: boolean | undefined) {
        this._setOption('endOnTick', value);
    }

    @Input()
    get grid(): { color?: string, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('grid');
    }
    set grid(value: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }) {
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
    get label(): { font?: Font, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get minorGrid(): { color?: string, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('minorGrid');
    }
    set minorGrid(value: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('minorGrid', value);
    }

    @Input()
    get minorTick(): { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('minorTick', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get stripStyle(): { label?: { font?: Font } } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: { label?: { font?: Font } }) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get tick(): { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }) {
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
    DxoCommonAxisSettingsComponent
  ],
  exports: [
    DxoCommonAxisSettingsComponent
  ],
})
export class DxoCommonAxisSettingsModule { }
