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
import { DxoGanttFilterRow } from './base/gantt-filter-row';


@Component({
    selector: 'dxo-filter-row',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'applyFilter',
        'applyFilterText',
        'betweenEndText',
        'betweenStartText',
        'operationDescriptions',
        'resetOperationText',
        'showAllText',
        'showOperationChooser',
        'visible'
    ]
})
export class DxoFilterRowComponent extends DxoGanttFilterRow implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'filterRow';
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
    DxoFilterRowComponent
  ],
  exports: [
    DxoFilterRowComponent
  ],
})
export class DxoFilterRowModule { }
