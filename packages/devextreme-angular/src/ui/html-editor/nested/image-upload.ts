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




import { dxFileUploaderOptions } from 'devextreme/ui/file_uploader';
import { dxHtmlEditorImageUploadTabItem } from 'devextreme/ui/html_editor';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-html-editor-image-upload',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHtmlEditorImageUploadComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fileUploaderOptions(): dxFileUploaderOptions {
        return this._getOption('fileUploaderOptions');
    }
    set fileUploaderOptions(value: dxFileUploaderOptions) {
        this._setOption('fileUploaderOptions', value);
    }

    @Input()
    get fileUploadMode(): "base64" | "server" | "both" {
        return this._getOption('fileUploadMode');
    }
    set fileUploadMode(value: "base64" | "server" | "both") {
        this._setOption('fileUploadMode', value);
    }

    @Input()
    get tabs(): Array<dxHtmlEditorImageUploadTabItem | "url" | "file"> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<dxHtmlEditorImageUploadTabItem | "url" | "file">) {
        this._setOption('tabs', value);
    }

    @Input()
    get uploadDirectory(): string {
        return this._getOption('uploadDirectory');
    }
    set uploadDirectory(value: string) {
        this._setOption('uploadDirectory', value);
    }

    @Input()
    get uploadUrl(): string {
        return this._getOption('uploadUrl');
    }
    set uploadUrl(value: string) {
        this._setOption('uploadUrl', value);
    }


    protected get _optionPath() {
        return 'imageUpload';
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
    DxoHtmlEditorImageUploadComponent
  ],
  exports: [
    DxoHtmlEditorImageUploadComponent
  ],
})
export class DxoHtmlEditorImageUploadModule { }
