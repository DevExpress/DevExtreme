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
    QueryList,
} from '@angular/core';




import { PositionAlignment } from 'devextreme/common';
import { PositionConfig } from 'devextreme/common/core/animation';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoPopupOptions } from './base/popup-options';


import {
    PROPERTY_TOKEN_toolbarItems,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-popup',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
    inputs: [
        'accessKey',
        'animation',
        'container',
        'contentTemplate',
        'deferRendering',
        'disabled',
        'dragAndResizeArea',
        'dragEnabled',
        'dragOutsideBoundary',
        'enableBodyScroll',
        'focusStateEnabled',
        'fullScreen',
        'height',
        'hideOnOutsideClick',
        'hideOnParentScroll',
        'hint',
        'hoverStateEnabled',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'onContentReady',
        'onDisposing',
        'onHidden',
        'onHiding',
        'onInitialized',
        'onOptionChanged',
        'onResize',
        'onResizeEnd',
        'onResizeStart',
        'onShowing',
        'onShown',
        'onTitleRendered',
        'position',
        'resizeEnabled',
        'restorePosition',
        'rtlEnabled',
        'shading',
        'shadingColor',
        'showCloseButton',
        'showTitle',
        'tabIndex',
        'title',
        'titleTemplate',
        'toolbarItems',
        'visible',
        'width',
        'wrapperAttr'
    ]
})
export class DxoPopupComponent extends DxoPopupOptions implements OnDestroy, OnInit {

    @ContentChildren(PROPERTY_TOKEN_toolbarItems)
    set _toolbarItemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('toolbarItems', value);
    }
    

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<PositionAlignment | PositionConfig | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | string>;
    protected get _optionPath() {
        return 'popup';
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        this._createEventEmitters([
            { emit: 'heightChange' },
            { emit: 'positionChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
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
    DxoPopupComponent
  ],
  exports: [
    DxoPopupComponent
  ],
})
export class DxoPopupModule { }
