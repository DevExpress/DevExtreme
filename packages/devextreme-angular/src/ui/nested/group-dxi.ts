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




import { DiagramCommand, DiagramShapeCategory, DiagramShapeType, DiagramToolboxDisplayMode, dxDiagramCustomCommand } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiCommandComponent } from './command-dxi';


@Component({
    selector: 'dxi-group',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiGroupComponent extends CollectionNestedOption {
    @Input()
    get commands(): Array<dxDiagramCustomCommand | DiagramCommand> {
        return this._getOption('commands');
    }
    set commands(value: Array<dxDiagramCustomCommand | DiagramCommand>) {
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
    get category(): DiagramShapeCategory | string {
        return this._getOption('category');
    }
    set category(value: DiagramShapeCategory | string) {
        this._setOption('category', value);
    }

    @Input()
    get displayMode(): DiagramToolboxDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: DiagramToolboxDisplayMode) {
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
    get shapes(): Array<DiagramShapeType | string> {
        return this._getOption('shapes');
    }
    set shapes(value: Array<DiagramShapeType | string>) {
        this._setOption('shapes', value);
    }


    protected get _optionPath() {
        return 'groups';
    }


    @ContentChildren(forwardRef(() => DxiCommandComponent))
    get commandsChildren(): QueryList<DxiCommandComponent> {
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
    DxiGroupComponent
  ],
  exports: [
    DxiGroupComponent
  ],
})
export class DxiGroupModule { }
