/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import * as LocalizationTypes from 'devextreme/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-group-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDataGridGroupItemComponent extends CollectionNestedOption {
    @Input()
    get alignByColumn(): boolean {
        return this._getOption('alignByColumn');
    }
    set alignByColumn(value: boolean) {
        this._setOption('alignByColumn', value);
    }

    @Input()
    get column(): string {
        return this._getOption('column');
    }
    set column(value: string) {
        this._setOption('column', value);
    }

    @Input()
    get customizeText(): ((itemInfo: { value: string | number | Date, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((itemInfo: { value: string | number | Date, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get displayFormat(): string {
        return this._getOption('displayFormat');
    }
    set displayFormat(value: string) {
        this._setOption('displayFormat', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get showInColumn(): string {
        return this._getOption('showInColumn');
    }
    set showInColumn(value: string) {
        this._setOption('showInColumn', value);
    }

    @Input()
    get showInGroupFooter(): boolean {
        return this._getOption('showInGroupFooter');
    }
    set showInGroupFooter(value: boolean) {
        this._setOption('showInGroupFooter', value);
    }

    @Input()
    get skipEmptyValues(): boolean {
        return this._getOption('skipEmptyValues');
    }
    set skipEmptyValues(value: boolean) {
        this._setOption('skipEmptyValues', value);
    }

    @Input()
    get summaryType(): "avg" | "count" | "custom" | "max" | "min" | "sum" {
        return this._getOption('summaryType');
    }
    set summaryType(value: "avg" | "count" | "custom" | "max" | "min" | "sum") {
        this._setOption('summaryType', value);
    }

    @Input()
    get valueFormat(): LocalizationTypes.Format {
        return this._getOption('valueFormat');
    }
    set valueFormat(value: LocalizationTypes.Format) {
        this._setOption('valueFormat', value);
    }


    protected get _optionPath() {
        return 'groupItems';
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
    DxiDataGridGroupItemComponent
  ],
  exports: [
    DxiDataGridGroupItemComponent
  ],
})
export class DxiDataGridGroupItemModule { }
