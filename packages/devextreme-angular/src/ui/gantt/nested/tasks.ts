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
    selector: 'dxo-gantt-tasks',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttTasksComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get endExpr(): Function | string {
        return this._getOption('endExpr');
    }
    set endExpr(value: Function | string) {
        this._setOption('endExpr', value);
    }

    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get parentIdExpr(): Function | string {
        return this._getOption('parentIdExpr');
    }
    set parentIdExpr(value: Function | string) {
        this._setOption('parentIdExpr', value);
    }

    @Input()
    get progressExpr(): Function | string {
        return this._getOption('progressExpr');
    }
    set progressExpr(value: Function | string) {
        this._setOption('progressExpr', value);
    }

    @Input()
    get startExpr(): Function | string {
        return this._getOption('startExpr');
    }
    set startExpr(value: Function | string) {
        this._setOption('startExpr', value);
    }

    @Input()
    get titleExpr(): Function | string {
        return this._getOption('titleExpr');
    }
    set titleExpr(value: Function | string) {
        this._setOption('titleExpr', value);
    }


    protected get _optionPath() {
        return 'tasks';
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
    DxoGanttTasksComponent
  ],
  exports: [
    DxoGanttTasksComponent
  ],
})
export class DxoGanttTasksModule { }
