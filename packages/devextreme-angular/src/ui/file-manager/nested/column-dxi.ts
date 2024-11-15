/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { HorizontalAlignment, DataType, SortOrder } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-file-manager-column',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFileManagerColumnComponent extends CollectionNestedOption {
    @Input()
    get alignment(): HorizontalAlignment | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | undefined) {
        this._setOption('alignment', value);
    }

    @Input()
    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    @Input()
    get dataType(): DataType | undefined {
        return this._getOption('dataType');
    }
    set dataType(value: DataType | undefined) {
        this._setOption('dataType', value);
    }

    @Input()
    get hidingPriority(): number | undefined {
        return this._getOption('hidingPriority');
    }
    set hidingPriority(value: number | undefined) {
        this._setOption('hidingPriority', value);
    }

    @Input()
    get sortIndex(): number | undefined {
        return this._getOption('sortIndex');
    }
    set sortIndex(value: number | undefined) {
        this._setOption('sortIndex', value);
    }

    @Input()
    get sortOrder(): SortOrder | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | undefined) {
        this._setOption('sortOrder', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }

    @Input()
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'columns';
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
    DxiFileManagerColumnComponent
  ],
  exports: [
    DxiFileManagerColumnComponent
  ],
})
export class DxiFileManagerColumnModule { }
