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
    QueryList
} from '@angular/core';




import type { HorizontalAlignment } from 'devextreme/common';
import type { Format } from 'devextreme/common/core/localization';
import type { SummaryType } from 'devextreme/common/grids';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_groupItems,
    PROPERTY_TOKEN_totalItems,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-summary',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoSummaryComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_groupItems)
    set _groupItemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('groupItems', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_totalItems)
    set _totalItemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('totalItems', value);
    }
    
    @Input()
    get calculateCustomSummary(): Function {
        return this._getOption('calculateCustomSummary');
    }
    set calculateCustomSummary(value: Function) {
        this._setOption('calculateCustomSummary', value);
    }

    @Input()
    get groupItems(): Array<any | { alignByColumn?: boolean, column?: string | undefined, customizeText?: Function, displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: SummaryType | string | undefined, valueFormat?: Format | string | undefined }> {
        return this._getOption('groupItems');
    }
    set groupItems(value: Array<any | { alignByColumn?: boolean, column?: string | undefined, customizeText?: Function, displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: SummaryType | string | undefined, valueFormat?: Format | string | undefined }>) {
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
    get totalItems(): Array<any | { alignment?: HorizontalAlignment | undefined, column?: string | undefined, cssClass?: string | undefined, customizeText?: Function, displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, skipEmptyValues?: boolean, summaryType?: SummaryType | string | undefined, valueFormat?: Format | string | undefined }> {
        return this._getOption('totalItems');
    }
    set totalItems(value: Array<any | { alignment?: HorizontalAlignment | undefined, column?: string | undefined, cssClass?: string | undefined, customizeText?: Function, displayFormat?: string | undefined, name?: string | undefined, showInColumn?: string | undefined, skipEmptyValues?: boolean, summaryType?: SummaryType | string | undefined, valueFormat?: Format | string | undefined }>) {
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
  imports: [
    DxoSummaryComponent
  ],
  exports: [
    DxoSummaryComponent
  ],
})
export class DxoSummaryModule { }
