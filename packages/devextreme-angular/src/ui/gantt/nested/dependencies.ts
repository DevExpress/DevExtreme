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
    selector: 'dxo-gantt-dependencies',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
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
    get keyExpr(): ((dependency: any) => any) | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: ((dependency: any) => any) | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get predecessorIdExpr(): ((dependency: any, value: any) => any) | string {
        return this._getOption('predecessorIdExpr');
    }
    set predecessorIdExpr(value: ((dependency: any, value: any) => any) | string) {
        this._setOption('predecessorIdExpr', value);
    }

    @Input()
    get successorIdExpr(): ((dependency: any, value: any) => any) | string {
        return this._getOption('successorIdExpr');
    }
    set successorIdExpr(value: ((dependency: any, value: any) => any) | string) {
        this._setOption('successorIdExpr', value);
    }

    @Input()
    get typeExpr(): ((dependency: any, value: any) => any) | string {
        return this._getOption('typeExpr');
    }
    set typeExpr(value: ((dependency: any, value: any) => any) | string) {
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
  imports: [
    DxoGanttDependenciesComponent
  ],
  exports: [
    DxoGanttDependenciesComponent
  ],
})
export class DxoGanttDependenciesModule { }
