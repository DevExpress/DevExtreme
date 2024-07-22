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
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-dependencies',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDependenciesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<any>) {
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
    DxoDependenciesComponent
  ],
  exports: [
    DxoDependenciesComponent
  ],
})
export class DxoDependenciesModule { }
