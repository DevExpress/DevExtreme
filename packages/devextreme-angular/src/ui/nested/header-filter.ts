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
import { DxoGanttHeaderFilter } from './base/gantt-header-filter';


@Component({
    selector: 'dxo-header-filter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'allowSearch',
        'allowSelectAll',
        'dataSource',
        'groupInterval',
        'height',
        'search',
        'searchMode',
        'width',
        'searchTimeout',
        'texts',
        'visible',
        'showRelevantValues'
    ]
})
export class DxoHeaderFilterComponent extends DxoGanttHeaderFilter implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'headerFilter';
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
    DxoHeaderFilterComponent
  ],
  exports: [
    DxoHeaderFilterComponent
  ],
})
export class DxoHeaderFilterModule { }
