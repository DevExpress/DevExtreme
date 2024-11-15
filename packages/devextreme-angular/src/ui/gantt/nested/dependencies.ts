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
    selector: 'dxo-gantt-dependencies',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttDependenciesComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get predecessorIdExpr(): Function | string {
        return this._getOption('predecessorIdExpr');
    }
    set predecessorIdExpr(value: Function | string) {
        this._setOption('predecessorIdExpr', value);
    }

    @Input()
    get successorIdExpr(): Function | string {
        return this._getOption('successorIdExpr');
    }
    set successorIdExpr(value: Function | string) {
        this._setOption('successorIdExpr', value);
    }

    @Input()
    get typeExpr(): Function | string {
        return this._getOption('typeExpr');
    }
    set typeExpr(value: Function | string) {
        this._setOption('typeExpr', value);
    }


    protected get _optionPath() {
        return 'dependencies';
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
    DxoGanttDependenciesComponent
  ],
  exports: [
    DxoGanttDependenciesComponent
  ],
})
export class DxoGanttDependenciesModule { }
