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




import { ShapeCategory, ToolboxDisplayMode, ShapeType, PanelVisibility } from 'devextreme/ui/diagram';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiDiagramGroupComponent } from './group-dxi';
import { DxiDiagramToolboxGroupComponent } from './toolbox-group-dxi';


@Component({
    selector: 'dxo-diagram-toolbox',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoDiagramToolboxComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit  {
    @Input()
    get groups(): { category?: ShapeCategory | string, displayMode?: ToolboxDisplayMode, expanded?: boolean, shapes?: Array<ShapeType | string>, title?: string }[] {
        return this._getOption('groups');
    }
    set groups(value: { category?: ShapeCategory | string, displayMode?: ToolboxDisplayMode, expanded?: boolean, shapes?: Array<ShapeType | string>, title?: string }[]) {
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


    @ContentChildren(forwardRef(() => DxiDiagramGroupComponent)) groupsChildren!: QueryList<DxiDiagramGroupComponent>
    
    @ContentChildren(forwardRef(() => DxiDiagramToolboxGroupComponent)) toolboxGroupsChildren!: QueryList<DxiDiagramToolboxGroupComponent>
    
    setGroups() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.groupsChildren.toArray(),
            ...this.toolboxGroupsChildren.toArray(),
        ]);
        this.setChildren('groups', q);
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
        this.setGroups();
        
        this.groupsChildren.changes.subscribe(() => { this.setGroups() });
        this.toolboxGroupsChildren.changes.subscribe(() => { this.setGroups() });
    }
}

@NgModule({
  imports: [
    DxoDiagramToolboxComponent
  ],
  exports: [
    DxoDiagramToolboxComponent
  ],
})
export class DxoDiagramToolboxModule { }
