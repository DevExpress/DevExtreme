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
import { DxoTabPanelOptions } from './base/tab-panel-options';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-tab-panel-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'accessKey',
        'activeStateEnabled',
        'animationEnabled',
        'dataSource',
        'deferRendering',
        'disabled',
        'elementAttr',
        'focusStateEnabled',
        'height',
        'hint',
        'hoverStateEnabled',
        'iconPosition',
        'itemHoldTimeout',
        'items',
        'itemTemplate',
        'itemTitleTemplate',
        'loop',
        'noDataText',
        'onContentReady',
        'onDisposing',
        'onInitialized',
        'onItemClick',
        'onItemContextMenu',
        'onItemHold',
        'onItemRendered',
        'onOptionChanged',
        'onSelectionChanged',
        'onSelectionChanging',
        'onTitleClick',
        'onTitleHold',
        'onTitleRendered',
        'repaintChangesOnly',
        'rtlEnabled',
        'scrollByContent',
        'scrollingEnabled',
        'selectedIndex',
        'selectedItem',
        'showNavButtons',
        'stylingMode',
        'swipeEnabled',
        'tabIndex',
        'tabsPosition',
        'visible',
        'width'
    ]
})
export class DxoTabPanelOptionsComponent extends DxoTabPanelOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<string | any | { badge?: string, disabled?: boolean, html?: string, icon?: string, tabTemplate?: any, template?: any, text?: string, title?: string, visible?: boolean }>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemChange: EventEmitter<any>;
    protected get _optionPath() {
        return 'tabPanelOptions';
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
            { emit: 'itemsChange' },
            { emit: 'selectedIndexChange' },
            { emit: 'selectedItemChange' }
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
    DxoTabPanelOptionsComponent
  ],
  exports: [
    DxoTabPanelOptionsComponent
  ],
})
export class DxoTabPanelOptionsModule { }
