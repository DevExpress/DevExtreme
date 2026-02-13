/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';




import { Command, CustomCommand, ShapeCategory, ToolboxDisplayMode, ShapeType } from 'devextreme/ui/diagram';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_groups } from 'devextreme-angular/core/tokens';
import {
    PROPERTY_TOKEN_commands,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-diagram-group',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_groups,
           useExisting: DxiDiagramGroupComponent,
        }
    ]
})
export class DxiDiagramGroupComponent extends CollectionNestedOption {
    @ContentChildren(PROPERTY_TOKEN_commands)
    set _commandsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('commands', value);
    }
    
    @Input()
    get commands(): Array<Command | CustomCommand> {
        return this._getOption('commands');
    }
    set commands(value: Array<Command | CustomCommand>) {
        this._setOption('commands', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get category(): ShapeCategory | string {
        return this._getOption('category');
    }
    set category(value: ShapeCategory | string) {
        this._setOption('category', value);
    }

    @Input()
    get displayMode(): ToolboxDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: ToolboxDisplayMode) {
        this._setOption('displayMode', value);
    }

    @Input()
    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    @Input()
    get shapes(): Array<ShapeType | string> {
        return this._getOption('shapes');
    }
    set shapes(value: Array<ShapeType | string>) {
        this._setOption('shapes', value);
    }


    protected get _optionPath() {
        return 'groups';
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
    DxiDiagramGroupComponent
  ],
  exports: [
    DxiDiagramGroupComponent
  ],
})
export class DxiDiagramGroupModule { }
