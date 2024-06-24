/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { ColumnButtonClickEvent, DataGridPredefinedColumnButton } from 'devextreme/ui/data_grid';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-button',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiButtonComponent extends CollectionNestedOption {
    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get disabled(): boolean | Function {
        return this._getOption('disabled');
    }
    set disabled(value: boolean | Function) {
        this._setOption('disabled', value);
    }

    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get name(): DataGridPredefinedColumnButton | string {
        return this._getOption('name');
    }
    set name(value: DataGridPredefinedColumnButton | string) {
        this._setOption('name', value);
    }

    @Input()
    get onClick(): ((e: ColumnButtonClickEvent) => void) {
        return this._getOption('onClick');
    }
    set onClick(value: ((e: ColumnButtonClickEvent) => void)) {
        this._setOption('onClick', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get visible(): boolean | Function {
        return this._getOption('visible');
    }
    set visible(value: boolean | Function) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'buttons';
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
    DxiButtonComponent
  ],
  exports: [
    DxiButtonComponent
  ],
})
export class DxiButtonModule { }
