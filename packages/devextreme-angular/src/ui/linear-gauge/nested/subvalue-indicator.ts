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




import * as LocalizationTypes from 'devextreme/localization';
import { ChartsColor, Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-linear-gauge-subvalue-indicator',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLinearGaugeSubvalueIndicatorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get arrowLength(): number {
        return this._getOption('arrowLength');
    }
    set arrowLength(value: number) {
        this._setOption('arrowLength', value);
    }

    @Input()
    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get baseValue(): number {
        return this._getOption('baseValue');
    }
    set baseValue(value: number) {
        this._setOption('baseValue', value);
    }

    @Input()
    get beginAdaptingAtRadius(): number {
        return this._getOption('beginAdaptingAtRadius');
    }
    set beginAdaptingAtRadius(value: number) {
        this._setOption('beginAdaptingAtRadius', value);
    }

    @Input()
    get color(): ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string) {
        this._setOption('color', value);
    }

    @Input()
    get horizontalOrientation(): "left" | "right" {
        return this._getOption('horizontalOrientation');
    }
    set horizontalOrientation(value: "left" | "right") {
        this._setOption('horizontalOrientation', value);
    }

    @Input()
    get indentFromCenter(): number {
        return this._getOption('indentFromCenter');
    }
    set indentFromCenter(value: number) {
        this._setOption('indentFromCenter', value);
    }

    @Input()
    get length(): number {
        return this._getOption('length');
    }
    set length(value: number) {
        this._setOption('length', value);
    }

    @Input()
    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
    }

    @Input()
    get palette(): Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office" {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office") {
        this._setOption('palette', value);
    }

    @Input()
    get secondColor(): string {
        return this._getOption('secondColor');
    }
    set secondColor(value: string) {
        this._setOption('secondColor', value);
    }

    @Input()
    get secondFraction(): number {
        return this._getOption('secondFraction');
    }
    set secondFraction(value: number) {
        this._setOption('secondFraction', value);
    }

    @Input()
    get size(): number {
        return this._getOption('size');
    }
    set size(value: number) {
        this._setOption('size', value);
    }

    @Input()
    get spindleGapSize(): number {
        return this._getOption('spindleGapSize');
    }
    set spindleGapSize(value: number) {
        this._setOption('spindleGapSize', value);
    }

    @Input()
    get spindleSize(): number {
        return this._getOption('spindleSize');
    }
    set spindleSize(value: number) {
        this._setOption('spindleSize', value);
    }

    @Input()
    get text(): Record<string, any> | { customizeText: ((indicatedValue: { value: number, valueText: string }) => string), font: Font, format: LocalizationTypes.Format, indent: number } {
        return this._getOption('text');
    }
    set text(value: Record<string, any> | { customizeText: ((indicatedValue: { value: number, valueText: string }) => string), font: Font, format: LocalizationTypes.Format, indent: number }) {
        this._setOption('text', value);
    }

    @Input()
    get type(): "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle" {
        return this._getOption('type');
    }
    set type(value: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle") {
        this._setOption('type', value);
    }

    @Input()
    get verticalOrientation(): "bottom" | "top" {
        return this._getOption('verticalOrientation');
    }
    set verticalOrientation(value: "bottom" | "top") {
        this._setOption('verticalOrientation', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'subvalueIndicator';
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
    DxoLinearGaugeSubvalueIndicatorComponent
  ],
  exports: [
    DxoLinearGaugeSubvalueIndicatorComponent
  ],
})
export class DxoLinearGaugeSubvalueIndicatorModule { }
