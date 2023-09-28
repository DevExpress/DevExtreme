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




import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tile',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTileComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, width?: number }) {
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
    get hoverStyle(): { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): { font?: Font, textOverflow?: string, visible?: boolean, wordWrap?: string } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, textOverflow?: string, visible?: boolean, wordWrap?: string }) {
        this._setOption('label', value);
    }

    @Input()
    get selectionStyle(): { border?: { color?: string, width?: number | undefined }, color?: string | undefined } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: { border?: { color?: string, width?: number | undefined }, color?: string | undefined }) {
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
    DxoTileComponent
  ],
  exports: [
    DxoTileComponent
  ],
})
export class DxoTileModule { }
