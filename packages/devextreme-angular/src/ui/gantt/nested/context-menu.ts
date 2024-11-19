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




import { dxGanttContextMenuItem, GanttPredefinedContextMenuItem } from 'devextreme/ui/gantt';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiGanttContextMenuItemComponent } from './context-menu-item-dxi';
import { DxiGanttItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-gantt-context-menu',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttContextMenuComponent extends NestedOption implements OnDestroy, OnInit  {
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


    @ContentChildren(forwardRef(() => DxiGanttContextMenuItemComponent))
    get contextMenuItemsChildren(): QueryList<DxiGanttContextMenuItemComponent> {
        return this._getOption('items');
    }
    set contextMenuItemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiGanttItemComponent))
    get itemsChildren(): QueryList<DxiGanttItemComponent> {
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


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoGanttContextMenuComponent
  ],
  exports: [
    DxoGanttContextMenuComponent
  ],
})
export class DxoGanttContextMenuModule { }
