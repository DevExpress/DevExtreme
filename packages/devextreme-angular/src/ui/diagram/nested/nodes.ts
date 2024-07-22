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




import { Orientation } from 'devextreme/common';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { DataLayoutType } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-nodes-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoNodesDiagramComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get containerChildrenExpr(): Function | string | undefined {
        return this._getOption('containerChildrenExpr');
    }
    set containerChildrenExpr(value: Function | string | undefined) {
        this._setOption('containerChildrenExpr', value);
    }

    @Input()
    get containerKeyExpr(): Function | string {
        return this._getOption('containerKeyExpr');
    }
    set containerKeyExpr(value: Function | string) {
        this._setOption('containerKeyExpr', value);
    }

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
    get heightExpr(): Function | string | undefined {
        return this._getOption('heightExpr');
    }
    set heightExpr(value: Function | string | undefined) {
        this._setOption('heightExpr', value);
    }

    @Input()
    get imageUrlExpr(): Function | string | undefined {
        return this._getOption('imageUrlExpr');
    }
    set imageUrlExpr(value: Function | string | undefined) {
        this._setOption('imageUrlExpr', value);
    }

    @Input()
    get itemsExpr(): Function | string | undefined {
        return this._getOption('itemsExpr');
    }
    set itemsExpr(value: Function | string | undefined) {
        this._setOption('itemsExpr', value);
    }

    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }

    @Input()
    get leftExpr(): Function | string | undefined {
        return this._getOption('leftExpr');
    }
    set leftExpr(value: Function | string | undefined) {
        this._setOption('leftExpr', value);
    }

    @Input()
    get lockedExpr(): Function | string | undefined {
        return this._getOption('lockedExpr');
    }
    set lockedExpr(value: Function | string | undefined) {
        this._setOption('lockedExpr', value);
    }

    @Input()
    get parentKeyExpr(): Function | string | undefined {
        return this._getOption('parentKeyExpr');
    }
    set parentKeyExpr(value: Function | string | undefined) {
        this._setOption('parentKeyExpr', value);
    }

    @Input()
    get styleExpr(): Function | string | undefined {
        return this._getOption('styleExpr');
    }
    set styleExpr(value: Function | string | undefined) {
        this._setOption('styleExpr', value);
    }

    @Input()
    get textExpr(): Function | string {
        return this._getOption('textExpr');
    }
    set textExpr(value: Function | string) {
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
    get topExpr(): Function | string | undefined {
        return this._getOption('topExpr');
    }
    set topExpr(value: Function | string | undefined) {
        this._setOption('topExpr', value);
    }

    @Input()
    get typeExpr(): Function | string {
        return this._getOption('typeExpr');
    }
    set typeExpr(value: Function | string) {
        this._setOption('typeExpr', value);
    }

    @Input()
    get widthExpr(): Function | string | undefined {
        return this._getOption('widthExpr');
    }
    set widthExpr(value: Function | string | undefined) {
        this._setOption('widthExpr', value);
    }

    @Input()
    get zIndexExpr(): Function | string | undefined {
        return this._getOption('zIndexExpr');
    }
    set zIndexExpr(value: Function | string | undefined) {
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
    DxoNodesDiagramComponent
  ],
  exports: [
    DxoNodesDiagramComponent
  ],
})
export class DxoNodesDiagramModule { }
