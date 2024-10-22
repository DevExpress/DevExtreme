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
    selector: 'dxo-range-selector-background',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorBackgroundComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get image(): Record<string, any> | { location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop", url?: string } {
        return this._getOption('image');
    }
    set image(value: Record<string, any> | { location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop", url?: string }) {
        this._setOption('image', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
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
    DxoRangeSelectorBackgroundComponent
  ],
  exports: [
    DxoRangeSelectorBackgroundComponent
  ],
})
export class DxoRangeSelectorBackgroundModule { }
