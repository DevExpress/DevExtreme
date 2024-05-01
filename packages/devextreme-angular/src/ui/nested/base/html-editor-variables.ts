/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';

@Component({
    template: ''
})
export abstract class DxoHtmlEditorVariables extends NestedOption {
    get dataSource(): DataSource | DataSourceOptions | Store | null | string | Array<string> {
        return this._getOption('dataSource');
    }
    set dataSource(value: DataSource | DataSourceOptions | Store | null | string | Array<string>) {
        this._setOption('dataSource', value);
    }

    get escapeChar(): string | Array<string> {
        return this._getOption('escapeChar');
    }
    set escapeChar(value: string | Array<string>) {
        this._setOption('escapeChar', value);
    }
}
