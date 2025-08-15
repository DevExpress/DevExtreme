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
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { DxiVizScaleBreak } from './base/viz-scale-break-dxi';

@Component({
    selector: 'dxi-break',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiBreakComponent) => ({
               propertyName: 'breaks',
               component
            }),
            deps: [DxiBreakComponent],
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
