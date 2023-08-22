/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiVizScaleBreak } from './base/viz-scale-break-dxi';


@Component({
    selector: 'dxi-break',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'endValue',
        'startValue'
    ]
})
export class DxiBreakComponent extends DxiVizScaleBreak {

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
    DxiBreakComponent
  ],
  exports: [
    DxiBreakComponent
  ],
})
export class DxiBreakModule { }
