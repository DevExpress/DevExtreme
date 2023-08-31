/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Store, StoreOptions } from 'devextreme/data';
import XmlaStore, { XmlaStoreOptions } from 'devextreme/ui/pivot_grid/xmla_store';
import { format } from 'devextreme/ui/widget/ui.widget';

@Component({
    template: ''
})
export abstract class DxoPivotGridDataSource extends NestedOption {
    get fields(): Array<any | { allowCrossGroupCalculation?: boolean, allowExpandAll?: boolean, allowFiltering?: boolean, allowSorting?: boolean, allowSortingBySummary?: boolean, area?: string, areaIndex?: number, calculateCustomSummary?: Function, calculateSummaryValue?: Function, caption?: string, customizeText?: Function, dataField?: string, dataType?: string, displayFolder?: string, expanded?: boolean, filterType?: string, filterValues?: Array<any>, format?: format | string, groupIndex?: number, groupInterval?: number | string, groupName?: string, headerFilter?: { allowSearch?: boolean, height?: number, width?: number }, isMeasure?: boolean, precision?: number, runningTotal?: string, selector?: Function, showGrandTotals?: boolean, showTotals?: boolean, showValues?: boolean, sortBy?: string, sortBySummaryField?: string, sortBySummaryPath?: Array<number | string>, sortingMethod?: Function, sortOrder?: string, summaryDisplayMode?: string, summaryType?: string, visible?: boolean, width?: number, wordWrapEnabled?: boolean }> {
        return this._getOption('fields');
    }
    set fields(value: Array<any | { allowCrossGroupCalculation?: boolean, allowExpandAll?: boolean, allowFiltering?: boolean, allowSorting?: boolean, allowSortingBySummary?: boolean, area?: string, areaIndex?: number, calculateCustomSummary?: Function, calculateSummaryValue?: Function, caption?: string, customizeText?: Function, dataField?: string, dataType?: string, displayFolder?: string, expanded?: boolean, filterType?: string, filterValues?: Array<any>, format?: format | string, groupIndex?: number, groupInterval?: number | string, groupName?: string, headerFilter?: { allowSearch?: boolean, height?: number, width?: number }, isMeasure?: boolean, precision?: number, runningTotal?: string, selector?: Function, showGrandTotals?: boolean, showTotals?: boolean, showValues?: boolean, sortBy?: string, sortBySummaryField?: string, sortBySummaryPath?: Array<number | string>, sortingMethod?: Function, sortOrder?: string, summaryDisplayMode?: string, summaryType?: string, visible?: boolean, width?: number, wordWrapEnabled?: boolean }>) {
        this._setOption('fields', value);
    }

    get filter(): any {
        return this._getOption('filter');
    }
    set filter(value: any) {
        this._setOption('filter', value);
    }

    get onChanged(): Function {
        return this._getOption('onChanged');
    }
    set onChanged(value: Function) {
        this._setOption('onChanged', value);
    }

    get onFieldsPrepared(): Function {
        return this._getOption('onFieldsPrepared');
    }
    set onFieldsPrepared(value: Function) {
        this._setOption('onFieldsPrepared', value);
    }

    get onLoadError(): Function {
        return this._getOption('onLoadError');
    }
    set onLoadError(value: Function) {
        this._setOption('onLoadError', value);
    }

    get onLoadingChanged(): Function {
        return this._getOption('onLoadingChanged');
    }
    set onLoadingChanged(value: Function) {
        this._setOption('onLoadingChanged', value);
    }

    get remoteOperations(): boolean {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: boolean) {
        this._setOption('remoteOperations', value);
    }

    get retrieveFields(): boolean {
        return this._getOption('retrieveFields');
    }
    set retrieveFields(value: boolean) {
        this._setOption('retrieveFields', value);
    }

    get store(): Store | StoreOptions | XmlaStore | XmlaStoreOptions | { type?: string } | Array<any> {
        return this._getOption('store');
    }
    set store(value: Store | StoreOptions | XmlaStore | XmlaStoreOptions | { type?: string } | Array<any>) {
        this._setOption('store', value);
    }
}
