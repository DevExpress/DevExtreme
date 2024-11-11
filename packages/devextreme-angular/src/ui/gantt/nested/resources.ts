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




import DataSource from 'devextreme/data/data_source';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-gantt-resources',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttResourcesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get colorExpr(): Function | string {
        return this._getOption('colorExpr');
    }
    set colorExpr(value: Function | string) {
        this._setOption('colorExpr', value);
    }

    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }

    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get textExpr(): Function | string {
        return this._getOption('textExpr');
    }
    set textExpr(value: Function | string) {
        this._setOption('textExpr', value);
    }


    protected get _optionPath() {
        return 'resources';
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
    DxoGanttResourcesComponent
  ],
  exports: [
    DxoGanttResourcesComponent
  ],
})
export class DxoGanttResourcesModule { }
