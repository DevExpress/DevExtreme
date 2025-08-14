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
    QueryList,
} from '@angular/core';




import { dxGanttContextMenuItem, GanttPredefinedContextMenuItem } from 'devextreme/ui/gantt';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-gantt-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
})
export class DxoGanttContextMenuComponent extends NestedOption implements OnDestroy, OnInit {

    @ContentChildren(СOLLECTION_NESTED_OPTION_TOKEN)
    set _CollectionOptionChildren(value: QueryList<{ propertyName: string, component: CollectionNestedOption }>) {
        this._setCollectionOptionChildren(value);
    }
    
    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get items(): Array<dxGanttContextMenuItem | GanttPredefinedContextMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxGanttContextMenuItem | GanttPredefinedContextMenuItem>) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'contextMenu';
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
    DxoGanttContextMenuComponent
  ],
  exports: [
    DxoGanttContextMenuComponent
  ],
})
export class DxoGanttContextMenuModule { }
