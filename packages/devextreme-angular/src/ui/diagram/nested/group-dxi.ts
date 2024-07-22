/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { Command, CustomCommand, ShapeCategory, ShapeType, ToolboxDisplayMode } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiCommandDiagramComponent } from './command-dxi';


@Component({
    selector: 'dxi-group-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiGroupDiagramComponent extends CollectionNestedOption {
    @Input()
    get commands(): Array<CustomCommand | Command> {
        return this._getOption('commands');
    }
    set commands(value: Array<CustomCommand | Command>) {
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


    @ContentChildren(forwardRef(() => DxiCommandDiagramComponent))
    get commandsChildren(): QueryList<DxiCommandDiagramComponent> {
        return this._getOption('commands');
    }
    set commandsChildren(value) {
        this.setChildren('commands', value);
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
    DxiGroupDiagramComponent
  ],
  exports: [
    DxiGroupDiagramComponent
  ],
})
export class DxiGroupDiagramModule { }
