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
import { SankeyColorMode } from 'devextreme/viz/sankey';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-link',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLinkComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, visible?: boolean, width?: number }) {
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
    get colorMode(): SankeyColorMode {
        return this._getOption('colorMode');
    }
    set colorMode(value: SankeyColorMode) {
        this._setOption('colorMode', value);
    }

    @Input()
    get hoverStyle(): { border?: { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }, color?: string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, opacity?: number } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }, color?: string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, opacity?: number }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }


    protected get _optionPath() {
        return 'link';
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
    DxoLinkComponent
  ],
  exports: [
    DxoLinkComponent
  ],
})
export class DxoLinkModule { }
