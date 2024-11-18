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
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-bar-gauge-label',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBarGaugeLabelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get connectorColor(): string | undefined {
        return this._getOption('connectorColor');
    }
    set connectorColor(value: string | undefined) {
        this._setOption('connectorColor', value);
    }

    @Input()
    get connectorWidth(): number {
        return this._getOption('connectorWidth');
    }
    set connectorWidth(value: number) {
        this._setOption('connectorWidth', value);
    }

    @Input()
    get customizeText(): ((barValue: { value: number, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((barValue: { value: number, valueText: string }) => string)) {
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
    get indent(): number {
        return this._getOption('indent');
    }
    set indent(value: number) {
        this._setOption('indent', value);
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
    DxoBarGaugeLabelComponent
  ],
  exports: [
    DxoBarGaugeLabelComponent
  ],
})
export class DxoBarGaugeLabelModule { }
