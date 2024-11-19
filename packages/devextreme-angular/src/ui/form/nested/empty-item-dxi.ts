/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { FormItemType } from 'devextreme/ui/form';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-form-empty-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFormEmptyItemComponent extends CollectionNestedOption {
    @Input()
    get colSpan(): number | undefined {
        return this._getOption('colSpan');
    }
    set colSpan(value: number | undefined) {
        this._setOption('colSpan', value);
    }

    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get itemType(): FormItemType {
        return this._getOption('itemType');
    }
    set itemType(value: FormItemType) {
        this._setOption('itemType', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
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
    DxiFormEmptyItemComponent
  ],
  exports: [
    DxiFormEmptyItemComponent
  ],
})
export class DxiFormEmptyItemModule { }
