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
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoButtonOptions } from './base/button-options';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
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
        'width',
        'buttonTemplate',
        'items',
        'keyExpr',
        'onItemClick',
        'onSelectionChanged',
        'selectedItemKeys',
        'selectedItems',
        'selectionMode'
    ]
})
export class DxoOptionsComponent extends DxoButtonOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemKeysChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemsChange: EventEmitter<Array<any>>;
    protected get _optionPath() {
        return 'options';
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
            { emit: 'selectedItemKeysChange' },
            { emit: 'selectedItemsChange' }
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
    DxoOptionsComponent
  ],
  exports: [
    DxoOptionsComponent
  ],
})
export class DxoOptionsModule { }
