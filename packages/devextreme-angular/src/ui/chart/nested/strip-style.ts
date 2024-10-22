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

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-strip-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartStripStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get label(): Record<string, any> | { font: Font, horizontalAlignment: "center" | "left" | "right", verticalAlignment: "bottom" | "center" | "top" } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { font: Font, horizontalAlignment: "center" | "left" | "right", verticalAlignment: "bottom" | "center" | "top" }) {
        this._setOption('label', value);
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


    protected get _optionPath() {
        return 'stripStyle';
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
    DxoChartStripStyleComponent
  ],
  exports: [
    DxoChartStripStyleComponent
  ],
})
export class DxoChartStripStyleModule { }
