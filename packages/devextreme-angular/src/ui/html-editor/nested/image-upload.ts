/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { dxFileUploaderOptions } from 'devextreme/ui/file_uploader';
import { dxHtmlEditorImageUploadTabItem, HtmlEditorImageUploadMode, HtmlEditorImageUploadTab } from 'devextreme/ui/html_editor';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiTabComponent } from './tab-dxi';


@Component({
    selector: 'dxo-image-upload',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoImageUploadComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fileUploaderOptions(): dxFileUploaderOptions {
        return this._getOption('fileUploaderOptions');
    }
    set fileUploaderOptions(value: dxFileUploaderOptions) {
        this._setOption('fileUploaderOptions', value);
    }

    @Input()
    get fileUploadMode(): HtmlEditorImageUploadMode {
        return this._getOption('fileUploadMode');
    }
    set fileUploadMode(value: HtmlEditorImageUploadMode) {
        this._setOption('fileUploadMode', value);
    }

    @Input()
    get tabs(): Array<dxHtmlEditorImageUploadTabItem | HtmlEditorImageUploadTab> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<dxHtmlEditorImageUploadTabItem | HtmlEditorImageUploadTab>) {
        this._setOption('tabs', value);
    }

    @Input()
    get uploadDirectory(): string | undefined {
        return this._getOption('uploadDirectory');
    }
    set uploadDirectory(value: string | undefined) {
        this._setOption('uploadDirectory', value);
    }

    @Input()
    get uploadUrl(): string | undefined {
        return this._getOption('uploadUrl');
    }
    set uploadUrl(value: string | undefined) {
        this._setOption('uploadUrl', value);
    }


    protected get _optionPath() {
        return 'imageUpload';
    }


    @ContentChildren(forwardRef(() => DxiTabComponent))
    get tabsChildren(): QueryList<DxiTabComponent> {
        return this._getOption('tabs');
    }
    set tabsChildren(value) {
        this.setChildren('tabs', value);
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
    DxoImageUploadComponent
  ],
  exports: [
    DxoImageUploadComponent
  ],
})
export class DxoImageUploadModule { }
