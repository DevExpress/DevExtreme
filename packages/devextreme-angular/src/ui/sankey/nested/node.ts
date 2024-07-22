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




import { HatchDirection } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-node-sankey',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoNodeSankeyComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): string | undefined {
        return this._getOption('color');
    }
    set color(value: string | undefined) {
        this._setOption('color', value);
    }

    @Input()
    get hoverStyle(): { border?: { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }, color?: string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, opacity?: number | undefined } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }, color?: string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, opacity?: number | undefined }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get padding(): number {
        return this._getOption('padding');
    }
    set padding(value: number) {
        this._setOption('padding', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'node';
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
    DxoNodeSankeyComponent
  ],
  exports: [
    DxoNodeSankeyComponent
  ],
})
export class DxoNodeSankeyModule { }
