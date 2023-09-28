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

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-border',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBorderComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string | undefined {
        return this._getOption('color');
    }
    set color(value: string | undefined) {
        this._setOption('color', value);
    }

    @Input()
    get cornerRadius(): number {
        return this._getOption('cornerRadius');
    }
    set cornerRadius(value: number) {
        this._setOption('cornerRadius', value);
    }

    @Input()
    get dashStyle(): DashStyle | undefined {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: DashStyle | undefined) {
        this._setOption('dashStyle', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number | undefined {
        return this._getOption('width');
    }
    set width(value: number | undefined) {
        this._setOption('width', value);
    }

    @Input()
    get bottom(): boolean {
        return this._getOption('bottom');
    }
    set bottom(value: boolean) {
        this._setOption('bottom', value);
    }

    @Input()
    get left(): boolean {
        return this._getOption('left');
    }
    set left(value: boolean) {
        this._setOption('left', value);
    }

    @Input()
    get right(): boolean {
        return this._getOption('right');
    }
    set right(value: boolean) {
        this._setOption('right', value);
    }

    @Input()
    get top(): boolean {
        return this._getOption('top');
    }
    set top(value: boolean) {
        this._setOption('top', value);
    }


    protected get _optionPath() {
        return 'border';
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
    DxoBorderComponent
  ],
  exports: [
    DxoBorderComponent
  ],
})
export class DxoBorderModule { }
