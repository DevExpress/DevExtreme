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
    forwardRef,
    QueryList
} from '@angular/core';




import { UserDefinedElement } from 'devextreme/core/element';
import { dxHtmlEditorToolbarItem, HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiItemHtmlEditorComponent } from './item-dxi';


@Component({
    selector: 'dxo-toolbar-html-editor',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoToolbarHtmlEditorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get container(): UserDefinedElement | string {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string) {
        this._setOption('container', value);
    }

    @Input()
    get items(): Array<dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem>) {
        this._setOption('items', value);
    }

    @Input()
    get multiline(): boolean {
        return this._getOption('multiline');
    }
    set multiline(value: boolean) {
        this._setOption('multiline', value);
    }


    protected get _optionPath() {
        return 'toolbar';
    }


    @ContentChildren(forwardRef(() => DxiItemHtmlEditorComponent))
    get itemsChildren(): QueryList<DxiItemHtmlEditorComponent> {
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


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoToolbarHtmlEditorComponent
  ],
  exports: [
    DxoToolbarHtmlEditorComponent
  ],
})
export class DxoToolbarHtmlEditorModule { }
