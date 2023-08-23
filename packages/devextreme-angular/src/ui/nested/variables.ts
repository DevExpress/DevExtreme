/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoHtmlEditorVariables } from './base/html-editor-variables';


@Component({
    selector: 'dxo-variables',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'dataSource',
        'escapeChar'
    ]
})
export class DxoVariablesComponent extends DxoHtmlEditorVariables implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'variables';
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
    DxoVariablesComponent
  ],
  exports: [
    DxoVariablesComponent
  ],
})
export class DxoVariablesModule { }
