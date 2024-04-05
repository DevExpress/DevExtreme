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




import DevExpress from 'devextreme/bundles/dx.all';
import { PositionAlignment } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoPopupOptions } from './base/popup-options';
import { DxiToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-drop-down-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'accessKey',
        'animation',
        'closeOnOutsideClick',
        'container',
        'contentTemplate',
        'copyRootClassesToWrapper',
        'deferRendering',
        'disabled',
        'dragAndResizeArea',
        'dragEnabled',
        'dragOutsideBoundary',
        'elementAttr',
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
        'wrapperAttr',
        'hideEvent',
        'showEvent',
        'target'
    ]
})
export class DxoDropDownOptionsComponent extends DxoPopupOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<PositionAlignment | DevExpress.PositionConfig | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string>;
    protected get _optionPath() {
        return 'dropDownOptions';
    }


    @ContentChildren(forwardRef(() => DxiToolbarItemComponent))
    get toolbarItemsChildren(): QueryList<DxiToolbarItemComponent> {
        return this._getOption('toolbarItems');
    }
    set toolbarItemsChildren(value) {
        this.setChildren('toolbarItems', value);
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
  declarations: [
    DxoDropDownOptionsComponent
  ],
  exports: [
    DxoDropDownOptionsComponent
  ],
})
export class DxoDropDownOptionsModule { }
