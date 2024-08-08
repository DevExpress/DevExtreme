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
    selector: 'dxo-diagram-edges',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramEdgesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customDataExpr(): Function | string | undefined {
        return this._getOption('customDataExpr');
    }
    set customDataExpr(value: Function | string | undefined) {
        this._setOption('customDataExpr', value);
    }

    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<any>) {
        this._setOption('dataSource', value);
    }

    @Input()
    get fromExpr(): Function | string {
        return this._getOption('fromExpr');
    }
    set fromExpr(value: Function | string) {
        this._setOption('fromExpr', value);
    }

    @Input()
    get fromLineEndExpr(): Function | string | undefined {
        return this._getOption('fromLineEndExpr');
    }
    set fromLineEndExpr(value: Function | string | undefined) {
        this._setOption('fromLineEndExpr', value);
    }

    @Input()
    get fromPointIndexExpr(): Function | string | undefined {
        return this._getOption('fromPointIndexExpr');
    }
    set fromPointIndexExpr(value: Function | string | undefined) {
        this._setOption('fromPointIndexExpr', value);
    }

    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get lineTypeExpr(): Function | string | undefined {
        return this._getOption('lineTypeExpr');
    }
    set lineTypeExpr(value: Function | string | undefined) {
        this._setOption('lineTypeExpr', value);
    }

    @Input()
    get lockedExpr(): Function | string | undefined {
        return this._getOption('lockedExpr');
    }
    set lockedExpr(value: Function | string | undefined) {
        this._setOption('lockedExpr', value);
    }

    @Input()
    get pointsExpr(): Function | string | undefined {
        return this._getOption('pointsExpr');
    }
    set pointsExpr(value: Function | string | undefined) {
        this._setOption('pointsExpr', value);
    }

    @Input()
    get styleExpr(): Function | string | undefined {
        return this._getOption('styleExpr');
    }
    set styleExpr(value: Function | string | undefined) {
        this._setOption('styleExpr', value);
    }

    @Input()
    get textExpr(): Function | string | undefined {
        return this._getOption('textExpr');
    }
    set textExpr(value: Function | string | undefined) {
        this._setOption('textExpr', value);
    }

    @Input()
    get textStyleExpr(): Function | string | undefined {
        return this._getOption('textStyleExpr');
    }
    set textStyleExpr(value: Function | string | undefined) {
        this._setOption('textStyleExpr', value);
    }

    @Input()
    get toExpr(): Function | string {
        return this._getOption('toExpr');
    }
    set toExpr(value: Function | string) {
        this._setOption('toExpr', value);
    }

    @Input()
    get toLineEndExpr(): Function | string | undefined {
        return this._getOption('toLineEndExpr');
    }
    set toLineEndExpr(value: Function | string | undefined) {
        this._setOption('toLineEndExpr', value);
    }

    @Input()
    get toPointIndexExpr(): Function | string | undefined {
        return this._getOption('toPointIndexExpr');
    }
    set toPointIndexExpr(value: Function | string | undefined) {
        this._setOption('toPointIndexExpr', value);
    }

    @Input()
    get zIndexExpr(): Function | string | undefined {
        return this._getOption('zIndexExpr');
    }
    set zIndexExpr(value: Function | string | undefined) {
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
