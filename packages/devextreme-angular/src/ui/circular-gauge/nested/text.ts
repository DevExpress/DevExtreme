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
import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-circular-gauge-text',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCircularGaugeTextComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeText(): ((indicatedValue: { value: number, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((indicatedValue: { value: number, valueText: string }) => string)) {
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
    get format(): LocalizationTypes.Format {
        return this._getOption('format');
    }
    set format(value: LocalizationTypes.Format) {
        this._setOption('format', value);
    }

    @Input()
    get indent(): number {
        return this._getOption('indent');
    }
    set indent(value: number) {
        this._setOption('indent', value);
    }


    protected get _optionPath() {
        return 'text';
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
    DxoCircularGaugeTextComponent
  ],
  exports: [
    DxoCircularGaugeTextComponent
  ],
})
export class DxoCircularGaugeTextModule { }
