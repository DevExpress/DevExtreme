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




import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-list-lookup',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListLookupComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowClearing(): boolean {
        return this._getOption('allowClearing');
    }
    set allowClearing(value: boolean) {
        this._setOption('allowClearing', value);
    }

    @Input()
    get calculateCellValue(): Function {
        return this._getOption('calculateCellValue');
    }
    set calculateCellValue(value: Function) {
        this._setOption('calculateCellValue', value);
    }

    @Input()
    get dataSource(): Store | DataSourceOptions | Function | null | undefined | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSourceOptions | Function | null | undefined | Array<any>) {
        this._setOption('dataSource', value);
    }

    @Input()
    get displayExpr(): Function | string | undefined {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: Function | string | undefined) {
        this._setOption('displayExpr', value);
    }

    @Input()
    get valueExpr(): string | undefined | Function {
        return this._getOption('valueExpr');
    }
    set valueExpr(value: string | undefined | Function) {
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
    DxoTreeListLookupComponent
  ],
  exports: [
    DxoTreeListLookupComponent
  ],
})
export class DxoTreeListLookupModule { }
