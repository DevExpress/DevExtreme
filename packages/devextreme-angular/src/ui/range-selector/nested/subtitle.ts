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




import { Font, TextOverflow, WordWrap } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-subtitle',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorSubtitleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get textOverflow(): TextOverflow {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: TextOverflow) {
        this._setOption('textOverflow', value);
    }

    @Input()
    get wordWrap(): WordWrap {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: WordWrap) {
        this._setOption('wordWrap', value);
    }


    protected get _optionPath() {
        return 'subtitle';
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
    DxoRangeSelectorSubtitleComponent
  ],
  exports: [
    DxoRangeSelectorSubtitleComponent
  ],
})
export class DxoRangeSelectorSubtitleModule { }
