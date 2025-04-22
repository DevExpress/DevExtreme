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




import { PositionAlignment } from 'devextreme/common';
import { PositionConfig } from 'devextreme/common/core/animation';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoLoadPanelOptions } from './base/load-panel-options';


@Component({
    selector: 'dxo-load-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'animation',
        'closeOnOutsideClick',
        'container',
        'deferRendering',
        'delay',
        'focusStateEnabled',
        'height',
        'hideOnOutsideClick',
        'hideOnParentScroll',
        'hint',
        'hoverStateEnabled',
        'indicatorSrc',
        'maxHeight',
        'maxWidth',
        'message',
        'minHeight',
        'minWidth',
        'onContentReady',
        'onDisposing',
        'onHidden',
        'onHiding',
        'onInitialized',
        'onOptionChanged',
        'onShowing',
        'onShown',
        'position',
        'rtlEnabled',
        'shading',
        'shadingColor',
        'showIndicator',
        'showPane',
        'visible',
        'width',
        'wrapperAttr',
        'enabled',
        'text'
    ]
})
export class DxoLoadPanelComponent extends DxoLoadPanelOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<PositionAlignment | PositionConfig | Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;
    protected get _optionPath() {
        return 'loadPanel';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'positionChange' },
            { emit: 'visibleChange' }
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
    DxoLoadPanelComponent
  ],
  exports: [
    DxoLoadPanelComponent
  ],
})
export class DxoLoadPanelModule { }
