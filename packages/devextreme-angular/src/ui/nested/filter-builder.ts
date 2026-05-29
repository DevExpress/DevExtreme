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
    QueryList
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoFilterBuilderOptions } from './base/filter-builder-options';

import {
    PROPERTY_TOKEN_customOperations,
    PROPERTY_TOKEN_fields,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-filter-builder',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
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
    @ContentChildren(PROPERTY_TOKEN_customOperations)
    set _customOperationsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('customOperations', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_fields)
    set _fieldsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('fields', value);
    }
    

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<any>;
    protected get _optionPath() {
        return 'filterBuilder';
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
  imports: [
    DxoFilterBuilderComponent
  ],
  exports: [
    DxoFilterBuilderComponent
  ],
})
export class DxoFilterBuilderModule { }
