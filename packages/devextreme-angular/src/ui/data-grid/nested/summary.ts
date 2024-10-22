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




import dxDataGrid from 'devextreme/ui/data_grid';
import * as LocalizationTypes from 'devextreme/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-summary',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridSummaryComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get calculateCustomSummary(): ((options: { component: dxDataGrid, groupIndex: number, name: string, summaryProcess: string, totalValue: any, value: any }) => void) {
        return this._getOption('calculateCustomSummary');
    }
    set calculateCustomSummary(value: ((options: { component: dxDataGrid, groupIndex: number, name: string, summaryProcess: string, totalValue: any, value: any }) => void)) {
        this._setOption('calculateCustomSummary', value);
    }

    @Input()
    get groupItems(): Array<Record<string, any>> | { alignByColumn: boolean, column: string, customizeText: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat: string, name: string, showInColumn: string, showInGroupFooter: boolean, skipEmptyValues: boolean, summaryType: "avg" | "count" | "custom" | "max" | "min" | "sum", valueFormat: LocalizationTypes.Format }[] {
        return this._getOption('groupItems');
    }
    set groupItems(value: Array<Record<string, any>> | { alignByColumn: boolean, column: string, customizeText: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat: string, name: string, showInColumn: string, showInGroupFooter: boolean, skipEmptyValues: boolean, summaryType: "avg" | "count" | "custom" | "max" | "min" | "sum", valueFormat: LocalizationTypes.Format }[]) {
        this._setOption('groupItems', value);
    }

    @Input()
    get recalculateWhileEditing(): boolean {
        return this._getOption('recalculateWhileEditing');
    }
    set recalculateWhileEditing(value: boolean) {
        this._setOption('recalculateWhileEditing', value);
    }

    @Input()
    get skipEmptyValues(): boolean {
        return this._getOption('skipEmptyValues');
    }
    set skipEmptyValues(value: boolean) {
        this._setOption('skipEmptyValues', value);
    }

    @Input()
    get texts(): Record<string, any> | { avg: string, avgOtherColumn: string, count: string, max: string, maxOtherColumn: string, min: string, minOtherColumn: string, sum: string, sumOtherColumn: string } {
        return this._getOption('texts');
    }
    set texts(value: Record<string, any> | { avg: string, avgOtherColumn: string, count: string, max: string, maxOtherColumn: string, min: string, minOtherColumn: string, sum: string, sumOtherColumn: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get totalItems(): Array<Record<string, any>> | { alignment: "center" | "left" | "right", column: string, cssClass: string, customizeText: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat: string, name: string, showInColumn: string, skipEmptyValues: boolean, summaryType: "avg" | "count" | "custom" | "max" | "min" | "sum", valueFormat: LocalizationTypes.Format }[] {
        return this._getOption('totalItems');
    }
    set totalItems(value: Array<Record<string, any>> | { alignment: "center" | "left" | "right", column: string, cssClass: string, customizeText: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat: string, name: string, showInColumn: string, skipEmptyValues: boolean, summaryType: "avg" | "count" | "custom" | "max" | "min" | "sum", valueFormat: LocalizationTypes.Format }[]) {
        this._setOption('totalItems', value);
    }


    protected get _optionPath() {
        return 'summary';
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
    DxoDataGridSummaryComponent
  ],
  exports: [
    DxoDataGridSummaryComponent
  ],
})
export class DxoDataGridSummaryModule { }
