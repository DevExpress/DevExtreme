/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-sort-by-group-summary-info',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDataGridSortByGroupSummaryInfoComponent extends CollectionNestedOption {
    @Input()
    get groupColumn(): string {
        return this._getOption('groupColumn');
    }
    set groupColumn(value: string) {
        this._setOption('groupColumn', value);
    }

    @Input()
    get sortOrder(): "asc" | "desc" {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: "asc" | "desc") {
        this._setOption('sortOrder', value);
    }

    @Input()
    get summaryItem(): number | string {
        return this._getOption('summaryItem');
    }
    set summaryItem(value: number | string) {
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
    DxiDataGridSortByGroupSummaryInfoComponent
  ],
  exports: [
    DxiDataGridSortByGroupSummaryInfoComponent
  ],
})
export class DxiDataGridSortByGroupSummaryInfoModule { }
