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
    forwardRef,
    QueryList
} from '@angular/core';




import DevExpress from 'devextreme/bundles/dx.all';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiTabComponent } from './tab-dxi';


@Component({
    selector: 'dxo-properties-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPropertiesPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get tabs(): Array<any | { commands?: Array<DevExpress.ui.dxDiagramCustomCommand | string>, groups?: Array<any | { commands?: Array<DevExpress.ui.dxDiagramCustomCommand | string>, title?: string }>, title?: string }> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<any | { commands?: Array<DevExpress.ui.dxDiagramCustomCommand | string>, groups?: Array<any | { commands?: Array<DevExpress.ui.dxDiagramCustomCommand | string>, title?: string }>, title?: string }>) {
        this._setOption('tabs', value);
    }

    @Input()
    get visibility(): string {
        return this._getOption('visibility');
    }
    set visibility(value: string) {
        this._setOption('visibility', value);
    }


    protected get _optionPath() {
        return 'propertiesPanel';
    }


    @ContentChildren(forwardRef(() => DxiTabComponent))
    get tabsChildren(): QueryList<DxiTabComponent> {
        return this._getOption('tabs');
    }
    set tabsChildren(value) {
        this.setChildren('tabs', value);
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
  declarations: [
    DxoPropertiesPanelComponent
  ],
  exports: [
    DxoPropertiesPanelComponent
  ],
})
export class DxoPropertiesPanelModule { }
