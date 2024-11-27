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
    selector: 'dxo-diagram-edges',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramEdgesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customDataExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('customDataExpr');
    }
    set customDataExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('customDataExpr', value);
    }

    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }

    @Input()
    get fromExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('fromExpr');
    }
    set fromExpr(value: ((data: any, value: any) => any) | string) {
        this._setOption('fromExpr', value);
    }

    @Input()
    get fromLineEndExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('fromLineEndExpr');
    }
    set fromLineEndExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('fromLineEndExpr', value);
    }

    @Input()
    get fromPointIndexExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('fromPointIndexExpr');
    }
    set fromPointIndexExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('fromPointIndexExpr', value);
    }

    @Input()
    get keyExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: ((data: any, value: any) => any) | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get lineTypeExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('lineTypeExpr');
    }
    set lineTypeExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('lineTypeExpr', value);
    }

    @Input()
    get lockedExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('lockedExpr');
    }
    set lockedExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('lockedExpr', value);
    }

    @Input()
    get pointsExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('pointsExpr');
    }
    set pointsExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('pointsExpr', value);
    }

    @Input()
    get styleExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('styleExpr');
    }
    set styleExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('styleExpr', value);
    }

    @Input()
    get textExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('textExpr');
    }
    set textExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('textExpr', value);
    }

    @Input()
    get textStyleExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('textStyleExpr');
    }
    set textStyleExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('textStyleExpr', value);
    }

    @Input()
    get toExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('toExpr');
    }
    set toExpr(value: ((data: any, value: any) => any) | string) {
        this._setOption('toExpr', value);
    }

    @Input()
    get toLineEndExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('toLineEndExpr');
    }
    set toLineEndExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('toLineEndExpr', value);
    }

    @Input()
    get toPointIndexExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('toPointIndexExpr');
    }
    set toPointIndexExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('toPointIndexExpr', value);
    }

    @Input()
    get zIndexExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('zIndexExpr');
    }
    set zIndexExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('zIndexExpr', value);
    }


    protected get _optionPath() {
        return 'edges';
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
    DxoDiagramEdgesComponent
  ],
  exports: [
    DxoDiagramEdgesComponent
  ],
})
export class DxoDiagramEdgesModule { }
