/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Output,
    EventEmitter,
    ContentChildren,
    QueryList,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoTextBoxOptions } from './base/text-box-options';


import {
    PROPERTY_TOKEN_buttons,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-search-editor-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
    inputs: [
        'accessKey',
        'activeStateEnabled',
        'buttons',
        'disabled',
        'elementAttr',
        'focusStateEnabled',
        'height',
        'hint',
        'hoverStateEnabled',
        'inputAttr',
        'isDirty',
        'isValid',
        'label',
        'labelMode',
        'mask',
        'maskChar',
        'maskInvalidMessage',
        'maskRules',
        'maxLength',
        'mode',
        'name',
        'onChange',
        'onContentReady',
        'onCopy',
        'onCut',
        'onDisposing',
        'onEnterKey',
        'onFocusIn',
        'onFocusOut',
        'onInitialized',
        'onInput',
        'onKeyDown',
        'onKeyUp',
        'onOptionChanged',
        'onPaste',
        'onValueChanged',
        'placeholder',
        'readOnly',
        'rtlEnabled',
        'showClearButton',
        'showMaskMode',
        'spellcheck',
        'stylingMode',
        'tabIndex',
        'text',
        'useMaskedValue',
        'validationError',
        'validationErrors',
        'validationMessageMode',
        'validationMessagePosition',
        'validationStatus',
        'value',
        'valueChangeEvent',
        'visible',
        'width'
    ]
})
export class DxoSearchEditorOptionsComponent extends DxoTextBoxOptions implements OnDestroy, OnInit {

    @ContentChildren(PROPERTY_TOKEN_buttons)
    set _buttonsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('buttons', value);
    }
    

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<string>;
    protected get _optionPath() {
        return 'searchEditorOptions';
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        this._createEventEmitters([
            { emit: 'textChange' },
            { emit: 'valueChange' }
        ]);

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
    DxoSearchEditorOptionsComponent
  ],
  exports: [
    DxoSearchEditorOptionsComponent
  ],
})
export class DxoSearchEditorOptionsModule { }
