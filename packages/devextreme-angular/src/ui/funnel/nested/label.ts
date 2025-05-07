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




import { DashStyle, Font, LabelPosition, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { dxFunnelItem } from 'devextreme/viz/funnel';
import { Format } from 'devextreme/common/core/localization';
import { HorizontalEdge } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-funnel-label',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFunnelLabelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get connector(): { color?: string | undefined, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('connector');
    }
    set connector(value: { color?: string | undefined, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('connector', value);
    }

    @Input()
    get customizeText(): ((itemInfo: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((itemInfo: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => string)) {
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
    get format(): Format | undefined {
        return this._getOption('format');
    }
    set format(value: Format | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get horizontalAlignment(): HorizontalEdge {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalEdge) {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get horizontalOffset(): number {
        return this._getOption('horizontalOffset');
    }
    set horizontalOffset(value: number) {
        this._setOption('horizontalOffset', value);
    }

    @Input()
    get position(): LabelPosition {
        return this._getOption('position');
    }
    set position(value: LabelPosition) {
        this._setOption('position', value);
    }

    @Input()
    get showForZeroValues(): boolean {
        return this._getOption('showForZeroValues');
    }
    set showForZeroValues(value: boolean) {
        this._setOption('showForZeroValues', value);
    }

    @Input()
    get textOverflow(): TextOverflow {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: TextOverflow) {
        this._setOption('textOverflow', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get wordWrap(): WordWrap {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: WordWrap) {
        this._setOption('wordWrap', value);
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
    DxoFunnelLabelComponent
  ],
  exports: [
    DxoFunnelLabelComponent
  ],
})
export class DxoFunnelLabelModule { }
