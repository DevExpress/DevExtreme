/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { dxFileUploaderOptions } from 'devextreme/ui/file_uploader';
import { HtmlEditorImageUploadMode, HtmlEditorImageUploadTab } from 'devextreme/ui/html_editor';

@Component({
    template: ''
})
export abstract class DxoHtmlEditorImageUpload extends NestedOption {
    get fileUploaderOptions(): dxFileUploaderOptions {
        return this._getOption('fileUploaderOptions');
    }
    set fileUploaderOptions(value: dxFileUploaderOptions) {
        this._setOption('fileUploaderOptions', value);
    }

    get fileUploadMode(): HtmlEditorImageUploadMode {
        return this._getOption('fileUploadMode');
    }
    set fileUploadMode(value: HtmlEditorImageUploadMode) {
        this._setOption('fileUploadMode', value);
    }

    get tabs(): Array<HtmlEditorImageUploadTab | DevExpress.ui.dxHtmlEditorImageUploadTabItem> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<HtmlEditorImageUploadTab | DevExpress.ui.dxHtmlEditorImageUploadTabItem>) {
        this._setOption('tabs', value);
    }

    get uploadDirectory(): string | undefined {
        return this._getOption('uploadDirectory');
    }
    set uploadDirectory(value: string | undefined) {
        this._setOption('uploadDirectory', value);
    }

    get uploadUrl(): string | undefined {
        return this._getOption('uploadUrl');
    }
    set uploadUrl(value: string | undefined) {
        this._setOption('uploadUrl', value);
    }
}
