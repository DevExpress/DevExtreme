/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-range-selector-break',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiRangeSelectorBreakComponent extends CollectionNestedOption {
    @Input()
    get endValue(): Date | number | string | undefined {
        return this._getOption('endValue');
    }
    set endValue(value: Date | number | string | undefined) {
        this._setOption('endValue', value);
    }

    @Input()
    get startValue(): Date | number | string | undefined {
        return this._getOption('startValue');
    }
    set startValue(value: Date | number | string | undefined) {
        this._setOption('startValue', value);
    }


    protected get _optionPath() {
        return 'breaks';
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
    DxiRangeSelectorBreakComponent
  ],
  exports: [
    DxiRangeSelectorBreakComponent
  ],
})
export class DxiRangeSelectorBreakModule { }
