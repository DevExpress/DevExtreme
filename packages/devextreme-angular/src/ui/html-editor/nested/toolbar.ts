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
    QueryList,
} from '@angular/core';




import { AIToolbarItem, dxHtmlEditorToolbarItem, HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


import {
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-html-editor-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
})
export class DxoHtmlEditorToolbarComponent extends NestedOption implements OnDestroy, OnInit {

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    
    @Input()
    get container(): any | string {
        return this._getOption('container');
    }
    set container(value: any | string) {
        this._setOption('container', value);
    }

    @Input()
    get items(): Array<AIToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<AIToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem>) {
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
  imports: [
    DxoHtmlEditorToolbarComponent
  ],
  exports: [
    DxoHtmlEditorToolbarComponent
  ],
})
export class DxoHtmlEditorToolbarModule { }
