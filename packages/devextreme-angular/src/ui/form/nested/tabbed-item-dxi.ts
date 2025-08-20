/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';




import { FormItemType, dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from 'devextreme/ui/form';
import { dxTabPanelOptions } from 'devextreme/ui/tab_panel';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_items } from 'devextreme-angular/core/tokens';
import {
    PROPERTY_TOKEN_tabs,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-form-tabbed-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_items,
           useExisting: DxiFormTabbedItemComponent,
        }
    ]
})
export class DxiFormTabbedItemComponent extends CollectionNestedOption {

    @ContentChildren(PROPERTY_TOKEN_tabs)
    set _tabsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('tabs', value);
    }
    
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
    get tabPanelOptions(): dxTabPanelOptions | undefined {
        return this._getOption('tabPanelOptions');
    }
    set tabPanelOptions(value: dxTabPanelOptions | undefined) {
        this._setOption('tabPanelOptions', value);
    }

    @Input()
    get tabs(): { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>, tabTemplate?: any, template?: any, title?: string | undefined }[] {
        return this._getOption('tabs');
    }
    set tabs(value: { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>, tabTemplate?: any, template?: any, title?: string | undefined }[]) {
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
        this.itemType = 'tabbed';
    
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiFormTabbedItemComponent
  ],
  exports: [
    DxiFormTabbedItemComponent
  ],
})
export class DxiFormTabbedItemModule { }
