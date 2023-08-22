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
    selector: 'dxo-constant-line-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoConstantLineStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get dashStyle(): string {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: string) {
        this._setOption('dashStyle', value);
    }

    @Input()
    get label(): { font?: Font, horizontalAlignment?: string, position?: string, verticalAlignment?: string, visible?: boolean } | { font?: Font, position?: string, visible?: boolean } | { font?: Font, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, horizontalAlignment?: string, position?: string, verticalAlignment?: string, visible?: boolean } | { font?: Font, position?: string, visible?: boolean } | { font?: Font, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get paddingLeftRight(): number {
        return this._getOption('paddingLeftRight');
    }
    set paddingLeftRight(value: number) {
        this._setOption('paddingLeftRight', value);
    }

    @Input()
    get paddingTopBottom(): number {
        return this._getOption('paddingTopBottom');
    }
    set paddingTopBottom(value: number) {
        this._setOption('paddingTopBottom', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'constantLineStyle';
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
    DxoConstantLineStyleComponent
  ],
  exports: [
    DxoConstantLineStyleComponent
  ],
})
export class DxoConstantLineStyleModule { }
