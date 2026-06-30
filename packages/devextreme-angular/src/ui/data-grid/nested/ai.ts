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
import type { dxTextBoxOptions } from 'devextreme/ui/text_box';
import type { AIColumnMode } from 'devextreme/common/grids';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-ai',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoDataGridAIComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get aiIntegration(): AIIntegration | undefined {
        return this._getOption('aiIntegration');
    }
    set aiIntegration(value: AIIntegration | undefined) {
        this._setOption('aiIntegration', value);
    }

    @Input()
    get editorOptions(): dxTextBoxOptions<any> {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: dxTextBoxOptions<any>) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get emptyText(): string {
        return this._getOption('emptyText');
    }
    set emptyText(value: string) {
        this._setOption('emptyText', value);
    }

    @Input()
    get mode(): AIColumnMode {
        return this._getOption('mode');
    }
    set mode(value: AIColumnMode) {
        this._setOption('mode', value);
    }

    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }

    @Input()
    get popup(): Record<string, any> {
        return this._getOption('popup');
    }
    set popup(value: Record<string, any>) {
        this._setOption('popup', value);
    }

    @Input()
    get prompt(): string {
        return this._getOption('prompt');
    }
    set prompt(value: string) {
        this._setOption('prompt', value);
    }

    @Input()
    get showHeaderMenu(): boolean {
        return this._getOption('showHeaderMenu');
    }
    set showHeaderMenu(value: boolean) {
        this._setOption('showHeaderMenu', value);
    }


    protected get _optionPath() {
        return 'ai';
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
    DxoDataGridAIComponent
  ],
  exports: [
    DxoDataGridAIComponent
  ],
})
export class DxoDataGridAIModule { }
