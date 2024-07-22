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
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFormOptions } from './base/form-options';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-form',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'accessKey',
        'activeStateEnabled',
        'alignItemLabels',
        'alignItemLabelsInAllGroups',
        'colCount',
        'colCountByScreen',
        'customizeItem',
        'disabled',
        'elementAttr',
        'focusStateEnabled',
        'formData',
        'height',
        'hint',
        'hoverStateEnabled',
        'isDirty',
        'items',
        'labelLocation',
        'labelMode',
        'minColWidth',
        'onContentReady',
        'onDisposing',
        'onEditorEnterKey',
        'onFieldDataChanged',
        'onInitialized',
        'onOptionChanged',
        'optionalMark',
        'readOnly',
        'requiredMark',
        'requiredMessage',
        'rtlEnabled',
        'screenByWidth',
        'scrollingEnabled',
        'showColonAfterLabel',
        'showOptionalMark',
        'showRequiredMark',
        'showValidationSummary',
        'tabIndex',
        'validationGroup',
        'visible',
        'width'
    ]
})
export class DxoFormComponent extends DxoFormOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() formDataChange: EventEmitter<any>;
    protected get _optionPath() {
        return 'form';
    }


    @ContentChildren(forwardRef(() => DxiItemComponent))
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'formDataChange' }
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
  declarations: [
    DxoFormComponent
  ],
  exports: [
    DxoFormComponent
  ],
})
export class DxoFormModule { }
