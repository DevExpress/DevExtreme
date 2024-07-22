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
import { DxoFilterBuilderOptions } from './base/filter-builder-options';
import { DxiCustomOperationComponent } from './custom-operation-dxi';
import { DxiFieldComponent } from './field-dxi';


@Component({
    selector: 'dxo-filter-builder',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'accessKey',
        'activeStateEnabled',
        'allowHierarchicalFields',
        'customOperations',
        'disabled',
        'elementAttr',
        'fields',
        'filterOperationDescriptions',
        'focusStateEnabled',
        'groupOperationDescriptions',
        'groupOperations',
        'height',
        'hint',
        'hoverStateEnabled',
        'maxGroupLevel',
        'onContentReady',
        'onDisposing',
        'onEditorPrepared',
        'onEditorPreparing',
        'onInitialized',
        'onOptionChanged',
        'onValueChanged',
        'rtlEnabled',
        'tabIndex',
        'value',
        'visible',
        'width'
    ]
})
export class DxoFilterBuilderComponent extends DxoFilterBuilderOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<any>;
    protected get _optionPath() {
        return 'filterBuilder';
    }


    @ContentChildren(forwardRef(() => DxiCustomOperationComponent))
    get customOperationsChildren(): QueryList<DxiCustomOperationComponent> {
        return this._getOption('customOperations');
    }
    set customOperationsChildren(value) {
        this.setChildren('customOperations', value);
    }

    @ContentChildren(forwardRef(() => DxiFieldComponent))
    get fieldsChildren(): QueryList<DxiFieldComponent> {
        return this._getOption('fields');
    }
    set fieldsChildren(value) {
        this.setChildren('fields', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
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
  declarations: [
    DxoFilterBuilderComponent
  ],
  exports: [
    DxoFilterBuilderComponent
  ],
})
export class DxoFilterBuilderModule { }
