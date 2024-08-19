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
    selector: 'dxo-options',
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
export class DxoOptionsComponent extends DxoButtonOptions implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'options';
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
    DxoOptionsComponent
  ],
  exports: [
    DxoOptionsComponent
  ],
})
export class DxoOptionsModule { }
