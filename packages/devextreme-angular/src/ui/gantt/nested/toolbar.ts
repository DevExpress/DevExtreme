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




import { dxGanttToolbarItem } from 'devextreme/ui/gantt';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-gantt-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get items(): Array<dxGanttToolbarItem | "separator" | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "taskDetails" | "fullScreen" | "resourceManager" | "showResources" | "showDependencies"> {
        return this._getOption('items');
    }
    set items(value: Array<dxGanttToolbarItem | "separator" | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "taskDetails" | "fullScreen" | "resourceManager" | "showResources" | "showDependencies">) {
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
  declarations: [
    DxoGanttToolbarComponent
  ],
  exports: [
    DxoGanttToolbarComponent
  ],
})
export class DxoGanttToolbarModule { }
