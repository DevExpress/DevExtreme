/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';




import type { Command, CustomCommand, PanelVisibility } from 'devextreme/ui/diagram';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_tabs,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-properties-panel',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoPropertiesPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_tabs)
    set _tabsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('tabs', value);
    }
    
    @Input()
    get tabs(): Array<any | { commands?: Array<CustomCommand | Command>, groups?: Array<any | { commands?: Array<CustomCommand | Command>, title?: string }>, title?: string }> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<any | { commands?: Array<CustomCommand | Command>, groups?: Array<any | { commands?: Array<CustomCommand | Command>, title?: string }>, title?: string }>) {
        this._setOption('tabs', value);
    }

    @Input()
    get visibility(): PanelVisibility {
        return this._getOption('visibility');
    }
    set visibility(value: PanelVisibility) {
        this._setOption('visibility', value);
    }


    protected get _optionPath() {
        return 'propertiesPanel';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
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
    DxoPropertiesPanelComponent
  ],
  exports: [
    DxoPropertiesPanelComponent
  ],
})
export class DxoPropertiesPanelModule { }
