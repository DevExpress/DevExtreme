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
import { DxiGanttStripLine } from './base/gantt-strip-line-dxi';

import { PROPERTY_TOKEN_stripLines } from 'devextreme-angular/core/tokens';


@Component({
    selector: 'dxi-strip-line',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_stripLines,
           useExisting: DxiStripLineComponent,
        }
    ],
    inputs: [
        'cssClass',
        'end',
        'start',
        'title'
    ]
})
export class DxiStripLineComponent extends DxiGanttStripLine {

    

    protected get _optionPath() {
        return 'stripLines';
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
    DxiStripLineComponent
  ],
  exports: [
    DxiStripLineComponent
  ],
})
export class DxiStripLineModule { }
