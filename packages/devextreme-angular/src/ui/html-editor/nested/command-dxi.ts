/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import type { AICommandNameExtended } from 'devextreme/ui/html_editor';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_commands } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-html-editor-command',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_commands,
           useExisting: DxiHtmlEditorCommandComponent,
        }
    ]
})
export class DxiHtmlEditorCommandComponent extends CollectionNestedOption {
    @Input()
    get name(): AICommandNameExtended {
        return this._getOption('name');
    }
    set name(value: AICommandNameExtended) {
        this._setOption('name', value);
    }

    @Input()
    get options(): any {
        return this._getOption('options');
    }
    set options(value: any) {
        this._setOption('options', value);
    }

    @Input()
    get prompt(): ((param: string) => string) {
        return this._getOption('prompt');
    }
    set prompt(value: ((param: string) => string)) {
        this._setOption('prompt', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }


    protected get _optionPath() {
        return 'commands';
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
    DxiHtmlEditorCommandComponent
  ],
  exports: [
    DxiHtmlEditorCommandComponent
  ],
})
export class DxiHtmlEditorCommandModule { }
