/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    ContentChildren,
    QueryList,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
    СOLLECTION_NESTED_OPTION_TOKEN,
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
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiCommandComponent) => ({
               propertyName: 'commands',
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

    @ContentChildren(СOLLECTION_NESTED_OPTION_TOKEN)
    set _CollectionOptionChildren(value: QueryList<{ propertyName: string, component: CollectionNestedOption }>) {
        this._setChildren(value);
    }
    

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
