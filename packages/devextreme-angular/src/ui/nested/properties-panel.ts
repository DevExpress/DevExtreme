/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { Command, CustomCommand, PanelVisibility } from 'devextreme/ui/diagram';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-properties-panel',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoPropertiesPanelComponent) => ({
                propertyName: 'propertiesPanel',
                className: 'DxoPropertiesPanelComponent',
                component
            }),
            deps: [DxoPropertiesPanelComponent],
         }
         ]
})
export class DxoPropertiesPanelComponent extends NestedOption implements OnDestroy, OnInit {
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
