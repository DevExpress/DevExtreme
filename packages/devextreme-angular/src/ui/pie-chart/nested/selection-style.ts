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
    selector: 'dxo-pie-chart-selection-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPieChartSelectionStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string) {
        this._setOption('color', value);
    }

    @Input()
    get hatching(): Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number } {
        return this._getOption('hatching');
    }
    set hatching(value: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }) {
        this._setOption('hatching', value);
    }

    @Input()
    get highlight(): boolean {
        return this._getOption('highlight');
    }
    set highlight(value: boolean) {
        this._setOption('highlight', value);
    }


    protected get _optionPath() {
        return 'selectionStyle';
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
    DxoPieChartSelectionStyleComponent
  ],
  exports: [
    DxoPieChartSelectionStyleComponent
  ],
})
export class DxoPieChartSelectionStyleModule { }
