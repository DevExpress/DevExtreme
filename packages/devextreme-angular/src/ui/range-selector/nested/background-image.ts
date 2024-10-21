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
    selector: 'dxo-range-selector-background-image',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorBackgroundImageComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get location(): "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop" {
        return this._getOption('location');
    }
    set location(value: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop") {
        this._setOption('location', value);
    }

    @Input()
    get url(): string {
        return this._getOption('url');
    }
    set url(value: string) {
        this._setOption('url', value);
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
    DxoRangeSelectorBackgroundImageComponent
  ],
  exports: [
    DxoRangeSelectorBackgroundImageComponent
  ],
})
export class DxoRangeSelectorBackgroundImageModule { }
