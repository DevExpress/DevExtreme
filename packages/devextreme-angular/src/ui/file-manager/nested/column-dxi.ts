/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





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
    get alignment(): "center" | "left" | "right" {
        return this._getOption('alignment');
    }
    set alignment(value: "center" | "left" | "right") {
        this._setOption('alignment', value);
    }

    @Input()
    get caption(): string {
        return this._getOption('caption');
    }
    set caption(value: string) {
        this._setOption('caption', value);
    }

    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get dataField(): string {
        return this._getOption('dataField');
    }
    set dataField(value: string) {
        this._setOption('dataField', value);
    }

    @Input()
    get dataType(): "string" | "number" | "date" | "boolean" | "object" | "datetime" {
        return this._getOption('dataType');
    }
    set dataType(value: "string" | "number" | "date" | "boolean" | "object" | "datetime") {
        this._setOption('dataType', value);
    }

    @Input()
    get hidingPriority(): number {
        return this._getOption('hidingPriority');
    }
    set hidingPriority(value: number) {
        this._setOption('hidingPriority', value);
    }

    @Input()
    get sortIndex(): number {
        return this._getOption('sortIndex');
    }
    set sortIndex(value: number) {
        this._setOption('sortIndex', value);
    }

    @Input()
    get sortOrder(): "asc" | "desc" {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: "asc" | "desc") {
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
    get visibleIndex(): number {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number) {
        this._setOption('visibleIndex', value);
    }

    @Input()
    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
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
