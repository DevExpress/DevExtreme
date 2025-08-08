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




import { Properties as dxBoxOptions } from 'devextreme/ui/box';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoBoxOptions } from './base/box-options';

@Component({
    selector: 'dxo-box',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoBoxComponent) => ({
                propertyName: 'box',
                className: 'DxoBoxComponent',
                component
            }),
            deps: [DxoBoxComponent],
         }
         ],
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
export class DxoBoxComponent extends DxoBoxOptions implements OnDestroy, OnInit {

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
