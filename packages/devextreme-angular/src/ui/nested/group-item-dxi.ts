/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { Format } from 'devextreme/common/core/localization';
import { SummaryType } from 'devextreme/common/grids';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-group-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiGroupItemComponent extends CollectionNestedOption {
    @Input()
    get alignByColumn(): boolean {
        return this._getOption('alignByColumn');
    }
    set alignByColumn(value: boolean) {
        this._setOption('alignByColumn', value);
    }

    @Input()
    get column(): string | undefined {
        return this._getOption('column');
    }
    set column(value: string | undefined) {
        this._setOption('column', value);
    }

    @Input()
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
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
    get summaryType(): SummaryType | string | undefined {
        return this._getOption('summaryType');
    }
    set summaryType(value: SummaryType | string | undefined) {
        this._setOption('summaryType', value);
    }

    @Input()
    get valueFormat(): Format | string | undefined {
        return this._getOption('valueFormat');
    }
    set valueFormat(value: Format | string | undefined) {
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
    DxiGroupItemComponent
  ],
  exports: [
    DxiGroupItemComponent
  ],
})
export class DxiGroupItemModule { }
