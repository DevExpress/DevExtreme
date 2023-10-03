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




import { Mode } from 'devextreme/common';
import { dxBoxOptions } from 'devextreme/ui/box';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoBoxOptions } from './base/box-options';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-box',
    template: '',
    styles: [''],
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

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<string | any | { baseSize?: Mode | number, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }>>;
    protected get _optionPath() {
        return 'box';
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
  declarations: [
    DxoBoxComponent
  ],
  exports: [
    DxoBoxComponent
  ],
})
export class DxoBoxModule { }
