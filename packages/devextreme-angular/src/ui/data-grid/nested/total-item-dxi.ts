/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { HorizontalAlignment } from 'devextreme/common';
import { SummaryType } from 'devextreme/common/grids';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-total-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDataGridTotalItemComponent extends CollectionNestedOption {
    @Input()
    get alignment(): HorizontalAlignment | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | undefined) {
        this._setOption('alignment', value);
    }

    @Input()
    get column(): string | undefined {
        return this._getOption('column');
    }
    set column(value: string | undefined) {
        this._setOption('column', value);
    }

    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get customizeText(): ((itemInfo: { value: string | number | Date, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((itemInfo: { value: string | number | Date, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get displayFormat(): string | undefined {
        return this._getOption('displayFormat');
    }
    set displayFormat(value: string | undefined) {
        this._setOption('displayFormat', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get showInColumn(): string | undefined {
        return this._getOption('showInColumn');
    }
    set showInColumn(value: string | undefined) {
        this._setOption('showInColumn', value);
    }

    @Input()
    get skipEmptyValues(): boolean {
        return this._getOption('skipEmptyValues');
    }
    set skipEmptyValues(value: boolean) {
        this._setOption('skipEmptyValues', value);
    }

    @Input()
    get summaryType(): string | SummaryType | undefined {
        return this._getOption('summaryType');
    }
    set summaryType(value: string | SummaryType | undefined) {
        this._setOption('summaryType', value);
    }

    @Input()
    get valueFormat(): Format | undefined {
        return this._getOption('valueFormat');
    }
    set valueFormat(value: Format | undefined) {
        this._setOption('valueFormat', value);
    }


    protected get _optionPath() {
        return 'totalItems';
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
    DxiDataGridTotalItemComponent
  ],
  exports: [
    DxiDataGridTotalItemComponent
  ],
})
export class DxiDataGridTotalItemModule { }
