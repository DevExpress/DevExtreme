/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiDiagramCustomCommand } from './base/diagram-custom-command-dxi';

@Component({
    selector: 'dxi-command',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxiCommandComponent) => ({
                propertyName: 'commands',
                className: 'DxiCommandComponent',
                component
            }),
            deps: [DxiCommandComponent],
         }
    ],
    inputs: [
        'icon',
        'items',
        'location',
        'name',
        'text',
        'options',
        'prompt'
    ]
})
export class DxiCommandComponent extends DxiDiagramCustomCommand {

    protected get _optionPath() {
        return 'commands';
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiCommandComponent
  ],
  exports: [
    DxiCommandComponent
  ],
})
export class DxiCommandModule { }
