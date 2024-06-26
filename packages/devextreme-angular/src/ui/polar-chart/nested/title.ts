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




import { HorizontalAlignment, VerticalEdge } from 'devextreme/common';
import { Font, TextOverflow, WordWrap } from 'devextreme/common/charts';

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
    get horizontalAlignment(): HorizontalAlignment | undefined {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalAlignment | undefined) {
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
    get subtitle(): string | { font?: Font, offset?: number, text?: string } | { font?: Font, offset?: number, text?: string, textOverflow?: TextOverflow, wordWrap?: WordWrap } {
        return this._getOption('subtitle');
    }
    set subtitle(value: string | { font?: Font, offset?: number, text?: string } | { font?: Font, offset?: number, text?: string, textOverflow?: TextOverflow, wordWrap?: WordWrap }) {
        this._setOption('subtitle', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get verticalAlignment(): VerticalEdge {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: VerticalEdge) {
        this._setOption('verticalAlignment', value);
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
