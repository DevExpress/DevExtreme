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




import { BackgroundImageLocation } from 'devextreme/viz/range_selector';

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
    get location(): BackgroundImageLocation {
        return this._getOption('location');
    }
    set location(value: BackgroundImageLocation) {
        this._setOption('location', value);
    }

    @Input()
    get url(): string | undefined {
        return this._getOption('url');
    }
    set url(value: string | undefined) {
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
