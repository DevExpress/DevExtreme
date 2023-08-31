/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-constant-line',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiConstantLineComponent extends CollectionNestedOption {
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
    get displayBehindSeries(): boolean {
        return this._getOption('displayBehindSeries');
    }
    set displayBehindSeries(value: boolean) {
        this._setOption('displayBehindSeries', value);
    }

    @Input()
    get extendAxis(): boolean {
        return this._getOption('extendAxis');
    }
    set extendAxis(value: boolean) {
        this._setOption('extendAxis', value);
    }

    @Input()
    get label(): { font?: Font, horizontalAlignment?: string, position?: string, text?: string | undefined, verticalAlignment?: string, visible?: boolean } | { font?: Font, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, horizontalAlignment?: string, position?: string, text?: string | undefined, verticalAlignment?: string, visible?: boolean } | { font?: Font, text?: string | undefined, visible?: boolean }) {
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
    get value(): Date | number | string | undefined {
        return this._getOption('value');
    }
    set value(value: Date | number | string | undefined) {
        this._setOption('value', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'constantLines';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiConstantLineComponent
  ],
  exports: [
    DxiConstantLineComponent
  ],
})
export class DxiConstantLineModule { }
