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




import { Properties as dxSplitterOptions } from 'devextreme/ui/splitter';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoSplitterOptions } from './base/splitter-options';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-splitter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'allowKeyboardNavigation',
        'dataSource',
        'disabled',
        'elementAttr',
        'height',
        'hoverStateEnabled',
        'items',
        'itemTemplate',
        'onContentReady',
        'onDisposing',
        'onInitialized',
        'onItemClick',
        'onItemCollapsed',
        'onItemContextMenu',
        'onItemExpanded',
        'onItemRendered',
        'onOptionChanged',
        'onResize',
        'onResizeEnd',
        'onResizeStart',
        'orientation',
        'rtlEnabled',
        'separatorSize',
        'visible',
        'width'
    ]
})
export class DxoSplitterComponent extends DxoSplitterOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<any | { collapsed?: boolean, collapsedSize?: number | string | undefined, collapsible?: boolean, maxSize?: number | string | undefined, minSize?: number | string | undefined, resizable?: boolean, size?: number | string | undefined, splitter?: dxSplitterOptions | undefined, template?: any, text?: string, visible?: boolean }>>;
    protected get _optionPath() {
        return 'splitter';
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
    DxoSplitterComponent
  ],
  exports: [
    DxoSplitterComponent
  ],
})
export class DxoSplitterModule { }
