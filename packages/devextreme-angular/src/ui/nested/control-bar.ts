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




import { HorizontalAlignment, VerticalEdge } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-control-bar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoControlBarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get borderColor(): string {
        return this._getOption('borderColor');
    }
    set borderColor(value: string) {
        this._setOption('borderColor', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get horizontalAlignment(): HorizontalAlignment {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalAlignment) {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get margin(): number {
        return this._getOption('margin');
    }
    set margin(value: number) {
        this._setOption('margin', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get panVisible(): boolean {
        return this._getOption('panVisible');
    }
    set panVisible(value: boolean) {
        this._setOption('panVisible', value);
    }

    @Input()
    get verticalAlignment(): VerticalEdge {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: VerticalEdge) {
        this._setOption('verticalAlignment', value);
    }

    @Input()
    get zoomVisible(): boolean {
        return this._getOption('zoomVisible');
    }
    set zoomVisible(value: boolean) {
        this._setOption('zoomVisible', value);
    }


    protected get _optionPath() {
        return 'controlBar';
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
    DxoControlBarComponent
  ],
  exports: [
    DxoControlBarComponent
  ],
})
export class DxoControlBarModule { }
