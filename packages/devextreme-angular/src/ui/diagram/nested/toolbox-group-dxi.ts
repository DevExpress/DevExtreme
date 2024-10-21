/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-diagram-toolbox-group',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDiagramToolboxGroupComponent extends CollectionNestedOption {
    @Input()
    get category(): "general" | "flowchart" | "orgChart" | "containers" | "custom" {
        return this._getOption('category');
    }
    set category(value: "general" | "flowchart" | "orgChart" | "containers" | "custom") {
        this._setOption('category', value);
    }

    @Input()
    get displayMode(): "icons" | "texts" {
        return this._getOption('displayMode');
    }
    set displayMode(value: "icons" | "texts") {
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
    get shapes(): Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight"> {
        return this._getOption('shapes');
    }
    set shapes(value: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">) {
        this._setOption('shapes', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
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
  declarations: [
    DxiDiagramToolboxGroupComponent
  ],
  exports: [
    DxiDiagramToolboxGroupComponent
  ],
})
export class DxiDiagramToolboxGroupModule { }
