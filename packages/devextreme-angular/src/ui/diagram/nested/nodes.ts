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
import { DataLayoutType } from 'devextreme/ui/diagram';
import { Orientation } from 'devextreme/common';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-diagram-nodes',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramNodesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get autoLayout(): DataLayoutType | { orientation?: Orientation, type?: DataLayoutType } {
        return this._getOption('autoLayout');
    }
    set autoLayout(value: DataLayoutType | { orientation?: Orientation, type?: DataLayoutType }) {
        this._setOption('autoLayout', value);
    }

    @Input()
    get autoSizeEnabled(): boolean {
        return this._getOption('autoSizeEnabled');
    }
    set autoSizeEnabled(value: boolean) {
        this._setOption('autoSizeEnabled', value);
    }

    @Input()
    get containerChildrenExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('containerChildrenExpr');
    }
    set containerChildrenExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('containerChildrenExpr', value);
    }

    @Input()
    get containerKeyExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('containerKeyExpr');
    }
    set containerKeyExpr(value: ((data: any, value: any) => any) | string) {
        this._setOption('containerKeyExpr', value);
    }

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
    get heightExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('heightExpr');
    }
    set heightExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('heightExpr', value);
    }

    @Input()
    get imageUrlExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('imageUrlExpr');
    }
    set imageUrlExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('imageUrlExpr', value);
    }

    @Input()
    get itemsExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('itemsExpr');
    }
    set itemsExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('itemsExpr', value);
    }

    @Input()
    get keyExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: ((data: any, value: any) => any) | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get leftExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('leftExpr');
    }
    set leftExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('leftExpr', value);
    }

    @Input()
    get lockedExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('lockedExpr');
    }
    set lockedExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('lockedExpr', value);
    }

    @Input()
    get parentKeyExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('parentKeyExpr');
    }
    set parentKeyExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('parentKeyExpr', value);
    }

    @Input()
    get styleExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('styleExpr');
    }
    set styleExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('styleExpr', value);
    }

    @Input()
    get textExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('textExpr');
    }
    set textExpr(value: ((data: any, value: any) => any) | string) {
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
    get topExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('topExpr');
    }
    set topExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('topExpr', value);
    }

    @Input()
    get typeExpr(): ((data: any, value: any) => any) | string {
        return this._getOption('typeExpr');
    }
    set typeExpr(value: ((data: any, value: any) => any) | string) {
        this._setOption('typeExpr', value);
    }

    @Input()
    get widthExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('widthExpr');
    }
    set widthExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('widthExpr', value);
    }

    @Input()
    get zIndexExpr(): ((data: any, value: any) => any) | string | undefined {
        return this._getOption('zIndexExpr');
    }
    set zIndexExpr(value: ((data: any, value: any) => any) | string | undefined) {
        this._setOption('zIndexExpr', value);
    }


    protected get _optionPath() {
        return 'nodes';
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
    DxoDiagramNodesComponent
  ],
  exports: [
    DxoDiagramNodesComponent
  ],
})
export class DxoDiagramNodesModule { }
