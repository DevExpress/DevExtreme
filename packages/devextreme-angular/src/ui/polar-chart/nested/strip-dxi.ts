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
    selector: 'dxi-polar-chart-strip',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiPolarChartStripComponent extends CollectionNestedOption {
    @Input()
    get color(): string | undefined {
        return this._getOption('color');
    }
    set color(value: string | undefined) {
        this._setOption('color', value);
    }

    @Input()
    get endValue(): Date | number | string | undefined {
        return this._getOption('endValue');
    }
    set endValue(value: Date | number | string | undefined) {
        this._setOption('endValue', value);
    }

    @Input()
    get label(): { font?: Font, text?: string | undefined } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, text?: string | undefined }) {
        this._setOption('label', value);
    }

    @Input()
    get startValue(): Date | number | string | undefined {
        return this._getOption('startValue');
    }
    set startValue(value: Date | number | string | undefined) {
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
    DxiPolarChartStripComponent
  ],
  exports: [
    DxiPolarChartStripComponent
  ],
})
export class DxiPolarChartStripModule { }
