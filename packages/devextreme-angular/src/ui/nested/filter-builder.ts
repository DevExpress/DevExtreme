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
    EventEmitter
} from '@angular/core';





import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFilterBuilderOptions } from './base/filter-builder-options';

@Component({
    selector: 'dxo-filter-builder',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoFilterBuilderComponent) => ({
                propertyName: 'filterBuilder',
                className: 'DxoFilterBuilderComponent',
                component
            }),
            deps: [DxoFilterBuilderComponent],
         }
         ],
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
export class DxoFilterBuilderComponent extends DxoFilterBuilderOptions implements OnDestroy, OnInit {

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
