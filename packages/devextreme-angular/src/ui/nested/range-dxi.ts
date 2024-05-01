/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import DevExpress from 'devextreme/bundles/dx.all';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-range',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiRangeComponent extends CollectionNestedOption {
    @Input()
    get color(): DevExpress.common.charts.ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: DevExpress.common.charts.ChartsColor | string) {
        this._setOption('color', value);
    }

    @Input()
    get endValue(): number {
        return this._getOption('endValue');
    }
    set endValue(value: number) {
        this._setOption('endValue', value);
    }

    @Input()
    get startValue(): number {
        return this._getOption('startValue');
    }
    set startValue(value: number) {
        this._setOption('startValue', value);
    }


    protected get _optionPath() {
        return 'ranges';
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
    DxiRangeComponent
  ],
  exports: [
    DxiRangeComponent
  ],
})
export class DxiRangeModule { }
