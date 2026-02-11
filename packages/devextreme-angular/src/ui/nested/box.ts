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




import type { Properties as dxBoxOptions } from 'devextreme/ui/box';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoBoxOptions } from './base/box-options';

import {
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-box',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'align',
        'crossAlign',
        'dataSource',
        'direction',
        'disabled',
        'elementAttr',
        'height',
        'hoverStateEnabled',
        'itemHoldTimeout',
        'items',
        'itemTemplate',
        'onContentReady',
        'onDisposing',
        'onInitialized',
        'onItemClick',
        'onItemContextMenu',
        'onItemHold',
        'onItemRendered',
        'onOptionChanged',
        'rtlEnabled',
        'visible',
        'width'
    ]
})
export class DxoBoxComponent extends DxoBoxOptions implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<string | any | { baseSize?: number | string, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }>>;
    protected get _optionPath() {
        return 'box';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        this._createEventEmitters([
            { emit: 'itemsChange' }
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
    DxoBoxComponent
  ],
  exports: [
    DxoBoxComponent
  ],
})
export class DxoBoxModule { }
