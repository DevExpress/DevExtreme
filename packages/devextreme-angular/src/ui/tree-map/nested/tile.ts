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




import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-map-tile',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeMapTileComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): Record<string, any> | { color?: string, width?: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color?: string, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string, width?: number }, color?: string } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string, width?: number }, color?: string }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): Record<string, any> | { font?: Font, textOverflow?: "ellipsis" | "hide" | "none", visible?: boolean, wordWrap?: "normal" | "breakWord" | "none" } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { font?: Font, textOverflow?: "ellipsis" | "hide" | "none", visible?: boolean, wordWrap?: "normal" | "breakWord" | "none" }) {
        this._setOption('label', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string, width?: number }, color?: string } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string, width?: number }, color?: string }) {
        this._setOption('selectionStyle', value);
    }


    protected get _optionPath() {
        return 'tile';
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
    DxoTreeMapTileComponent
  ],
  exports: [
    DxoTreeMapTileComponent
  ],
})
export class DxoTreeMapTileModule { }
