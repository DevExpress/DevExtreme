/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { AnnotationType, DashStyle, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { Font } from 'devextreme/viz/core/base_widget';
import { PieChartAnnotationLocation } from 'devextreme/viz/pie_chart';

@Component({
    template: ''
})
export abstract class DxoChartCommonAnnotationConfig extends NestedOption {
    get allowDragging(): boolean {
        return this._getOption('allowDragging');
    }
    set allowDragging(value: boolean) {
        this._setOption('allowDragging', value);
    }

    get argument(): Date | number | string | undefined {
        return this._getOption('argument');
    }
    set argument(value: Date | number | string | undefined) {
        this._setOption('argument', value);
    }

    get arrowLength(): number {
        return this._getOption('arrowLength');
    }
    set arrowLength(value: number) {
        this._setOption('arrowLength', value);
    }

    get arrowWidth(): number {
        return this._getOption('arrowWidth');
    }
    set arrowWidth(value: number) {
        this._setOption('arrowWidth', value);
    }

    get axis(): string | undefined {
        return this._getOption('axis');
    }
    set axis(value: string | undefined) {
        this._setOption('axis', value);
    }

    get border(): { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    get customizeTooltip(): Function | undefined {
        return this._getOption('customizeTooltip');
    }
    set customizeTooltip(value: Function | undefined) {
        this._setOption('customizeTooltip', value);
    }

    get data(): any {
        return this._getOption('data');
    }
    set data(value: any) {
        this._setOption('data', value);
    }

    get description(): string | undefined {
        return this._getOption('description');
    }
    set description(value: string | undefined) {
        this._setOption('description', value);
    }

    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    get height(): number | undefined {
        return this._getOption('height');
    }
    set height(value: number | undefined) {
        this._setOption('height', value);
    }

    get image(): string | { height?: number, url?: string | undefined, width?: number } {
        return this._getOption('image');
    }
    set image(value: string | { height?: number, url?: string | undefined, width?: number }) {
        this._setOption('image', value);
    }

    get offsetX(): number | undefined {
        return this._getOption('offsetX');
    }
    set offsetX(value: number | undefined) {
        this._setOption('offsetX', value);
    }

    get offsetY(): number | undefined {
        return this._getOption('offsetY');
    }
    set offsetY(value: number | undefined) {
        this._setOption('offsetY', value);
    }

    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    get paddingLeftRight(): number {
        return this._getOption('paddingLeftRight');
    }
    set paddingLeftRight(value: number) {
        this._setOption('paddingLeftRight', value);
    }

    get paddingTopBottom(): number {
        return this._getOption('paddingTopBottom');
    }
    set paddingTopBottom(value: number) {
        this._setOption('paddingTopBottom', value);
    }

    get series(): string | undefined {
        return this._getOption('series');
    }
    set series(value: string | undefined) {
        this._setOption('series', value);
    }

    get shadow(): { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number } {
        return this._getOption('shadow');
    }
    set shadow(value: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }) {
        this._setOption('shadow', value);
    }

    get template(): any | undefined {
        return this._getOption('template');
    }
    set template(value: any | undefined) {
        this._setOption('template', value);
    }

    get text(): string | undefined {
        return this._getOption('text');
    }
    set text(value: string | undefined) {
        this._setOption('text', value);
    }

    get textOverflow(): TextOverflow {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: TextOverflow) {
        this._setOption('textOverflow', value);
    }

    get tooltipEnabled(): boolean {
        return this._getOption('tooltipEnabled');
    }
    set tooltipEnabled(value: boolean) {
        this._setOption('tooltipEnabled', value);
    }

    get tooltipTemplate(): any | undefined {
        return this._getOption('tooltipTemplate');
    }
    set tooltipTemplate(value: any | undefined) {
        this._setOption('tooltipTemplate', value);
    }

    get type(): AnnotationType | undefined {
        return this._getOption('type');
    }
    set type(value: AnnotationType | undefined) {
        this._setOption('type', value);
    }

    get value(): Date | number | string | undefined {
        return this._getOption('value');
    }
    set value(value: Date | number | string | undefined) {
        this._setOption('value', value);
    }

    get width(): number | undefined {
        return this._getOption('width');
    }
    set width(value: number | undefined) {
        this._setOption('width', value);
    }

    get wordWrap(): WordWrap {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: WordWrap) {
        this._setOption('wordWrap', value);
    }

    get x(): number | undefined {
        return this._getOption('x');
    }
    set x(value: number | undefined) {
        this._setOption('x', value);
    }

    get y(): number | undefined {
        return this._getOption('y');
    }
    set y(value: number | undefined) {
        this._setOption('y', value);
    }

    get location(): PieChartAnnotationLocation {
        return this._getOption('location');
    }
    set location(value: PieChartAnnotationLocation) {
        this._setOption('location', value);
    }

    get angle(): number | undefined {
        return this._getOption('angle');
    }
    set angle(value: number | undefined) {
        this._setOption('angle', value);
    }

    get radius(): number | undefined {
        return this._getOption('radius');
    }
    set radius(value: number | undefined) {
        this._setOption('radius', value);
    }

    get coordinates(): Array<number> {
        return this._getOption('coordinates');
    }
    set coordinates(value: Array<number>) {
        this._setOption('coordinates', value);
    }
}
