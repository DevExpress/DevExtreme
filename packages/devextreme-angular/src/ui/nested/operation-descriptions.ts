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
import { DxoGanttFilterRowOperationDescriptions } from './base/gantt-filter-row-operation-descriptions';


@Component({
    selector: 'dxo-operation-descriptions',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'between',
        'contains',
        'endsWith',
        'equal',
        'greaterThan',
        'greaterThanOrEqual',
        'lessThan',
        'lessThanOrEqual',
        'notContains',
        'notEqual',
        'startsWith'
    ]
})
export class DxoOperationDescriptionsComponent extends DxoGanttFilterRowOperationDescriptions implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'operationDescriptions';
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
    DxoOperationDescriptionsComponent
  ],
  exports: [
    DxoOperationDescriptionsComponent
  ],
})
export class DxoOperationDescriptionsModule { }
