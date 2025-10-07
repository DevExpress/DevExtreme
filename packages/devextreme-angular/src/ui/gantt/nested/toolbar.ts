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




import { dxGanttToolbarItem, GanttPredefinedToolbarItem } from 'devextreme/ui/gantt';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-gantt-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoGanttToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    
    @Input()
    get items(): Array<dxGanttToolbarItem | GanttPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxGanttToolbarItem | GanttPredefinedToolbarItem>) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'toolbar';
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
    DxoGanttToolbarComponent
  ],
  exports: [
    DxoGanttToolbarComponent
  ],
})
export class DxoGanttToolbarModule { }
