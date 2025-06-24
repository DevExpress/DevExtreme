/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList,
    AfterContentInit
} from '@angular/core';




import { Command, CustomCommand } from 'devextreme/ui/diagram';
import { ToolbarItemLocation } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiDiagramItemComponent } from './item-dxi';


@Component({
    selector: 'dxi-diagram-command-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxiDiagramCommandItemComponent extends CollectionNestedOption implements AfterContentInit  {
    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get items(): Array<Command | CustomCommand> {
        return this._getOption('items');
    }
    set items(value: Array<Command | CustomCommand>) {
        this._setOption('items', value);
    }

    @Input()
    get location(): ToolbarItemLocation {
        return this._getOption('location');
    }
    set location(value: ToolbarItemLocation) {
        this._setOption('location', value);
    }

    @Input()
    get name(): Command | string {
        return this._getOption('name');
    }
    set name(value: Command | string) {
        this._setOption('name', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }


    protected get _optionPath() {
        return 'items';
    }


    @ContentChildren(forwardRef(() => DxiDiagramCommandItemComponent)) commandItemsChildren!: QueryList<DxiDiagramCommandItemComponent>
    
    @ContentChildren(forwardRef(() => DxiDiagramItemComponent)) itemsChildren!: QueryList<DxiDiagramItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.commandItemsChildren.toArray(),
            ...this.itemsChildren.toArray(),
        ]);
        this.setChildren('items', q);
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

    ngAfterContentInit() {
        this.setItems();
        
        this.commandItemsChildren.changes.subscribe(() => { this.setItems() });
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxiDiagramCommandItemComponent
  ],
  exports: [
    DxiDiagramCommandItemComponent
  ],
})
export class DxiDiagramCommandItemModule { }
