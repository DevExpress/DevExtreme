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




import { PanelVisibility, ShapeCategory, ShapeType, ToolboxDisplayMode } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiGroupDiagramComponent } from './group-dxi';


@Component({
    selector: 'dxo-toolbox-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoToolboxDiagramComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get groups(): Array<ShapeCategory | any | { category?: ShapeCategory | string, displayMode?: ToolboxDisplayMode, expanded?: boolean, shapes?: Array<ShapeType | string>, title?: string }> {
        return this._getOption('groups');
    }
    set groups(value: Array<ShapeCategory | any | { category?: ShapeCategory | string, displayMode?: ToolboxDisplayMode, expanded?: boolean, shapes?: Array<ShapeType | string>, title?: string }>) {
        this._setOption('groups', value);
    }

    @Input()
    get shapeIconsPerRow(): number {
        return this._getOption('shapeIconsPerRow');
    }
    set shapeIconsPerRow(value: number) {
        this._setOption('shapeIconsPerRow', value);
    }

    @Input()
    get showSearch(): boolean {
        return this._getOption('showSearch');
    }
    set showSearch(value: boolean) {
        this._setOption('showSearch', value);
    }

    @Input()
    get visibility(): PanelVisibility {
        return this._getOption('visibility');
    }
    set visibility(value: PanelVisibility) {
        this._setOption('visibility', value);
    }

    @Input()
    get width(): number | undefined {
        return this._getOption('width');
    }
    set width(value: number | undefined) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'toolbox';
    }


    @ContentChildren(forwardRef(() => DxiGroupDiagramComponent))
    get groupsChildren(): QueryList<DxiGroupDiagramComponent> {
        return this._getOption('groups');
    }
    set groupsChildren(value) {
        this.setChildren('groups', value);
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
    DxoToolboxDiagramComponent
  ],
  exports: [
    DxoToolboxDiagramComponent
  ],
})
export class DxoToolboxDiagramModule { }
