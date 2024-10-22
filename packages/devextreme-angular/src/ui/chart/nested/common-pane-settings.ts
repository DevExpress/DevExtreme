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




import { ChartsColor } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-common-pane-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartCommonPaneSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): ChartsColor | string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: ChartsColor | string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): Record<string, any> | { bottom: boolean, color: string, dashStyle: "dash" | "dot" | "longDash" | "solid", left: boolean, opacity: number, right: boolean, top: boolean, visible: boolean, width: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { bottom: boolean, color: string, dashStyle: "dash" | "dot" | "longDash" | "solid", left: boolean, opacity: number, right: boolean, top: boolean, visible: boolean, width: number }) {
        this._setOption('border', value);
    }


    protected get _optionPath() {
        return 'commonPaneSettings';
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
    DxoChartCommonPaneSettingsComponent
  ],
  exports: [
    DxoChartCommonPaneSettingsComponent
  ],
})
export class DxoChartCommonPaneSettingsModule { }
