/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { dxTreeViewItem } from 'devextreme/ui/tree_view';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-item-tree-view',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiItemTreeViewComponent extends CollectionNestedOption {
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    @Input()
    get hasItems(): boolean | undefined {
        return this._getOption('hasItems');
    }
    set hasItems(value: boolean | undefined) {
        this._setOption('hasItems', value);
    }

    @Input()
    get html(): string {
        return this._getOption('html');
    }
    set html(value: string) {
        this._setOption('html', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get id(): number | string | undefined {
        return this._getOption('id');
    }
    set id(value: number | string | undefined) {
        this._setOption('id', value);
    }

    @Input()
    get items(): Array<dxTreeViewItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxTreeViewItem>) {
        this._setOption('items', value);
    }

    @Input()
    get parentId(): number | string | undefined {
        return this._getOption('parentId');
    }
    set parentId(value: number | string | undefined) {
        this._setOption('parentId', value);
    }

    @Input()
    get selected(): boolean {
        return this._getOption('selected');
    }
    set selected(value: boolean) {
        this._setOption('selected', value);
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
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'items';
    }


    @ContentChildren(forwardRef(() => DxiItemTreeViewComponent))
    get itemsChildren(): QueryList<DxiItemTreeViewComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
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
    DxiItemTreeViewComponent
  ],
  exports: [
    DxiItemTreeViewComponent
  ],
})
export class DxiItemTreeViewModule { }
