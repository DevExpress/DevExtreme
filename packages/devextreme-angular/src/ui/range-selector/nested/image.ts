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
    selector: 'dxo-range-selector-image',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorImageComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get location(): "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop" {
        return this._getOption('location');
    }
    set location(value: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop") {
        this._setOption('location', value);
    }

    @Input()
    get url(): string | Record<string, any> | { rangeMaxPoint: string, rangeMinPoint: string } {
        return this._getOption('url');
    }
    set url(value: string | Record<string, any> | { rangeMaxPoint: string, rangeMinPoint: string }) {
        this._setOption('url', value);
    }

    @Input()
    get height(): number | Record<string, any> | { rangeMaxPoint: number, rangeMinPoint: number } {
        return this._getOption('height');
    }
    set height(value: number | Record<string, any> | { rangeMaxPoint: number, rangeMinPoint: number }) {
        this._setOption('height', value);
    }

    @Input()
    get width(): number | Record<string, any> | { rangeMaxPoint: number, rangeMinPoint: number } {
        return this._getOption('width');
    }
    set width(value: number | Record<string, any> | { rangeMaxPoint: number, rangeMinPoint: number }) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'image';
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
    DxoRangeSelectorImageComponent
  ],
  exports: [
    DxoRangeSelectorImageComponent
  ],
})
export class DxoRangeSelectorImageModule { }
