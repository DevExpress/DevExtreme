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




import { dxMenuItem } from 'devextreme/ui/menu';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiItemComponent extends CollectionNestedOption {
    @Input()
    get beginGroup(): boolean {
        return this._getOption('beginGroup');
    }
    set beginGroup(value: boolean) {
        this._setOption('beginGroup', value);
    }

    @Input()
    get closeMenuOnClick(): boolean {
        return this._getOption('closeMenuOnClick');
    }
    set closeMenuOnClick(value: boolean) {
        this._setOption('closeMenuOnClick', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get items(): Array<dxMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxMenuItem>) {
        this._setOption('items', value);
    }

    @Input()
    get linkAttr(): any {
        return this._getOption('linkAttr');
    }
    set linkAttr(value: any) {
        this._setOption('linkAttr', value);
    }

    @Input()
    get selectable(): boolean {
        return this._getOption('selectable');
    }
    set selectable(value: boolean) {
        this._setOption('selectable', value);
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
    get url(): string {
        return this._getOption('url');
    }
    set url(value: string) {
        this._setOption('url', value);
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


    @ContentChildren(forwardRef(() => DxiItemComponent))
    get itemsChildren(): QueryList<DxiItemComponent> {
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
    DxiItemComponent
  ],
  exports: [
    DxiItemComponent
  ],
})
export class DxiItemModule { }
