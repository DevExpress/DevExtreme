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




import type { AIIntegration } from 'devextreme/common/ai-integration';
import type { CommandInfo, ResponseStatusTexts, ResponseStatus } from 'devextreme/common/grids';
import type { dxPopupOptions } from 'devextreme/ui/popup';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-ai-assistant',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoDataGridAIAssistantComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get aiIntegration(): AIIntegration {
        return this._getOption('aiIntegration');
    }
    set aiIntegration(value: AIIntegration) {
        this._setOption('aiIntegration', value);
    }

    @Input()
    get chat(): Record<string, any> {
        return this._getOption('chat');
    }
    set chat(value: Record<string, any>) {
        this._setOption('chat', value);
    }

    @Input()
    get customizeResponseText(): ((command: CommandInfo) => ResponseStatusTexts) {
        return this._getOption('customizeResponseText');
    }
    set customizeResponseText(value: ((command: CommandInfo) => ResponseStatusTexts)) {
        this._setOption('customizeResponseText', value);
    }

    @Input()
    get customizeResponseTitle(): ((status: ResponseStatus, commandNames: Array<string>) => string) {
        return this._getOption('customizeResponseTitle');
    }
    set customizeResponseTitle(value: ((status: ResponseStatus, commandNames: Array<string>) => string)) {
        this._setOption('customizeResponseTitle', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get popup(): dxPopupOptions<any> {
        return this._getOption('popup');
    }
    set popup(value: dxPopupOptions<any>) {
        this._setOption('popup', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }


    protected get _optionPath() {
        return 'aiAssistant';
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
    DxoDataGridAIAssistantComponent
  ],
  exports: [
    DxoDataGridAIAssistantComponent
  ],
})
export class DxoDataGridAIAssistantModule { }
