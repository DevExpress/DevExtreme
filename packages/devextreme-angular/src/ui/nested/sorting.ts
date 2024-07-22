/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoGanttSorting } from './base/gantt-sorting';


@Component({
    selector: 'dxo-sorting',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'ascendingText',
        'clearText',
        'descendingText',
        'mode',
        'showSortIndexes'
    ]
})
export class DxoSortingComponent extends DxoGanttSorting implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'sorting';
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
    DxoSortingComponent
  ],
  exports: [
    DxoSortingComponent
  ],
})
export class DxoSortingModule { }
