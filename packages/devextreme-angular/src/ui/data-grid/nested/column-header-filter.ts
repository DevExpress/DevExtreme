/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { ColumnHeaderFilterSearchConfig } from 'devextreme/common/grids';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-column-header-filter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridColumnHeaderFilterComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    @Input()
    get allowSelectAll(): boolean {
        return this._getOption('allowSelectAll');
    }
    set allowSelectAll(value: boolean) {
        this._setOption('allowSelectAll', value);
    }

    @Input()
    get dataSource(): Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store) {
        this._setOption('dataSource', value);
    }

    @Input()
    get groupInterval(): number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year" {
        return this._getOption('groupInterval');
    }
    set groupInterval(value: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year") {
        this._setOption('groupInterval', value);
    }

    @Input()
    get height(): number | string {
        return this._getOption('height');
    }
    set height(value: number | string) {
        this._setOption('height', value);
    }

    @Input()
    get search(): ColumnHeaderFilterSearchConfig {
        return this._getOption('search');
    }
    set search(value: ColumnHeaderFilterSearchConfig) {
        this._setOption('search', value);
    }

    @Input()
    get searchMode(): "contains" | "startswith" | "equals" {
        return this._getOption('searchMode');
    }
    set searchMode(value: "contains" | "startswith" | "equals") {
        this._setOption('searchMode', value);
    }

    @Input()
    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }


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
    DxoDataGridColumnHeaderFilterComponent
  ],
  exports: [
    DxoDataGridColumnHeaderFilterComponent
  ],
})
export class DxoDataGridColumnHeaderFilterModule { }
