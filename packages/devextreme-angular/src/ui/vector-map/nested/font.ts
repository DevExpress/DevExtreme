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
    selector: 'dxo-font-vector-map',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFontVectorMapComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get family(): string {
        return this._getOption('family');
    }
    set family(value: string) {
        this._setOption('family', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get size(): number | string {
        return this._getOption('size');
    }
    set size(value: number | string) {
        this._setOption('size', value);
    }

    @Input()
    get weight(): number {
        return this._getOption('weight');
    }
    set weight(value: number) {
        this._setOption('weight', value);
    }


    protected get _optionPath() {
        return 'font';
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
    DxoFontVectorMapComponent
  ],
  exports: [
    DxoFontVectorMapComponent
  ],
})
export class DxoFontVectorMapModule { }
