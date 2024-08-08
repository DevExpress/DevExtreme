/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { Store, StoreOptions } from 'devextreme/data';
import XmlaStore, { XmlaStoreOptions } from 'devextreme/ui/pivot_grid/xmla_store';
import { format } from 'devextreme/ui/widget/ui.widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiPivotGridFieldComponent } from './field-dxi';


@Component({
    selector: 'dxo-pivot-grid-data-source',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridDataSourceComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fields(): Array<any | { allowCrossGroupCalculation?: boolean, allowExpandAll?: boolean, allowFiltering?: boolean, allowSorting?: boolean, allowSortingBySummary?: boolean, area?: string, areaIndex?: number, calculateCustomSummary?: Function, calculateSummaryValue?: Function, caption?: string, customizeText?: Function, dataField?: string, dataType?: string, displayFolder?: string, expanded?: boolean, filterType?: string, filterValues?: Array<any>, format?: format | string, groupIndex?: number, groupInterval?: number | string, groupName?: string, headerFilter?: { allowSearch?: boolean, height?: number, width?: number }, isMeasure?: boolean, precision?: number, runningTotal?: string, selector?: Function, showGrandTotals?: boolean, showTotals?: boolean, showValues?: boolean, sortBy?: string, sortBySummaryField?: string, sortBySummaryPath?: Array<number | string>, sortingMethod?: Function, sortOrder?: string, summaryDisplayMode?: string, summaryType?: string, visible?: boolean, width?: number, wordWrapEnabled?: boolean }> {
        return this._getOption('fields');
    }
    set fields(value: Array<any | { allowCrossGroupCalculation?: boolean, allowExpandAll?: boolean, allowFiltering?: boolean, allowSorting?: boolean, allowSortingBySummary?: boolean, area?: string, areaIndex?: number, calculateCustomSummary?: Function, calculateSummaryValue?: Function, caption?: string, customizeText?: Function, dataField?: string, dataType?: string, displayFolder?: string, expanded?: boolean, filterType?: string, filterValues?: Array<any>, format?: format | string, groupIndex?: number, groupInterval?: number | string, groupName?: string, headerFilter?: { allowSearch?: boolean, height?: number, width?: number }, isMeasure?: boolean, precision?: number, runningTotal?: string, selector?: Function, showGrandTotals?: boolean, showTotals?: boolean, showValues?: boolean, sortBy?: string, sortBySummaryField?: string, sortBySummaryPath?: Array<number | string>, sortingMethod?: Function, sortOrder?: string, summaryDisplayMode?: string, summaryType?: string, visible?: boolean, width?: number, wordWrapEnabled?: boolean }>) {
        this._setOption('fields', value);
    }

    @Input()
    get filter(): any {
        return this._getOption('filter');
    }
    set filter(value: any) {
        this._setOption('filter', value);
    }

    @Input()
    get onChanged(): Function {
        return this._getOption('onChanged');
    }
    set onChanged(value: Function) {
        this._setOption('onChanged', value);
    }

    @Input()
    get onFieldsPrepared(): Function {
        return this._getOption('onFieldsPrepared');
    }
    set onFieldsPrepared(value: Function) {
        this._setOption('onFieldsPrepared', value);
    }

    @Input()
    get onLoadError(): Function {
        return this._getOption('onLoadError');
    }
    set onLoadError(value: Function) {
        this._setOption('onLoadError', value);
    }

    @Input()
    get onLoadingChanged(): Function {
        return this._getOption('onLoadingChanged');
    }
    set onLoadingChanged(value: Function) {
        this._setOption('onLoadingChanged', value);
    }

    @Input()
    get remoteOperations(): boolean {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: boolean) {
        this._setOption('remoteOperations', value);
    }

    @Input()
    get retrieveFields(): boolean {
        return this._getOption('retrieveFields');
    }
    set retrieveFields(value: boolean) {
        this._setOption('retrieveFields', value);
    }

    @Input()
    get store(): Store | StoreOptions | XmlaStore | XmlaStoreOptions | { type?: string } | Array<any> {
        return this._getOption('store');
    }
    set store(value: Store | StoreOptions | XmlaStore | XmlaStoreOptions | { type?: string } | Array<any>) {
        this._setOption('store', value);
    }


    protected get _optionPath() {
        return 'dataSource';
    }


    @ContentChildren(forwardRef(() => DxiPivotGridFieldComponent))
    get fieldsChildren(): QueryList<DxiPivotGridFieldComponent> {
        return this._getOption('fields');
    }
    set fieldsChildren(value) {
        this.setChildren('fields', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        if ((console) && (console.warn)) {
            console.warn('The nested \'dxo-pivot-grid-data-source\' component is deprecated in 17.2. ' +
                'Use the \'dataSource\' option instead. ' +
                'See:\nhttps://github.com/DevExpress/devextreme-angular/blob/master/CHANGELOG.md#17.2.3'
            );
        }
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
    DxoPivotGridDataSourceComponent
  ],
  exports: [
    DxoPivotGridDataSourceComponent
  ],
})
export class DxoPivotGridDataSourceModule { }
