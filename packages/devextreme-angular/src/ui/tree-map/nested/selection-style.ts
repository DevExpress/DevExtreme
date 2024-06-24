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
    selector: 'dxo-selection-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSelectionStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string, width?: number | undefined } {
        return this._getOption('border');
    }
    set border(value: { color?: string, width?: number | undefined }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): string | undefined {
        return this._getOption('color');
    }
    set color(value: string | undefined) {
        this._setOption('color', value);
    }


    protected get _optionPath() {
        return 'selectionStyle';
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
    DxoSelectionStyleComponent
  ],
  exports: [
    DxoSelectionStyleComponent
  ],
})
export class DxoSelectionStyleModule { }
