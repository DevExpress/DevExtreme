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




import { ConnectorLineEnd, ConnectorLineType } from 'devextreme/ui/diagram';

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
    get connectorLineEnd(): ConnectorLineEnd {
        return this._getOption('connectorLineEnd');
    }
    set connectorLineEnd(value: ConnectorLineEnd) {
        this._setOption('connectorLineEnd', value);
    }

    @Input()
    get connectorLineStart(): ConnectorLineEnd {
        return this._getOption('connectorLineStart');
    }
    set connectorLineStart(value: ConnectorLineEnd) {
        this._setOption('connectorLineStart', value);
    }

    @Input()
    get connectorLineType(): ConnectorLineType {
        return this._getOption('connectorLineType');
    }
    set connectorLineType(value: ConnectorLineType) {
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
