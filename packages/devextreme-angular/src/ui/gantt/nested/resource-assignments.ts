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
    selector: 'dxo-gantt-resource-assignments',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttResourceAssignmentsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get resourceIdExpr(): Function | string {
        return this._getOption('resourceIdExpr');
    }
    set resourceIdExpr(value: Function | string) {
        this._setOption('resourceIdExpr', value);
    }

    @Input()
    get taskIdExpr(): Function | string {
        return this._getOption('taskIdExpr');
    }
    set taskIdExpr(value: Function | string) {
        this._setOption('taskIdExpr', value);
    }


    protected get _optionPath() {
        return 'resourceAssignments';
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
    DxoGanttResourceAssignmentsComponent
  ],
  exports: [
    DxoGanttResourceAssignmentsComponent
  ],
})
export class DxoGanttResourceAssignmentsModule { }
