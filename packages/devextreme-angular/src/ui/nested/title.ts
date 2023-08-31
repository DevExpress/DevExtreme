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
    selector: 'dxo-title',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTitleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get horizontalAlignment(): string | undefined {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: string | undefined) {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get margin(): { bottom?: number, left?: number, right?: number, top?: number } | number {
        return this._getOption('margin');
    }
    set margin(value: { bottom?: number, left?: number, right?: number, top?: number } | number) {
        this._setOption('margin', value);
    }

    @Input()
    get placeholderSize(): number | undefined {
        return this._getOption('placeholderSize');
    }
    set placeholderSize(value: number | undefined) {
        this._setOption('placeholderSize', value);
    }

    @Input()
    get subtitle(): string | { font?: Font, offset?: number, text?: string } | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string } {
        return this._getOption('subtitle');
    }
    set subtitle(value: string | { font?: Font, offset?: number, text?: string } | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }) {
        this._setOption('subtitle', value);
    }

    @Input()
    get text(): string | undefined {
        return this._getOption('text');
    }
    set text(value: string | undefined) {
        this._setOption('text', value);
    }

    @Input()
    get verticalAlignment(): string {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: string) {
        this._setOption('verticalAlignment', value);
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

    @Input()
    get alignment(): string {
        return this._getOption('alignment');
    }
    set alignment(value: string) {
        this._setOption('alignment', value);
    }


    protected get _optionPath() {
        return 'title';
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
    DxoTitleComponent
  ],
  exports: [
    DxoTitleComponent
  ],
})
export class DxoTitleModule { }
