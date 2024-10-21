/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { dxButtonOptions } from 'devextreme/ui/button';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-form-button-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFormButtonItemComponent extends CollectionNestedOption {
    @Input()
    get buttonOptions(): dxButtonOptions {
        return this._getOption('buttonOptions');
    }
    set buttonOptions(value: dxButtonOptions) {
        this._setOption('buttonOptions', value);
    }

    @Input()
    get colSpan(): number {
        return this._getOption('colSpan');
    }
    set colSpan(value: number) {
        this._setOption('colSpan', value);
    }

    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get horizontalAlignment(): "center" | "left" | "right" {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: "center" | "left" | "right") {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get itemType(): "empty" | "group" | "simple" | "tabbed" | "button" {
        return this._getOption('itemType');
    }
    set itemType(value: "empty" | "group" | "simple" | "tabbed" | "button") {
        this._setOption('itemType', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get verticalAlignment(): "bottom" | "center" | "top" {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: "bottom" | "center" | "top") {
        this._setOption('verticalAlignment', value);
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


    protected get _optionPath() {
        return 'items';
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
    DxiFormButtonItemComponent
  ],
  exports: [
    DxiFormButtonItemComponent
  ],
})
export class DxiFormButtonItemModule { }
