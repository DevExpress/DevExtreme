/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-strip',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiStripComponent extends CollectionNestedOption {
    @Input()
    get color(): string | undefined {
        return this._getOption('color');
    }
    set color(value: string | undefined) {
        this._setOption('color', value);
    }

    @Input()
    get endValue(): Date | number | string | undefined {
        return this._getOption('endValue');
    }
    set endValue(value: Date | number | string | undefined) {
        this._setOption('endValue', value);
    }

    @Input()
    get label(): { font?: Font, horizontalAlignment?: string, text?: string | undefined, verticalAlignment?: string } | { font?: Font, text?: string | undefined } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, horizontalAlignment?: string, text?: string | undefined, verticalAlignment?: string } | { font?: Font, text?: string | undefined }) {
        this._setOption('label', value);
    }

    @Input()
    get paddingLeftRight(): number {
        return this._getOption('paddingLeftRight');
    }
    set paddingLeftRight(value: number) {
        this._setOption('paddingLeftRight', value);
    }

    @Input()
    get paddingTopBottom(): number {
        return this._getOption('paddingTopBottom');
    }
    set paddingTopBottom(value: number) {
        this._setOption('paddingTopBottom', value);
    }

    @Input()
    get startValue(): Date | number | string | undefined {
        return this._getOption('startValue');
    }
    set startValue(value: Date | number | string | undefined) {
        this._setOption('startValue', value);
    }


    protected get _optionPath() {
        return 'strips';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiStripComponent
  ],
  exports: [
    DxiStripComponent
  ],
})
export class DxiStripModule { }
