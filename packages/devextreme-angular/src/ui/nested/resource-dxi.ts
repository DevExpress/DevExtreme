/* tslint:disable:max-line-length */


import {
    Component,
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
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-resource',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiResourceComponent extends CollectionNestedOption {
    @Input()
    get allowMultiple(): boolean {
        return this._getOption('allowMultiple');
    }
    set allowMultiple(value: boolean) {
        this._setOption('allowMultiple', value);
    }

    @Input()
    get colorExpr(): string {
        return this._getOption('colorExpr');
    }
    set colorExpr(value: string) {
        this._setOption('colorExpr', value);
    }

    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<any>) {
        this._setOption('dataSource', value);
    }

    @Input()
    get displayExpr(): Function | string {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: Function | string) {
        this._setOption('displayExpr', value);
    }

    @Input()
    get fieldExpr(): string {
        return this._getOption('fieldExpr');
    }
    set fieldExpr(value: string) {
        this._setOption('fieldExpr', value);
    }

    @Input()
    get label(): string {
        return this._getOption('label');
    }
    set label(value: string) {
        this._setOption('label', value);
    }

    @Input()
    get useColorAsDefault(): boolean {
        return this._getOption('useColorAsDefault');
    }
    set useColorAsDefault(value: boolean) {
        this._setOption('useColorAsDefault', value);
    }

    @Input()
    get valueExpr(): Function | string {
        return this._getOption('valueExpr');
    }
    set valueExpr(value: Function | string) {
        this._setOption('valueExpr', value);
    }


    protected get _optionPath() {
        return 'resources';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiResourceComponent
  ],
  exports: [
    DxiResourceComponent
  ],
})
export class DxiResourceModule { }
