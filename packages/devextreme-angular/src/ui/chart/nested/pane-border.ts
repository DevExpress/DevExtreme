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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-pane-border',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartPaneBorderComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get bottom(): boolean {
        return this._getOption('bottom');
    }
    set bottom(value: boolean) {
        this._setOption('bottom', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get dashStyle(): "dash" | "dot" | "longDash" | "solid" {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: "dash" | "dot" | "longDash" | "solid") {
        this._setOption('dashStyle', value);
    }

    @Input()
    get left(): boolean {
        return this._getOption('left');
    }
    set left(value: boolean) {
        this._setOption('left', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
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

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
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
    DxoChartPaneBorderComponent
  ],
  exports: [
    DxoChartPaneBorderComponent
  ],
})
export class DxoChartPaneBorderModule { }
