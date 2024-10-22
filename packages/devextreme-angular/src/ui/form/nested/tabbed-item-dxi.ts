/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { dxTabPanelOptions } from 'devextreme/ui/tab_panel';
import { dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from 'devextreme/ui/form';
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-form-tabbed-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFormTabbedItemComponent extends CollectionNestedOption {
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
    get tabPanelOptions(): dxTabPanelOptions {
        return this._getOption('tabPanelOptions');
    }
    set tabPanelOptions(value: dxTabPanelOptions) {
        this._setOption('tabPanelOptions', value);
    }

    @Input()
    get tabs(): Array<Record<string, any>> | { alignItemLabels?: boolean, badge?: string, colCount?: number, colCountByScreen?: Record<string, any>, disabled?: boolean, icon?: string, items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>, tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template, template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template, title?: string }[] {
        return this._getOption('tabs');
    }
    set tabs(value: Array<Record<string, any>> | { alignItemLabels?: boolean, badge?: string, colCount?: number, colCountByScreen?: Record<string, any>, disabled?: boolean, icon?: string, items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>, tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template, template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template, title?: string }[]) {
        this._setOption('tabs', value);
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
    DxiFormTabbedItemComponent
  ],
  exports: [
    DxiFormTabbedItemComponent
  ],
})
export class DxiFormTabbedItemModule { }
