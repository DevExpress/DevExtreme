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




import { DashStyle } from 'devextreme/common/charts';
import { Format } from 'devextreme/localization';
import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-crosshair',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCrosshairComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get dashStyle(): DashStyle {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: DashStyle) {
        this._setOption('dashStyle', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get horizontalLine(): boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: Function, font?: Font, format?: Format | string | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('horizontalLine');
    }
    set horizontalLine(value: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: Function, font?: Font, format?: Format | string | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('horizontalLine', value);
    }

    @Input()
    get label(): { backgroundColor?: string, customizeText?: Function, font?: Font, format?: Format | string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { backgroundColor?: string, customizeText?: Function, font?: Font, format?: Format | string | undefined, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get verticalLine(): boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: Function, font?: Font, format?: Format | string | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('verticalLine');
    }
    set verticalLine(value: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: Function, font?: Font, format?: Format | string | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('verticalLine', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'crosshair';
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
    DxoCrosshairComponent
  ],
  exports: [
    DxoCrosshairComponent
  ],
})
export class DxoCrosshairModule { }
