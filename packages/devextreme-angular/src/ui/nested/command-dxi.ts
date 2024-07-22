/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiDiagramCustomCommand } from './base/diagram-custom-command-dxi';
import { DxiItemComponent } from './item-dxi';


@Component({
    selector: 'dxi-command',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'icon',
        'items',
        'location',
        'name',
        'text'
    ]
})
export class DxiCommandComponent extends DxiDiagramCustomCommand {

    protected get _optionPath() {
        return 'commands';
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
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiCommandComponent
  ],
  exports: [
    DxiCommandComponent
  ],
})
export class DxiCommandModule { }
