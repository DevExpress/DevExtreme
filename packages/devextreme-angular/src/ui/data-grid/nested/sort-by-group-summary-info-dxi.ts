/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { SortOrder } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-sort-by-group-summary-info',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiSortByGroupSummaryInfoComponent extends CollectionNestedOption {
    @Input()
    get groupColumn(): string | undefined {
        return this._getOption('groupColumn');
    }
    set groupColumn(value: string | undefined) {
        this._setOption('groupColumn', value);
    }

    @Input()
    get sortOrder(): SortOrder | string | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | string | undefined) {
        this._setOption('sortOrder', value);
    }

    @Input()
    get summaryItem(): number | string | undefined {
        return this._getOption('summaryItem');
    }
    set summaryItem(value: number | string | undefined) {
        this._setOption('summaryItem', value);
    }


    protected get _optionPath() {
        return 'sortByGroupSummaryInfo';
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
    DxiSortByGroupSummaryInfoComponent
  ],
  exports: [
    DxiSortByGroupSummaryInfoComponent
  ],
})
export class DxiSortByGroupSummaryInfoModule { }
