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




import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-subtitle',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSubtitleComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get textOverflow(): string {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: string) {
        this._setOption('textOverflow', value);
    }

    @Input()
    get wordWrap(): string {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: string) {
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
    DxoSubtitleComponent
  ],
  exports: [
    DxoSubtitleComponent
  ],
})
export class DxoSubtitleModule { }
