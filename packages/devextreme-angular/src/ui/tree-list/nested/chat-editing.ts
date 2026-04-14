/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import type { default as dxChat, Message } from 'devextreme/ui/chat';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-list-chat-editing',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoTreeListChatEditingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDeleting(): boolean | ((options: { component: dxChat, message: Message }) => boolean) {
        return this._getOption('allowDeleting');
    }
    set allowDeleting(value: boolean | ((options: { component: dxChat, message: Message }) => boolean)) {
        this._setOption('allowDeleting', value);
    }

    @Input()
    get allowUpdating(): boolean | ((options: { component: dxChat, message: Message }) => boolean) {
        return this._getOption('allowUpdating');
    }
    set allowUpdating(value: boolean | ((options: { component: dxChat, message: Message }) => boolean)) {
        this._setOption('allowUpdating', value);
    }


    protected get _optionPath() {
        return 'editing';
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
    DxoTreeListChatEditingComponent
  ],
  exports: [
    DxoTreeListChatEditingComponent
  ],
})
export class DxoTreeListChatEditingModule { }
