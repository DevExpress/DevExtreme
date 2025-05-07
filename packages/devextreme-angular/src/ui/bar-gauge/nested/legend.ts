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




import { DashStyle, Font } from 'devextreme/common/charts';
import { BarGaugeBarInfo, BarGaugeLegendItem } from 'devextreme/viz/bar_gauge';
import { HorizontalAlignment, Position, Orientation, VerticalEdge } from 'devextreme/common';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-bar-gauge-legend',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBarGaugeLegendComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): string | undefined {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string | undefined) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }) {
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
    get customizeHint(): ((arg: { item: BarGaugeBarInfo, text: string }) => string) {
        return this._getOption('customizeHint');
    }
    set customizeHint(value: ((arg: { item: BarGaugeBarInfo, text: string }) => string)) {
        this._setOption('customizeHint', value);
    }

    @Input()
    get customizeItems(): ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>) {
        return this._getOption('customizeItems');
    }
    set customizeItems(value: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>)) {
        this._setOption('customizeItems', value);
    }

    @Input()
    get customizeText(): ((arg: { item: BarGaugeBarInfo, text: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((arg: { item: BarGaugeBarInfo, text: string }) => string)) {
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
    get horizontalAlignment(): HorizontalAlignment {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalAlignment) {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get itemsAlignment(): HorizontalAlignment | undefined {
        return this._getOption('itemsAlignment');
    }
    set itemsAlignment(value: HorizontalAlignment | undefined) {
        this._setOption('itemsAlignment', value);
    }

    @Input()
    get itemTextFormat(): Format | undefined {
        return this._getOption('itemTextFormat');
    }
    set itemTextFormat(value: Format | undefined) {
        this._setOption('itemTextFormat', value);
    }

    @Input()
    get itemTextPosition(): Position | undefined {
        return this._getOption('itemTextPosition');
    }
    set itemTextPosition(value: Position | undefined) {
        this._setOption('itemTextPosition', value);
    }

    @Input()
    get margin(): number | { bottom?: number, left?: number, right?: number, top?: number } {
        return this._getOption('margin');
    }
    set margin(value: number | { bottom?: number, left?: number, right?: number, top?: number }) {
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
    get orientation(): Orientation | undefined {
        return this._getOption('orientation');
    }
    set orientation(value: Orientation | undefined) {
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
    get title(): string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge } {
        return this._getOption('title');
    }
    set title(value: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }) {
        this._setOption('title', value);
    }

    @Input()
    get verticalAlignment(): VerticalEdge {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: VerticalEdge) {
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
    DxoBarGaugeLegendComponent
  ],
  exports: [
    DxoBarGaugeLegendComponent
  ],
})
export class DxoBarGaugeLegendModule { }
