/* tslint:disable:max-line-length */
import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';
import type { ToolCallStatus } from 'devextreme/ui/chat';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_toolCalls } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-chat-tool-call',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_toolCalls,
           useExisting: DxiChatToolCallComponent,
        }
    ]
})
export class DxiChatToolCallComponent extends CollectionNestedOption {
    @Input()
    get arguments(): Record<string, any> {
        return this._getOption('arguments');
    }
    set arguments(value: Record<string, any>) {
        this._setOption('arguments', value);
    }

    @Input()
    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get result(): object | string {
        return this._getOption('result');
    }
    set result(value: object | string) {
        this._setOption('result', value);
    }

    @Input()
    get status(): ToolCallStatus {
        return this._getOption('status');
    }
    set status(value: ToolCallStatus) {
        this._setOption('status', value);
    }


    protected get _optionPath() {
        return 'toolCalls';
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
  imports: [
    DxiChatToolCallComponent
  ],
  exports: [
    DxiChatToolCallComponent
  ],
})
export class DxiChatToolCallModule { }
