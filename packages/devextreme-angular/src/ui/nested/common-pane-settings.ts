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




import DevExpress from 'devextreme/bundles/dx.all';
import { DashStyle } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-common-pane-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCommonPaneSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): DevExpress.common.charts.ChartsColor | string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: DevExpress.common.charts.ChartsColor | string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number }) {
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
    DxoCommonPaneSettingsComponent
  ],
  exports: [
    DxoCommonPaneSettingsComponent
  ],
})
export class DxoCommonPaneSettingsModule { }
