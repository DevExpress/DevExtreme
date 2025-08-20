/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList,
} from '@angular/core';




import { Command, CustomCommand } from 'devextreme/ui/diagram';
import { ToolbarItemLocation } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


import {
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-diagram-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_items,
           useExisting: DxiDiagramItemComponent,
        }
    ],
})
export class DxiDiagramItemComponent extends CollectionNestedOption {

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    
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

    @Input()
    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'items';
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
    DxiDiagramItemComponent
  ],
  exports: [
    DxiDiagramItemComponent
  ],
})
export class DxiDiagramItemModule { }
