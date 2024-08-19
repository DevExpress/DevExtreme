/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Output,
    EventEmitter
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFileUploaderOptions } from './base/file-uploader-options';


@Component({
    selector: 'dxo-file-uploader-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'abortUpload',
        'accept',
        'accessKey',
        'activeStateEnabled',
        'allowCanceling',
        'allowedFileExtensions',
        'chunkSize',
        'dialogTrigger',
        'disabled',
        'dropZone',
        'elementAttr',
        'focusStateEnabled',
        'height',
        'hint',
        'hoverStateEnabled',
        'inputAttr',
        'invalidFileExtensionMessage',
        'invalidMaxFileSizeMessage',
        'invalidMinFileSizeMessage',
        'isDirty',
        'isValid',
        'labelText',
        'maxFileSize',
        'minFileSize',
        'multiple',
        'name',
        'onBeforeSend',
        'onContentReady',
        'onDisposing',
        'onDropZoneEnter',
        'onDropZoneLeave',
        'onFilesUploaded',
        'onInitialized',
        'onOptionChanged',
        'onProgress',
        'onUploadAborted',
        'onUploaded',
        'onUploadError',
        'onUploadStarted',
        'onValueChanged',
        'progress',
        'readOnly',
        'readyToUploadMessage',
        'rtlEnabled',
        'selectButtonText',
        'showFileList',
        'tabIndex',
        'uploadAbortedMessage',
        'uploadButtonText',
        'uploadChunk',
        'uploadCustomData',
        'uploadedMessage',
        'uploadFailedMessage',
        'uploadFile',
        'uploadHeaders',
        'uploadMethod',
        'uploadMode',
        'uploadUrl',
        'validationError',
        'validationErrors',
        'validationStatus',
        'value',
        'visible',
        'width'
    ]
})
export class DxoFileUploaderOptionsComponent extends DxoFileUploaderOptions implements OnDestroy, OnInit  {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<any>>;
    protected get _optionPath() {
        return 'fileUploaderOptions';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'valueChange' }
        ]);

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
    DxoFileUploaderOptionsComponent
  ],
  exports: [
    DxoFileUploaderOptionsComponent
  ],
})
export class DxoFileUploaderOptionsModule { }
