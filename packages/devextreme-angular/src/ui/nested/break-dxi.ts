/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiVizScaleBreak } from './base/viz-scale-break-dxi';

import { PROPERTY_TOKEN_breaks } from 'devextreme-angular/core/tokens';


@Component({
    selector: 'dxi-break',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_breaks,
           useExisting: DxiBreakComponent,
        }
    ],
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
  imports: [
    DxiBreakComponent
  ],
  exports: [
    DxiBreakComponent
  ],
})
export class DxiBreakModule { }
