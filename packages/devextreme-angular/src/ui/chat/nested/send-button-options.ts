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




import type { SendButtonBehavior, SendButtonClickEvent } from 'devextreme/ui/chat';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chat-send-button-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoChatSendButtonOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get behavior(): SendButtonBehavior {
        return this._getOption('behavior');
    }
    set behavior(value: SendButtonBehavior) {
        this._setOption('behavior', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get onClick(): ((e: SendButtonClickEvent) => void) {
        return this._getOption('onClick');
    }
    set onClick(value: ((e: SendButtonClickEvent) => void)) {
        this._setOption('onClick', value);
    }


    protected get _optionPath() {
        return 'sendButtonOptions';
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
    DxoChatSendButtonOptionsComponent
  ],
  exports: [
    DxoChatSendButtonOptionsComponent
  ],
})
export class DxoChatSendButtonOptionsModule { }
