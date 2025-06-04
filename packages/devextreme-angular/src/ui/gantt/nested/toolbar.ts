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
    QueryList,
    AfterContentInit
} from '@angular/core';




import { dxGanttToolbarItem, GanttPredefinedToolbarItem } from 'devextreme/ui/gantt';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiGanttItemComponent } from './item-dxi';
import { DxiGanttToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-gantt-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoGanttToolbarComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit   {
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


    @ContentChildren(forwardRef(() => DxiGanttItemComponent)) itemsChildren!: QueryList<DxiGanttItemComponent>
    
    @ContentChildren(forwardRef(() => DxiGanttToolbarItemComponent)) toolbarItemsChildren!: QueryList<DxiGanttToolbarItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.itemsChildren.toArray(),
            ...this.toolbarItemsChildren.toArray(),
        ]);
        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();
        
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
        this.toolbarItemsChildren.changes.subscribe(() => { this.setItems() });
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
