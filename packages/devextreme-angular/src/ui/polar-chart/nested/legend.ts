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




import { LegendItem, Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-legend',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartLegendComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): Record<string, any> | { color: string, cornerRadius: number, dashStyle: "dash" | "dot" | "longDash" | "solid", opacity: number, visible: boolean, width: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color: string, cornerRadius: number, dashStyle: "dash" | "dot" | "longDash" | "solid", opacity: number, visible: boolean, width: number }) {
        this._setOption('border', value);
    }

    @Input()
    get columnCount(): number {
        return this._getOption('columnCount');
    }
    set columnCount(value: number) {
        this._setOption('columnCount', value);
    }

    @Input()
    get columnItemSpacing(): number {
        return this._getOption('columnItemSpacing');
    }
    set columnItemSpacing(value: number) {
        this._setOption('columnItemSpacing', value);
    }

    @Input()
    get customizeHint(): ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string) {
        return this._getOption('customizeHint');
    }
    set customizeHint(value: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string)) {
        this._setOption('customizeHint', value);
    }

    @Input()
    get customizeItems(): ((items: Array<LegendItem>) => Array<LegendItem>) {
        return this._getOption('customizeItems');
    }
    set customizeItems(value: ((items: Array<LegendItem>) => Array<LegendItem>)) {
        this._setOption('customizeItems', value);
    }

    @Input()
    get customizeText(): ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get horizontalAlignment(): "center" | "left" | "right" {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: "center" | "left" | "right") {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get hoverMode(): "excludePoints" | "includePoints" | "none" {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: "excludePoints" | "includePoints" | "none") {
        this._setOption('hoverMode', value);
    }

    @Input()
    get itemsAlignment(): "center" | "left" | "right" {
        return this._getOption('itemsAlignment');
    }
    set itemsAlignment(value: "center" | "left" | "right") {
        this._setOption('itemsAlignment', value);
    }

    @Input()
    get itemTextPosition(): "bottom" | "left" | "right" | "top" {
        return this._getOption('itemTextPosition');
    }
    set itemTextPosition(value: "bottom" | "left" | "right" | "top") {
        this._setOption('itemTextPosition', value);
    }

    @Input()
    get margin(): number | Record<string, any> | { bottom: number, left: number, right: number, top: number } {
        return this._getOption('margin');
    }
    set margin(value: number | Record<string, any> | { bottom: number, left: number, right: number, top: number }) {
        this._setOption('margin', value);
    }

    @Input()
    get markerSize(): number {
        return this._getOption('markerSize');
    }
    set markerSize(value: number) {
        this._setOption('markerSize', value);
    }

    @Input()
    get markerTemplate(): any {
        return this._getOption('markerTemplate');
    }
    set markerTemplate(value: any) {
        this._setOption('markerTemplate', value);
    }

    @Input()
    get orientation(): "horizontal" | "vertical" {
        return this._getOption('orientation');
    }
    set orientation(value: "horizontal" | "vertical") {
        this._setOption('orientation', value);
    }

    @Input()
    get paddingLeftRight(): number {
        return this._getOption('paddingLeftRight');
    }
    set paddingLeftRight(value: number) {
        this._setOption('paddingLeftRight', value);
    }

    @Input()
    get paddingTopBottom(): number {
        return this._getOption('paddingTopBottom');
    }
    set paddingTopBottom(value: number) {
        this._setOption('paddingTopBottom', value);
    }

    @Input()
    get rowCount(): number {
        return this._getOption('rowCount');
    }
    set rowCount(value: number) {
        this._setOption('rowCount', value);
    }

    @Input()
    get rowItemSpacing(): number {
        return this._getOption('rowItemSpacing');
    }
    set rowItemSpacing(value: number) {
        this._setOption('rowItemSpacing', value);
    }

    @Input()
    get title(): Record<string, any> | string | { font: Font, horizontalAlignment: "center" | "left" | "right", margin: Record<string, any>, placeholderSize: number, subtitle: Record<string, any> | string, text: string, verticalAlignment: "bottom" | "top" } {
        return this._getOption('title');
    }
    set title(value: Record<string, any> | string | { font: Font, horizontalAlignment: "center" | "left" | "right", margin: Record<string, any>, placeholderSize: number, subtitle: Record<string, any> | string, text: string, verticalAlignment: "bottom" | "top" }) {
        this._setOption('title', value);
    }

    @Input()
    get verticalAlignment(): "bottom" | "top" {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: "bottom" | "top") {
        this._setOption('verticalAlignment', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'legend';
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
    DxoPolarChartLegendComponent
  ],
  exports: [
    DxoPolarChartLegendComponent
  ],
})
export class DxoPolarChartLegendModule { }
