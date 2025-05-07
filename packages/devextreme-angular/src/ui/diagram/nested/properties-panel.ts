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




import { Command, CustomCommand, PanelVisibility } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiDiagramTabComponent } from './tab-dxi';


@Component({
    selector: 'dxo-diagram-properties-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramPropertiesPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get tabs(): { commands?: Array<Command | CustomCommand>, groups?: { commands?: Array<Command | CustomCommand>, title?: string }[], title?: string }[] {
        return this._getOption('tabs');
    }
    set tabs(value: { commands?: Array<Command | CustomCommand>, groups?: { commands?: Array<Command | CustomCommand>, title?: string }[], title?: string }[]) {
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


    @ContentChildren(forwardRef(() => DxiDiagramTabComponent))
    get tabsChildren(): QueryList<DxiDiagramTabComponent> {
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
    DxoDiagramPropertiesPanelComponent
  ],
  exports: [
    DxoDiagramPropertiesPanelComponent
  ],
})
export class DxoDiagramPropertiesPanelModule { }
