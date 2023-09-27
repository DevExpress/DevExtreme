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




import { DiagramConnectorLineEnd, DiagramConnectorLineType } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-default-item-properties',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDefaultItemPropertiesComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get connectorLineEnd(): DiagramConnectorLineEnd {
        return this._getOption('connectorLineEnd');
    }
    set connectorLineEnd(value: DiagramConnectorLineEnd) {
        this._setOption('connectorLineEnd', value);
    }

    @Input()
    get connectorLineStart(): DiagramConnectorLineEnd {
        return this._getOption('connectorLineStart');
    }
    set connectorLineStart(value: DiagramConnectorLineEnd) {
        this._setOption('connectorLineStart', value);
    }

    @Input()
    get connectorLineType(): DiagramConnectorLineType {
        return this._getOption('connectorLineType');
    }
    set connectorLineType(value: DiagramConnectorLineType) {
        this._setOption('connectorLineType', value);
    }

    @Input()
    get shapeMaxHeight(): number | undefined {
        return this._getOption('shapeMaxHeight');
    }
    set shapeMaxHeight(value: number | undefined) {
        this._setOption('shapeMaxHeight', value);
    }

    @Input()
    get shapeMaxWidth(): number | undefined {
        return this._getOption('shapeMaxWidth');
    }
    set shapeMaxWidth(value: number | undefined) {
        this._setOption('shapeMaxWidth', value);
    }

    @Input()
    get shapeMinHeight(): number | undefined {
        return this._getOption('shapeMinHeight');
    }
    set shapeMinHeight(value: number | undefined) {
        this._setOption('shapeMinHeight', value);
    }

    @Input()
    get shapeMinWidth(): number | undefined {
        return this._getOption('shapeMinWidth');
    }
    set shapeMinWidth(value: number | undefined) {
        this._setOption('shapeMinWidth', value);
    }

    @Input()
    get style(): any {
        return this._getOption('style');
    }
    set style(value: any) {
        this._setOption('style', value);
    }

    @Input()
    get textStyle(): any {
        return this._getOption('textStyle');
    }
    set textStyle(value: any) {
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
    DxoDefaultItemPropertiesComponent
  ],
  exports: [
    DxoDefaultItemPropertiesComponent
  ],
})
export class DxoDefaultItemPropertiesModule { }
