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




import { HorizontalAlignment } from 'devextreme/common';
import { Format } from 'devextreme/common/core/localization';
import { DashStyle, Font, RelativePosition } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-common-series-settings-label',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartCommonSeriesSettingsLabelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get alignment(): HorizontalAlignment {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment) {
        this._setOption('alignment', value);
    }

    @Input()
    get argumentFormat(): Format | undefined {
        return this._getOption('argumentFormat');
    }
    set argumentFormat(value: Format | undefined) {
        this._setOption('argumentFormat', value);
    }

    @Input()
    get backgroundColor(): string | undefined {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string | undefined) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get connector(): { color?: string | undefined, visible?: boolean, width?: number } {
        return this._getOption('connector');
    }
    set connector(value: { color?: string | undefined, visible?: boolean, width?: number }) {
        this._setOption('connector', value);
    }

    @Input()
    get customizeText(): ((pointInfo: any) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((pointInfo: any) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get displayFormat(): string | undefined {
        return this._getOption('displayFormat');
    }
    set displayFormat(value: string | undefined) {
        this._setOption('displayFormat', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get format(): Format | undefined {
        return this._getOption('format');
    }
    set format(value: Format | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get horizontalOffset(): number {
        return this._getOption('horizontalOffset');
    }
    set horizontalOffset(value: number) {
        this._setOption('horizontalOffset', value);
    }

    @Input()
    get position(): RelativePosition {
        return this._getOption('position');
    }
    set position(value: RelativePosition) {
        this._setOption('position', value);
    }

    @Input()
    get rotationAngle(): number {
        return this._getOption('rotationAngle');
    }
    set rotationAngle(value: number) {
        this._setOption('rotationAngle', value);
    }

    @Input()
    get showForZeroValues(): boolean {
        return this._getOption('showForZeroValues');
    }
    set showForZeroValues(value: boolean) {
        this._setOption('showForZeroValues', value);
    }

    @Input()
    get verticalOffset(): number {
        return this._getOption('verticalOffset');
    }
    set verticalOffset(value: number) {
        this._setOption('verticalOffset', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'label';
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
    DxoChartCommonSeriesSettingsLabelComponent
  ],
  exports: [
    DxoChartCommonSeriesSettingsLabelComponent
  ],
})
export class DxoChartCommonSeriesSettingsLabelModule { }
