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
    selector: 'dxo-editing-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoEditingDiagramComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowAddShape(): boolean {
        return this._getOption('allowAddShape');
    }
    set allowAddShape(value: boolean) {
        this._setOption('allowAddShape', value);
    }

    @Input()
    get allowChangeConnection(): boolean {
        return this._getOption('allowChangeConnection');
    }
    set allowChangeConnection(value: boolean) {
        this._setOption('allowChangeConnection', value);
    }

    @Input()
    get allowChangeConnectorPoints(): boolean {
        return this._getOption('allowChangeConnectorPoints');
    }
    set allowChangeConnectorPoints(value: boolean) {
        this._setOption('allowChangeConnectorPoints', value);
    }

    @Input()
    get allowChangeConnectorText(): boolean {
        return this._getOption('allowChangeConnectorText');
    }
    set allowChangeConnectorText(value: boolean) {
        this._setOption('allowChangeConnectorText', value);
    }

    @Input()
    get allowChangeShapeText(): boolean {
        return this._getOption('allowChangeShapeText');
    }
    set allowChangeShapeText(value: boolean) {
        this._setOption('allowChangeShapeText', value);
    }

    @Input()
    get allowDeleteConnector(): boolean {
        return this._getOption('allowDeleteConnector');
    }
    set allowDeleteConnector(value: boolean) {
        this._setOption('allowDeleteConnector', value);
    }

    @Input()
    get allowDeleteShape(): boolean {
        return this._getOption('allowDeleteShape');
    }
    set allowDeleteShape(value: boolean) {
        this._setOption('allowDeleteShape', value);
    }

    @Input()
    get allowMoveShape(): boolean {
        return this._getOption('allowMoveShape');
    }
    set allowMoveShape(value: boolean) {
        this._setOption('allowMoveShape', value);
    }

    @Input()
    get allowResizeShape(): boolean {
        return this._getOption('allowResizeShape');
    }
    set allowResizeShape(value: boolean) {
        this._setOption('allowResizeShape', value);
    }


    protected get _optionPath() {
        return 'editing';
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
    DxoEditingDiagramComponent
  ],
  exports: [
    DxoEditingDiagramComponent
  ],
})
export class DxoEditingDiagramModule { }
