/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { HorizontalEdge, VerticalEdge } from 'devextreme/common';
import { ChartsColor, Font, Palette } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

@Component({
    template: ''
})
export abstract class DxoGaugeIndicator extends NestedOption {
    get arrowLength(): number {
        return this._getOption('arrowLength');
    }
    set arrowLength(value: number) {
        this._setOption('arrowLength', value);
    }

    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }

    get baseValue(): number | undefined {
        return this._getOption('baseValue');
    }
    set baseValue(value: number | undefined) {
        this._setOption('baseValue', value);
    }

    get beginAdaptingAtRadius(): number {
        return this._getOption('beginAdaptingAtRadius');
    }
    set beginAdaptingAtRadius(value: number) {
        this._setOption('beginAdaptingAtRadius', value);
    }

    get color(): ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string) {
        this._setOption('color', value);
    }

    get horizontalOrientation(): HorizontalEdge {
        return this._getOption('horizontalOrientation');
    }
    set horizontalOrientation(value: HorizontalEdge) {
        this._setOption('horizontalOrientation', value);
    }

    get indentFromCenter(): number {
        return this._getOption('indentFromCenter');
    }
    set indentFromCenter(value: number) {
        this._setOption('indentFromCenter', value);
    }

    get length(): number {
        return this._getOption('length');
    }
    set length(value: number) {
        this._setOption('length', value);
    }

    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
    }

    get palette(): Palette | string | Array<string> {
        return this._getOption('palette');
    }
    set palette(value: Palette | string | Array<string>) {
        this._setOption('palette', value);
    }

    get secondColor(): string {
        return this._getOption('secondColor');
    }
    set secondColor(value: string) {
        this._setOption('secondColor', value);
    }

    get secondFraction(): number {
        return this._getOption('secondFraction');
    }
    set secondFraction(value: number) {
        this._setOption('secondFraction', value);
    }

    get size(): number {
        return this._getOption('size');
    }
    set size(value: number) {
        this._setOption('size', value);
    }

    get spindleGapSize(): number {
        return this._getOption('spindleGapSize');
    }
    set spindleGapSize(value: number) {
        this._setOption('spindleGapSize', value);
    }

    get spindleSize(): number {
        return this._getOption('spindleSize');
    }
    set spindleSize(value: number) {
        this._setOption('spindleSize', value);
    }

    get text(): { customizeText?: Function | undefined, font?: Font, format?: Format | string | undefined, indent?: number } {
        return this._getOption('text');
    }
    set text(value: { customizeText?: Function | undefined, font?: Font, format?: Format | string | undefined, indent?: number }) {
        this._setOption('text', value);
    }

    get type(): string {
        return this._getOption('type');
    }
    set type(value: string) {
        this._setOption('type', value);
    }

    get verticalOrientation(): VerticalEdge {
        return this._getOption('verticalOrientation');
    }
    set verticalOrientation(value: VerticalEdge) {
        this._setOption('verticalOrientation', value);
    }

    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }
}
