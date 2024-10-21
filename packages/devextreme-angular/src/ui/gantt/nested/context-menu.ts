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




import { dxGanttContextMenuItem } from 'devextreme/ui/gantt';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


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
    get items(): Array<dxGanttContextMenuItem | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "deleteDependency" | "taskDetails" | "resourceManager"> {
        return this._getOption('items');
    }
    set items(value: Array<dxGanttContextMenuItem | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "deleteDependency" | "taskDetails" | "resourceManager">) {
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
  declarations: [
    DxoGanttContextMenuComponent
  ],
  exports: [
    DxoGanttContextMenuComponent
  ],
})
export class DxoGanttContextMenuModule { }
