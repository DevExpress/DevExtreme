/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-chart-strip',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiChartStripComponent extends CollectionNestedOption {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get endValue(): Date | number | string {
        return this._getOption('endValue');
    }
    set endValue(value: Date | number | string) {
        this._setOption('endValue', value);
    }

    @Input()
    get label(): Record<string, any> | { font?: Font, horizontalAlignment?: "center" | "left" | "right", text?: string, verticalAlignment?: "bottom" | "center" | "top" } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { font?: Font, horizontalAlignment?: "center" | "left" | "right", text?: string, verticalAlignment?: "bottom" | "center" | "top" }) {
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

    @Input()
    get startValue(): Date | number | string {
        return this._getOption('startValue');
    }
    set startValue(value: Date | number | string) {
        this._setOption('startValue', value);
    }


    protected get _optionPath() {
        return 'strips';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiChartStripComponent
  ],
  exports: [
    DxiChartStripComponent
  ],
})
export class DxiChartStripModule { }
