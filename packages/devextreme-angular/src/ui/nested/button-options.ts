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
import { DxoButtonOptions } from './base/button-options';


@Component({
    selector: 'dxo-button-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'accessKey',
        'activeStateEnabled',
        'disabled',
        'elementAttr',
        'focusStateEnabled',
        'height',
        'hint',
        'hoverStateEnabled',
        'icon',
        'onClick',
        'onContentReady',
        'onDisposing',
        'onInitialized',
        'onOptionChanged',
        'rtlEnabled',
        'stylingMode',
        'tabIndex',
        'template',
        'text',
        'type',
        'useSubmitBehavior',
        'validationGroup',
        'visible',
        'width'
    ]
})
export class DxoButtonOptionsComponent extends DxoButtonOptions implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'buttonOptions';
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
    DxoButtonOptionsComponent
  ],
  exports: [
    DxoButtonOptionsComponent
  ],
})
export class DxoButtonOptionsModule { }
