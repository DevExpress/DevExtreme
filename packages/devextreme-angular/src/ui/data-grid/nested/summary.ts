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




import dxDataGrid from 'devextreme/ui/data_grid';
import { SummaryType } from 'devextreme/common/grids';
import { Format } from 'devextreme/common/core/localization';
import { HorizontalAlignment } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiDataGridGroupItemComponent } from './group-item-dxi';
import { DxiDataGridTotalItemComponent } from './total-item-dxi';


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
    get groupItems(): { alignByColumn?: boolean, column?: string | undefined, customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: string | SummaryType | undefined, valueFormat?: Format | undefined }[] {
        return this._getOption('groupItems');
    }
    set groupItems(value: { alignByColumn?: boolean, column?: string | undefined, customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: string | SummaryType | undefined, valueFormat?: Format | undefined }[]) {
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
    get texts(): { avg?: string, avgOtherColumn?: string, count?: string, max?: string, maxOtherColumn?: string, min?: string, minOtherColumn?: string, sum?: string, sumOtherColumn?: string } {
        return this._getOption('texts');
    }
    set texts(value: { avg?: string, avgOtherColumn?: string, count?: string, max?: string, maxOtherColumn?: string, min?: string, minOtherColumn?: string, sum?: string, sumOtherColumn?: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get totalItems(): { alignment?: HorizontalAlignment | undefined, column?: string | undefined, cssClass?: string | undefined, customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, skipEmptyValues?: boolean, summaryType?: string | SummaryType | undefined, valueFormat?: Format | undefined }[] {
        return this._getOption('totalItems');
    }
    set totalItems(value: { alignment?: HorizontalAlignment | undefined, column?: string | undefined, cssClass?: string | undefined, customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string), displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, skipEmptyValues?: boolean, summaryType?: string | SummaryType | undefined, valueFormat?: Format | undefined }[]) {
        this._setOption('totalItems', value);
    }


    protected get _optionPath() {
        return 'summary';
    }


    @ContentChildren(forwardRef(() => DxiDataGridGroupItemComponent))
    get groupItemsChildren(): QueryList<DxiDataGridGroupItemComponent> {
        return this._getOption('groupItems');
    }
    set groupItemsChildren(value) {
        this.setChildren('groupItems', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridTotalItemComponent))
    get totalItemsChildren(): QueryList<DxiDataGridTotalItemComponent> {
        return this._getOption('totalItems');
    }
    set totalItemsChildren(value) {
        this.setChildren('totalItems', value);
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
