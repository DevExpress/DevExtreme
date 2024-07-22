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
import { DxiGanttStripLine } from './base/gantt-strip-line-dxi';


@Component({
    selector: 'dxi-strip-line',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
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
  declarations: [
    DxiStripLineComponent
  ],
  exports: [
    DxiStripLineComponent
  ],
})
export class DxiStripLineModule { }
