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

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-lookup',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridLookupComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowClearing(): boolean {
        return this._getOption('allowClearing');
    }
    set allowClearing(value: boolean) {
        this._setOption('allowClearing', value);
    }

    @Input()
    get calculateCellValue(): ((rowData: any) => any) {
        return this._getOption('calculateCellValue');
    }
    set calculateCellValue(value: ((rowData: any) => any)) {
        this._setOption('calculateCellValue', value);
    }

    @Input()
    get dataSource(): Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store) {
        this._setOption('dataSource', value);
    }

    @Input()
    get displayExpr(): ((data: any) => string) | string {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: ((data: any) => string) | string) {
        this._setOption('displayExpr', value);
    }

    @Input()
    get valueExpr(): string | ((data: any) => string | number | boolean) {
        return this._getOption('valueExpr');
    }
    set valueExpr(value: string | ((data: any) => string | number | boolean)) {
        this._setOption('valueExpr', value);
    }


    protected get _optionPath() {
        return 'lookup';
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
    DxoDataGridLookupComponent
  ],
  exports: [
    DxoDataGridLookupComponent
  ],
})
export class DxoDataGridLookupModule { }
