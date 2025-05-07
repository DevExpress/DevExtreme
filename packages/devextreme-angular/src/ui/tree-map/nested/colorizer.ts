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




import { Palette, PaletteExtensionMode } from 'devextreme/common/charts';
import { TreeMapColorizerType } from 'devextreme/viz/tree_map';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-map-colorizer',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeMapColorizerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get colorCodeField(): string | undefined {
        return this._getOption('colorCodeField');
    }
    set colorCodeField(value: string | undefined) {
        this._setOption('colorCodeField', value);
    }

    @Input()
    get colorizeGroups(): boolean {
        return this._getOption('colorizeGroups');
    }
    set colorizeGroups(value: boolean) {
        this._setOption('colorizeGroups', value);
    }

    @Input()
    get palette(): Array<string> | Palette {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | Palette) {
        this._setOption('palette', value);
    }

    @Input()
    get paletteExtensionMode(): PaletteExtensionMode {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: PaletteExtensionMode) {
        this._setOption('paletteExtensionMode', value);
    }

    @Input()
    get range(): Array<number> {
        return this._getOption('range');
    }
    set range(value: Array<number>) {
        this._setOption('range', value);
    }

    @Input()
    get type(): TreeMapColorizerType | undefined {
        return this._getOption('type');
    }
    set type(value: TreeMapColorizerType | undefined) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'colorizer';
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
    DxoTreeMapColorizerComponent
  ],
  exports: [
    DxoTreeMapColorizerComponent
  ],
})
export class DxoTreeMapColorizerModule { }
