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

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-chat-tool-call-options',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoChatToolCallOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get expandAll(): boolean {
        return this._getOption('expandAll');
    }
    set expandAll(value: boolean) {
        this._setOption('expandAll', value);
    }

    @Input()
    get showInMessageTemplate(): boolean {
        return this._getOption('showInMessageTemplate');
    }
    set showInMessageTemplate(value: boolean) {
        this._setOption('showInMessageTemplate', value);
    }


    protected get _optionPath() {
        return 'toolCallOptions';
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
    DxoChatToolCallOptionsComponent
  ],
  exports: [
    DxoChatToolCallOptionsComponent
  ],
})
export class DxoChatToolCallOptionsModule { }
