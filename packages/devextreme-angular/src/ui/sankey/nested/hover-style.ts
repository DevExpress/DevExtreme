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
    selector: 'dxo-hover-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHoverStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }) {
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
    get hatching(): { direction?: HatchDirection, opacity?: number, step?: number, width?: number } {
        return this._getOption('hatching');
    }
    set hatching(value: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }) {
        this._setOption('hatching', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }


    protected get _optionPath() {
        return 'hoverStyle';
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
    DxoHoverStyleComponent
  ],
  exports: [
    DxoHoverStyleComponent
  ],
})
export class DxoHoverStyleModule { }
