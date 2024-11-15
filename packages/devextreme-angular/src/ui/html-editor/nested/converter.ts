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
    selector: 'dxo-html-editor-converter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHtmlEditorConverterComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fromHtml(): ((value: string) => string) {
        return this._getOption('fromHtml');
    }
    set fromHtml(value: ((value: string) => string)) {
        this._setOption('fromHtml', value);
    }

    @Input()
    get toHtml(): ((value: string) => string) {
        return this._getOption('toHtml');
    }
    set toHtml(value: ((value: string) => string)) {
        this._setOption('toHtml', value);
    }


    protected get _optionPath() {
        return 'converter';
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
    DxoHtmlEditorConverterComponent
  ],
  exports: [
    DxoHtmlEditorConverterComponent
  ],
})
export class DxoHtmlEditorConverterModule { }
