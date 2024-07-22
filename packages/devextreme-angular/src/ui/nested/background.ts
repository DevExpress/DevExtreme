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
    selector: 'dxo-background',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBackgroundComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get image(): { location?: BackgroundImageLocation, url?: string | undefined } {
        return this._getOption('image');
    }
    set image(value: { location?: BackgroundImageLocation, url?: string | undefined }) {
        this._setOption('image', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get borderColor(): string {
        return this._getOption('borderColor');
    }
    set borderColor(value: string) {
        this._setOption('borderColor', value);
    }


    protected get _optionPath() {
        return 'background';
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
    DxoBackgroundComponent
  ],
  exports: [
    DxoBackgroundComponent
  ],
})
export class DxoBackgroundModule { }
