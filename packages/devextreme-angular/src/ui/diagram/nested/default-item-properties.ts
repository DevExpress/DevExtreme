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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-diagram-default-item-properties',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramDefaultItemPropertiesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get connectorLineEnd(): "none" | "arrow" | "outlinedTriangle" | "filledTriangle" {
        return this._getOption('connectorLineEnd');
    }
    set connectorLineEnd(value: "none" | "arrow" | "outlinedTriangle" | "filledTriangle") {
        this._setOption('connectorLineEnd', value);
    }

    @Input()
    get connectorLineStart(): "none" | "arrow" | "outlinedTriangle" | "filledTriangle" {
        return this._getOption('connectorLineStart');
    }
    set connectorLineStart(value: "none" | "arrow" | "outlinedTriangle" | "filledTriangle") {
        this._setOption('connectorLineStart', value);
    }

    @Input()
    get connectorLineType(): "straight" | "orthogonal" {
        return this._getOption('connectorLineType');
    }
    set connectorLineType(value: "straight" | "orthogonal") {
        this._setOption('connectorLineType', value);
    }

    @Input()
    get shapeMaxHeight(): number {
        return this._getOption('shapeMaxHeight');
    }
    set shapeMaxHeight(value: number) {
        this._setOption('shapeMaxHeight', value);
    }

    @Input()
    get shapeMaxWidth(): number {
        return this._getOption('shapeMaxWidth');
    }
    set shapeMaxWidth(value: number) {
        this._setOption('shapeMaxWidth', value);
    }

    @Input()
    get shapeMinHeight(): number {
        return this._getOption('shapeMinHeight');
    }
    set shapeMinHeight(value: number) {
        this._setOption('shapeMinHeight', value);
    }

    @Input()
    get shapeMinWidth(): number {
        return this._getOption('shapeMinWidth');
    }
    set shapeMinWidth(value: number) {
        this._setOption('shapeMinWidth', value);
    }

    @Input()
    get style(): Record<string, any> {
        return this._getOption('style');
    }
    set style(value: Record<string, any>) {
        this._setOption('style', value);
    }

    @Input()
    get textStyle(): Record<string, any> {
        return this._getOption('textStyle');
    }
    set textStyle(value: Record<string, any>) {
        this._setOption('textStyle', value);
    }


    protected get _optionPath() {
        return 'defaultItemProperties';
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
    DxoDiagramDefaultItemPropertiesComponent
  ],
  exports: [
    DxoDiagramDefaultItemPropertiesComponent
  ],
})
export class DxoDiagramDefaultItemPropertiesModule { }
