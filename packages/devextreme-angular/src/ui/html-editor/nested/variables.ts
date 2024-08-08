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
    selector: 'dxo-html-editor-variables',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHtmlEditorVariablesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<string> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<string>) {
        this._setOption('dataSource', value);
    }

    @Input()
    get escapeChar(): string | Array<string> {
        return this._getOption('escapeChar');
    }
    set escapeChar(value: string | Array<string>) {
        this._setOption('escapeChar', value);
    }


    protected get _optionPath() {
        return 'variables';
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
    DxoHtmlEditorVariablesComponent
  ],
  exports: [
    DxoHtmlEditorVariablesComponent
  ],
})
export class DxoHtmlEditorVariablesModule { }
