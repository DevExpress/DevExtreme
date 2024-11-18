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




import { Font } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-text',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTextComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeText(): Function | undefined {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function | undefined) {
        this._setOption('customizeText', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get format(): Format | string | undefined {
        return this._getOption('format');
    }
    set format(value: Format | string | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get indent(): number {
        return this._getOption('indent');
    }
    set indent(value: number) {
        this._setOption('indent', value);
    }


    protected get _optionPath() {
        return 'text';
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
    DxoTextComponent
  ],
  exports: [
    DxoTextComponent
  ],
})
export class DxoTextModule { }
