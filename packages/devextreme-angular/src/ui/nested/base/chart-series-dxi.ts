/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { Format } from 'devextreme/localization';
import { Font } from 'devextreme/viz/core/base_widget';

@Component({
    template: ''
})
export abstract class DxiChartSeries extends CollectionNestedOption {
    get aggregation(): { calculate?: Function | undefined, enabled?: boolean, method?: string } {
        return this._getOption('aggregation');
    }
    set aggregation(value: { calculate?: Function | undefined, enabled?: boolean, method?: string }) {
        this._setOption('aggregation', value);
    }

    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }

    get axis(): string | undefined {
        return this._getOption('axis');
    }
    set axis(value: string | undefined) {
        this._setOption('axis', value);
    }

    get barOverlapGroup(): string | undefined {
        return this._getOption('barOverlapGroup');
    }
    set barOverlapGroup(value: string | undefined) {
        this._setOption('barOverlapGroup', value);
    }

    get barPadding(): number | undefined {
        return this._getOption('barPadding');
    }
    set barPadding(value: number | undefined) {
        this._setOption('barPadding', value);
    }

    get barWidth(): number | undefined {
        return this._getOption('barWidth');
    }
    set barWidth(value: number | undefined) {
        this._setOption('barWidth', value);
    }

    get border(): { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    get closeValueField(): string {
        return this._getOption('closeValueField');
    }
    set closeValueField(value: string) {
        this._setOption('closeValueField', value);
    }

    get color(): DevExpress.common.charts.ChartsColor | string | undefined {
        return this._getOption('color');
    }
    set color(value: DevExpress.common.charts.ChartsColor | string | undefined) {
        this._setOption('color', value);
    }

    get cornerRadius(): number {
        return this._getOption('cornerRadius');
    }
    set cornerRadius(value: number) {
        this._setOption('cornerRadius', value);
    }

    get dashStyle(): string {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: string) {
        this._setOption('dashStyle', value);
    }

    get highValueField(): string {
        return this._getOption('highValueField');
    }
    set highValueField(value: string) {
        this._setOption('highValueField', value);
    }

    get hoverMode(): string {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: string) {
        this._setOption('hoverMode', value);
    }

    get hoverStyle(): { border?: { color?: string | undefined, dashStyle?: string, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, dashStyle?: string, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, dashStyle?: string, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, dashStyle?: string, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('hoverStyle', value);
    }

    get ignoreEmptyPoints(): boolean {
        return this._getOption('ignoreEmptyPoints');
    }
    set ignoreEmptyPoints(value: boolean) {
        this._setOption('ignoreEmptyPoints', value);
    }

    get innerColor(): string {
        return this._getOption('innerColor');
    }
    set innerColor(value: string) {
        this._setOption('innerColor', value);
    }

    get label(): { alignment?: string, argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: string, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, horizontalOffset?: number, position?: string, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: string, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: string, radialOffset?: number, rotationAngle?: number, textOverflow?: string, visible?: boolean, wordWrap?: string } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: string, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: string, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: string, argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: string, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, horizontalOffset?: number, position?: string, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: string, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: string, radialOffset?: number, rotationAngle?: number, textOverflow?: string, visible?: boolean, wordWrap?: string } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: string, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: string, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }) {
        this._setOption('label', value);
    }

    get lowValueField(): string {
        return this._getOption('lowValueField');
    }
    set lowValueField(value: string) {
        this._setOption('lowValueField', value);
    }

    get maxLabelCount(): number | undefined {
        return this._getOption('maxLabelCount');
    }
    set maxLabelCount(value: number | undefined) {
        this._setOption('maxLabelCount', value);
    }

    get minBarSize(): number | undefined {
        return this._getOption('minBarSize');
    }
    set minBarSize(value: number | undefined) {
        this._setOption('minBarSize', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    get openValueField(): string {
        return this._getOption('openValueField');
    }
    set openValueField(value: string) {
        this._setOption('openValueField', value);
    }

    get pane(): string {
        return this._getOption('pane');
    }
    set pane(value: string) {
        this._setOption('pane', value);
    }

    get point(): { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hoverMode?: string, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: string, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: string, visible?: boolean } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hoverMode?: string, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: string, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number }, size?: number, symbol?: string, visible?: boolean } {
        return this._getOption('point');
    }
    set point(value: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hoverMode?: string, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: string, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: string, visible?: boolean } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hoverMode?: string, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: string, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number }, size?: number, symbol?: string, visible?: boolean }) {
        this._setOption('point', value);
    }

    get rangeValue1Field(): string {
        return this._getOption('rangeValue1Field');
    }
    set rangeValue1Field(value: string) {
        this._setOption('rangeValue1Field', value);
    }

    get rangeValue2Field(): string {
        return this._getOption('rangeValue2Field');
    }
    set rangeValue2Field(value: string) {
        this._setOption('rangeValue2Field', value);
    }

    get reduction(): { color?: string, level?: string } {
        return this._getOption('reduction');
    }
    set reduction(value: { color?: string, level?: string }) {
        this._setOption('reduction', value);
    }

    get selectionMode(): string {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: string) {
        this._setOption('selectionMode', value);
    }

    get selectionStyle(): { border?: { color?: string | undefined, dashStyle?: string, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, dashStyle?: string, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: { border?: { color?: string | undefined, dashStyle?: string, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, dashStyle?: string, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, hatching?: { direction?: string, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('selectionStyle', value);
    }

    get showInLegend(): boolean {
        return this._getOption('showInLegend');
    }
    set showInLegend(value: boolean) {
        this._setOption('showInLegend', value);
    }

    get sizeField(): string {
        return this._getOption('sizeField');
    }
    set sizeField(value: string) {
        this._setOption('sizeField', value);
    }

    get stack(): string {
        return this._getOption('stack');
    }
    set stack(value: string) {
        this._setOption('stack', value);
    }

    get tag(): any | undefined {
        return this._getOption('tag');
    }
    set tag(value: any | undefined) {
        this._setOption('tag', value);
    }

    get tagField(): string {
        return this._getOption('tagField');
    }
    set tagField(value: string) {
        this._setOption('tagField', value);
    }

    get type(): string {
        return this._getOption('type');
    }
    set type(value: string) {
        this._setOption('type', value);
    }

    get valueErrorBar(): { color?: string, displayMode?: string, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: string | undefined, value?: number } {
        return this._getOption('valueErrorBar');
    }
    set valueErrorBar(value: { color?: string, displayMode?: string, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: string | undefined, value?: number }) {
        this._setOption('valueErrorBar', value);
    }

    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }

    get argumentType(): string | undefined {
        return this._getOption('argumentType');
    }
    set argumentType(value: string | undefined) {
        this._setOption('argumentType', value);
    }

    get minSegmentSize(): number | undefined {
        return this._getOption('minSegmentSize');
    }
    set minSegmentSize(value: number | undefined) {
        this._setOption('minSegmentSize', value);
    }

    get smallValuesGrouping(): { groupName?: string, mode?: string, threshold?: number | undefined, topCount?: number | undefined } {
        return this._getOption('smallValuesGrouping');
    }
    set smallValuesGrouping(value: { groupName?: string, mode?: string, threshold?: number | undefined, topCount?: number | undefined }) {
        this._setOption('smallValuesGrouping', value);
    }

    get closed(): boolean {
        return this._getOption('closed');
    }
    set closed(value: boolean) {
        this._setOption('closed', value);
    }
}
