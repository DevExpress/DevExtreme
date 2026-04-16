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




import type { default as DataSource, DataSourceOptions } from 'devextreme/data/data_source';
import type { Store } from 'devextreme/data/store';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-gantt-tasks',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoGanttTasksComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get colorExpr(): ((task: any, value: any) => any) | string {
        return this._getOption('colorExpr');
    }
    set colorExpr(value: ((task: any, value: any) => any) | string) {
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
    get endExpr(): ((task: any, value: any) => any) | string {
        return this._getOption('endExpr');
    }
    set endExpr(value: ((task: any, value: any) => any) | string) {
        this._setOption('endExpr', value);
    }

    @Input()
    get keyExpr(): ((task: any) => any) | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: ((task: any) => any) | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get parentIdExpr(): ((task: any, value: any) => any) | string {
        return this._getOption('parentIdExpr');
    }
    set parentIdExpr(value: ((task: any, value: any) => any) | string) {
        this._setOption('parentIdExpr', value);
    }

    @Input()
    get progressExpr(): ((task: any, value: any) => any) | string {
        return this._getOption('progressExpr');
    }
    set progressExpr(value: ((task: any, value: any) => any) | string) {
        this._setOption('progressExpr', value);
    }

    @Input()
    get startExpr(): ((task: any, value: any) => any) | string {
        return this._getOption('startExpr');
    }
    set startExpr(value: ((task: any, value: any) => any) | string) {
        this._setOption('startExpr', value);
    }

    @Input()
    get titleExpr(): ((task: any, value: any) => any) | string {
        return this._getOption('titleExpr');
    }
    set titleExpr(value: ((task: any, value: any) => any) | string) {
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
  imports: [
    DxoGanttTasksComponent
  ],
  exports: [
    DxoGanttTasksComponent
  ],
})
export class DxoGanttTasksModule { }
