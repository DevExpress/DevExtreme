/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { SearchMode } from 'devextreme/common';
import { ColumnHeaderFilterSearchConfig, HeaderFilterGroupInterval, HeaderFilterSearchConfig } from 'devextreme/common/grids';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { dxGanttHeaderFilterTexts } from 'devextreme/ui/gantt';

@Component({
    template: ''
})
export abstract class DxoGanttHeaderFilter extends NestedOption {
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    get allowSelectAll(): boolean {
        return this._getOption('allowSelectAll');
    }
    set allowSelectAll(value: boolean) {
        this._setOption('allowSelectAll', value);
    }

    get dataSource(): DataSourceOptions | Store | Function | null | undefined | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: DataSourceOptions | Store | Function | null | undefined | Array<any>) {
        this._setOption('dataSource', value);
    }

    get groupInterval(): HeaderFilterGroupInterval | number | undefined {
        return this._getOption('groupInterval');
    }
    set groupInterval(value: HeaderFilterGroupInterval | number | undefined) {
        this._setOption('groupInterval', value);
    }

    get height(): number | undefined {
        return this._getOption('height');
    }
    set height(value: number | undefined) {
        this._setOption('height', value);
    }

    get search(): ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig {
        return this._getOption('search');
    }
    set search(value: ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig) {
        this._setOption('search', value);
    }

    get searchMode(): SearchMode {
        return this._getOption('searchMode');
    }
    set searchMode(value: SearchMode) {
        this._setOption('searchMode', value);
    }

    get width(): number | undefined {
        return this._getOption('width');
    }
    set width(value: number | undefined) {
        this._setOption('width', value);
    }

    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }

    get texts(): { cancel?: string, emptyValue?: string, ok?: string } | dxGanttHeaderFilterTexts {
        return this._getOption('texts');
    }
    set texts(value: { cancel?: string, emptyValue?: string, ok?: string } | dxGanttHeaderFilterTexts) {
        this._setOption('texts', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get showRelevantValues(): boolean {
        return this._getOption('showRelevantValues');
    }
    set showRelevantValues(value: boolean) {
        this._setOption('showRelevantValues', value);
    }
}
