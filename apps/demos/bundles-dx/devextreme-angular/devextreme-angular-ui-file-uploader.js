System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/file_uploader', '@angular/forms', './devextreme-angular-core.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, NgModule, DxFileUploader, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            forwardRef = module.forwardRef;
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            HostListener = module.HostListener;
            NgModule = module.NgModule;
        }, function (module) {
            DxFileUploader = module.default;
        }, function (module) {
            NG_VALUE_ACCESSOR = module.NG_VALUE_ACCESSOR;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DxFileUploaderComponent),
                multi: true
            };
            /**
             * The FileUploader UI component enables an end user to upload files to the server. An end user can select files in the file explorer or drag and drop files to the FileUploader area on the page.

             */
            class DxFileUploaderComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * A function that cancels the file upload.
                
                 */
                get abortUpload() {
                    return this._getOption('abortUpload');
                }
                set abortUpload(value) {
                    this._setOption('abortUpload', value);
                }
                /**
                 * Specifies a file type or several types accepted by the UI component.
                
                 */
                get accept() {
                    return this._getOption('accept');
                }
                set accept(value) {
                    this._setOption('accept', value);
                }
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component changes its visual state as a result of user interaction.
                
                 */
                get activeStateEnabled() {
                    return this._getOption('activeStateEnabled');
                }
                set activeStateEnabled(value) {
                    this._setOption('activeStateEnabled', value);
                }
                /**
                 * Specifies if an end user can remove a file from the selection and interrupt uploading.
                
                 */
                get allowCanceling() {
                    return this._getOption('allowCanceling');
                }
                set allowCanceling(value) {
                    this._setOption('allowCanceling', value);
                }
                /**
                 * Restricts file extensions that can be uploaded to the server.
                
                 */
                get allowedFileExtensions() {
                    return this._getOption('allowedFileExtensions');
                }
                set allowedFileExtensions(value) {
                    this._setOption('allowedFileExtensions', value);
                }
                /**
                 * Specifies the chunk size in bytes. Applies only if uploadMode is &apos;instantly&apos; or &apos;useButtons&apos;. Requires a server that can process file chunks.
                
                 */
                get chunkSize() {
                    return this._getOption('chunkSize');
                }
                set chunkSize(value) {
                    this._setOption('chunkSize', value);
                }
                /**
                 * Specifies the HTML element which invokes the file upload dialog.
                
                 */
                get dialogTrigger() {
                    return this._getOption('dialogTrigger');
                }
                set dialogTrigger(value) {
                    this._setOption('dialogTrigger', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Specifies the HTML element in which users can drag and drop files for upload.
                
                 */
                get dropZone() {
                    return this._getOption('dropZone');
                }
                set dropZone(value) {
                    this._setOption('dropZone', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies whether the FileUploader component changes the state of all its buttons when users hover over them.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Specifies the attributes to be passed on to the underlying `` element of the `file` type.
                
                 */
                get inputAttr() {
                    return this._getOption('inputAttr');
                }
                set inputAttr(value) {
                    this._setOption('inputAttr', value);
                }
                /**
                 * The text displayed when the extension of the file being uploaded is not an allowed file extension.
                
                 */
                get invalidFileExtensionMessage() {
                    return this._getOption('invalidFileExtensionMessage');
                }
                set invalidFileExtensionMessage(value) {
                    this._setOption('invalidFileExtensionMessage', value);
                }
                /**
                 * The text displayed when the size of the file being uploaded is greater than the maxFileSize.
                
                 */
                get invalidMaxFileSizeMessage() {
                    return this._getOption('invalidMaxFileSizeMessage');
                }
                set invalidMaxFileSizeMessage(value) {
                    this._setOption('invalidMaxFileSizeMessage', value);
                }
                /**
                 * The text displayed when the size of the file being uploaded is less than the minFileSize.
                
                 */
                get invalidMinFileSizeMessage() {
                    return this._getOption('invalidMinFileSizeMessage');
                }
                set invalidMinFileSizeMessage(value) {
                    this._setOption('invalidMinFileSizeMessage', value);
                }
                /**
                 * Specifies whether the component&apos;s current value differs from the initial value.
                
                 */
                get isDirty() {
                    return this._getOption('isDirty');
                }
                set isDirty(value) {
                    this._setOption('isDirty', value);
                }
                /**
                 * Specifies or indicates whether the editor&apos;s value is valid.
                
                 */
                get isValid() {
                    return this._getOption('isValid');
                }
                set isValid(value) {
                    this._setOption('isValid', value);
                }
                /**
                 * Specifies the text displayed on the area to which an end user can drop a file.
                
                 */
                get labelText() {
                    return this._getOption('labelText');
                }
                set labelText(value) {
                    this._setOption('labelText', value);
                }
                /**
                 * Specifies the maximum file size (in bytes) allowed for uploading. Applies only if uploadMode is &apos;instantly&apos; or &apos;useButtons&apos;.
                
                 */
                get maxFileSize() {
                    return this._getOption('maxFileSize');
                }
                set maxFileSize(value) {
                    this._setOption('maxFileSize', value);
                }
                /**
                 * Specifies the minimum file size (in bytes) allowed for uploading. Applies only if uploadMode is &apos;instantly&apos; or &apos;useButtons&apos;.
                
                 */
                get minFileSize() {
                    return this._getOption('minFileSize');
                }
                set minFileSize(value) {
                    this._setOption('minFileSize', value);
                }
                /**
                 * Specifies whether the UI component enables an end user to select a single file or multiple files.
                
                 */
                get multiple() {
                    return this._getOption('multiple');
                }
                set multiple(value) {
                    this._setOption('multiple', value);
                }
                /**
                 * Specifies the value passed to the name attribute of the underlying input element. Required to access uploaded files on the server.
                
                 */
                get name() {
                    return this._getOption('name');
                }
                set name(value) {
                    this._setOption('name', value);
                }
                /**
                 * Gets the current progress in percentages.
                
                 */
                get progress() {
                    return this._getOption('progress');
                }
                set progress(value) {
                    this._setOption('progress', value);
                }
                /**
                 * Specifies whether the editor is read-only.
                
                 */
                get readOnly() {
                    return this._getOption('readOnly');
                }
                set readOnly(value) {
                    this._setOption('readOnly', value);
                }
                /**
                 * The message displayed by the UI component when it is ready to upload the specified files.
                
                 */
                get readyToUploadMessage() {
                    return this._getOption('readyToUploadMessage');
                }
                set readyToUploadMessage(value) {
                    this._setOption('readyToUploadMessage', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * The text displayed on the button that opens the file browser.
                
                 */
                get selectButtonText() {
                    return this._getOption('selectButtonText');
                }
                set selectButtonText(value) {
                    this._setOption('selectButtonText', value);
                }
                /**
                 * Specifies whether or not the UI component displays the list of selected files.
                
                 */
                get showFileList() {
                    return this._getOption('showFileList');
                }
                set showFileList(value) {
                    this._setOption('showFileList', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * The message displayed by the UI component when the file upload is cancelled.
                
                 */
                get uploadAbortedMessage() {
                    return this._getOption('uploadAbortedMessage');
                }
                set uploadAbortedMessage(value) {
                    this._setOption('uploadAbortedMessage', value);
                }
                /**
                 * The text displayed on the button that starts uploading.
                
                 */
                get uploadButtonText() {
                    return this._getOption('uploadButtonText');
                }
                set uploadButtonText(value) {
                    this._setOption('uploadButtonText', value);
                }
                /**
                 * A function that uploads a file in chunks.
                
                 */
                get uploadChunk() {
                    return this._getOption('uploadChunk');
                }
                set uploadChunk(value) {
                    this._setOption('uploadChunk', value);
                }
                /**
                 * Specifies custom data for the upload request.
                
                 */
                get uploadCustomData() {
                    return this._getOption('uploadCustomData');
                }
                set uploadCustomData(value) {
                    this._setOption('uploadCustomData', value);
                }
                /**
                 * The message displayed by the UI component when uploading is finished.
                
                 */
                get uploadedMessage() {
                    return this._getOption('uploadedMessage');
                }
                set uploadedMessage(value) {
                    this._setOption('uploadedMessage', value);
                }
                /**
                 * The message displayed by the UI component on uploading failure.
                
                 */
                get uploadFailedMessage() {
                    return this._getOption('uploadFailedMessage');
                }
                set uploadFailedMessage(value) {
                    this._setOption('uploadFailedMessage', value);
                }
                /**
                 * A function that uploads a file.
                
                 */
                get uploadFile() {
                    return this._getOption('uploadFile');
                }
                set uploadFile(value) {
                    this._setOption('uploadFile', value);
                }
                /**
                 * Specifies headers for the upload request.
                
                 */
                get uploadHeaders() {
                    return this._getOption('uploadHeaders');
                }
                set uploadHeaders(value) {
                    this._setOption('uploadHeaders', value);
                }
                /**
                 * Specifies the method for the upload request.
                
                 */
                get uploadMethod() {
                    return this._getOption('uploadMethod');
                }
                set uploadMethod(value) {
                    this._setOption('uploadMethod', value);
                }
                /**
                 * Specifies how the UI component uploads files.
                
                 */
                get uploadMode() {
                    return this._getOption('uploadMode');
                }
                set uploadMode(value) {
                    this._setOption('uploadMode', value);
                }
                /**
                 * Specifies a target Url for the upload request.
                
                 */
                get uploadUrl() {
                    return this._getOption('uploadUrl');
                }
                set uploadUrl(value) {
                    this._setOption('uploadUrl', value);
                }
                /**
                 * Information on the broken validation rule. Contains the first item from the validationErrors array.
                
                 */
                get validationError() {
                    return this._getOption('validationError');
                }
                set validationError(value) {
                    this._setOption('validationError', value);
                }
                /**
                 * An array of the validation rules that failed.
                
                 */
                get validationErrors() {
                    return this._getOption('validationErrors');
                }
                set validationErrors(value) {
                    this._setOption('validationErrors', value);
                }
                /**
                 * Indicates or specifies the current validation status.
                
                 */
                get validationStatus() {
                    return this._getOption('validationStatus');
                }
                set validationStatus(value) {
                    this._setOption('validationStatus', value);
                }
                /**
                 * Specifies a File instance representing the selected file. Read-only when uploadMode is &apos;useForm&apos;.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                
                 * A function that allows you to customize the request before it is sent to the server.
                
                
                 */
                onBeforeSend;
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when the mouse enters a drop zone while dragging a file.
                
                
                 */
                onDropZoneEnter;
                /**
                
                 * A function that is executed when the mouse leaves a drop zone as it drags a file.
                
                
                 */
                onDropZoneLeave;
                /**
                
                 * A function that is executed when the file upload process is complete.
                
                
                 */
                onFilesUploaded;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a file segment is uploaded.
                
                
                 */
                onProgress;
                /**
                
                 * A function that is executed when the file upload is aborted.
                
                
                 */
                onUploadAborted;
                /**
                
                 * A function that is executed when a file is successfully uploaded.
                
                
                 */
                onUploaded;
                /**
                
                 * A function that is executed when an error occurs during the file upload.
                
                
                 */
                onUploadError;
                /**
                
                 * A function that is executed when the file upload is started.
                
                
                 */
                onUploadStarted;
                /**
                
                 * A function that is executed when one or several files are added to or removed from the selection.
                
                
                 */
                onValueChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                abortUploadChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                acceptChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowCancelingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowedFileExtensionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                chunkSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dialogTriggerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropZoneChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                inputAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                invalidFileExtensionMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                invalidMaxFileSizeMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                invalidMinFileSizeMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                isDirtyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                isValidChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxFileSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minFileSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                multipleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                progressChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                readOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                readyToUploadMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showFileListChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadAbortedMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadChunkChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadCustomDataChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadedMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadFailedMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadFileChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadHeadersChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadMethodChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadUrlChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationErrorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationErrorsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationStatusChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                /**
                
                 * 
                
                
                 */
                onBlur;
                change(_) { }
                touched = (_) => { };
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'beforeSend', emit: 'onBeforeSend' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'dropZoneEnter', emit: 'onDropZoneEnter' },
                        { subscribe: 'dropZoneLeave', emit: 'onDropZoneLeave' },
                        { subscribe: 'filesUploaded', emit: 'onFilesUploaded' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'progress', emit: 'onProgress' },
                        { subscribe: 'uploadAborted', emit: 'onUploadAborted' },
                        { subscribe: 'uploaded', emit: 'onUploaded' },
                        { subscribe: 'uploadError', emit: 'onUploadError' },
                        { subscribe: 'uploadStarted', emit: 'onUploadStarted' },
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'abortUploadChange' },
                        { emit: 'acceptChange' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowCancelingChange' },
                        { emit: 'allowedFileExtensionsChange' },
                        { emit: 'chunkSizeChange' },
                        { emit: 'dialogTriggerChange' },
                        { emit: 'disabledChange' },
                        { emit: 'dropZoneChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'inputAttrChange' },
                        { emit: 'invalidFileExtensionMessageChange' },
                        { emit: 'invalidMaxFileSizeMessageChange' },
                        { emit: 'invalidMinFileSizeMessageChange' },
                        { emit: 'isDirtyChange' },
                        { emit: 'isValidChange' },
                        { emit: 'labelTextChange' },
                        { emit: 'maxFileSizeChange' },
                        { emit: 'minFileSizeChange' },
                        { emit: 'multipleChange' },
                        { emit: 'nameChange' },
                        { emit: 'progressChange' },
                        { emit: 'readOnlyChange' },
                        { emit: 'readyToUploadMessageChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectButtonTextChange' },
                        { emit: 'showFileListChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'uploadAbortedMessageChange' },
                        { emit: 'uploadButtonTextChange' },
                        { emit: 'uploadChunkChange' },
                        { emit: 'uploadCustomDataChange' },
                        { emit: 'uploadedMessageChange' },
                        { emit: 'uploadFailedMessageChange' },
                        { emit: 'uploadFileChange' },
                        { emit: 'uploadHeadersChange' },
                        { emit: 'uploadMethodChange' },
                        { emit: 'uploadModeChange' },
                        { emit: 'uploadUrlChange' },
                        { emit: 'validationErrorChange' },
                        { emit: 'validationErrorsChange' },
                        { emit: 'validationStatusChange' },
                        { emit: 'valueChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxFileUploader(element, options);
                }
                writeValue(value) {
                    this.eventHelper.lockedValueChangeEvent = true;
                    this.value = value;
                    this.eventHelper.lockedValueChangeEvent = false;
                }
                setDisabledState(isDisabled) {
                    this.disabled = isDisabled;
                }
                registerOnChange(fn) { this.change = fn; }
                registerOnTouched(fn) { this.touched = fn; }
                _createWidget(element) {
                    super._createWidget(element);
                    this.instance.on('focusOut', (e) => {
                        this.eventHelper.fireNgEvent('onBlur', [e]);
                    });
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('allowedFileExtensions', changes);
                    this.setupChanges('validationErrors', changes);
                    this.setupChanges('value', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('allowedFileExtensions');
                    this._idh.doCheck('validationErrors');
                    this._idh.doCheck('value');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileUploaderComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxFileUploaderComponent, selector: "dx-file-uploader", inputs: { abortUpload: "abortUpload", accept: "accept", accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowCanceling: "allowCanceling", allowedFileExtensions: "allowedFileExtensions", chunkSize: "chunkSize", dialogTrigger: "dialogTrigger", disabled: "disabled", dropZone: "dropZone", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", inputAttr: "inputAttr", invalidFileExtensionMessage: "invalidFileExtensionMessage", invalidMaxFileSizeMessage: "invalidMaxFileSizeMessage", invalidMinFileSizeMessage: "invalidMinFileSizeMessage", isDirty: "isDirty", isValid: "isValid", labelText: "labelText", maxFileSize: "maxFileSize", minFileSize: "minFileSize", multiple: "multiple", name: "name", progress: "progress", readOnly: "readOnly", readyToUploadMessage: "readyToUploadMessage", rtlEnabled: "rtlEnabled", selectButtonText: "selectButtonText", showFileList: "showFileList", tabIndex: "tabIndex", uploadAbortedMessage: "uploadAbortedMessage", uploadButtonText: "uploadButtonText", uploadChunk: "uploadChunk", uploadCustomData: "uploadCustomData", uploadedMessage: "uploadedMessage", uploadFailedMessage: "uploadFailedMessage", uploadFile: "uploadFile", uploadHeaders: "uploadHeaders", uploadMethod: "uploadMethod", uploadMode: "uploadMode", uploadUrl: "uploadUrl", validationError: "validationError", validationErrors: "validationErrors", validationStatus: "validationStatus", value: "value", visible: "visible", width: "width" }, outputs: { onBeforeSend: "onBeforeSend", onContentReady: "onContentReady", onDisposing: "onDisposing", onDropZoneEnter: "onDropZoneEnter", onDropZoneLeave: "onDropZoneLeave", onFilesUploaded: "onFilesUploaded", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onProgress: "onProgress", onUploadAborted: "onUploadAborted", onUploaded: "onUploaded", onUploadError: "onUploadError", onUploadStarted: "onUploadStarted", onValueChanged: "onValueChanged", abortUploadChange: "abortUploadChange", acceptChange: "acceptChange", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowCancelingChange: "allowCancelingChange", allowedFileExtensionsChange: "allowedFileExtensionsChange", chunkSizeChange: "chunkSizeChange", dialogTriggerChange: "dialogTriggerChange", disabledChange: "disabledChange", dropZoneChange: "dropZoneChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", inputAttrChange: "inputAttrChange", invalidFileExtensionMessageChange: "invalidFileExtensionMessageChange", invalidMaxFileSizeMessageChange: "invalidMaxFileSizeMessageChange", invalidMinFileSizeMessageChange: "invalidMinFileSizeMessageChange", isDirtyChange: "isDirtyChange", isValidChange: "isValidChange", labelTextChange: "labelTextChange", maxFileSizeChange: "maxFileSizeChange", minFileSizeChange: "minFileSizeChange", multipleChange: "multipleChange", nameChange: "nameChange", progressChange: "progressChange", readOnlyChange: "readOnlyChange", readyToUploadMessageChange: "readyToUploadMessageChange", rtlEnabledChange: "rtlEnabledChange", selectButtonTextChange: "selectButtonTextChange", showFileListChange: "showFileListChange", tabIndexChange: "tabIndexChange", uploadAbortedMessageChange: "uploadAbortedMessageChange", uploadButtonTextChange: "uploadButtonTextChange", uploadChunkChange: "uploadChunkChange", uploadCustomDataChange: "uploadCustomDataChange", uploadedMessageChange: "uploadedMessageChange", uploadFailedMessageChange: "uploadFailedMessageChange", uploadFileChange: "uploadFileChange", uploadHeadersChange: "uploadHeadersChange", uploadMethodChange: "uploadMethodChange", uploadModeChange: "uploadModeChange", uploadUrlChange: "uploadUrlChange", validationErrorChange: "validationErrorChange", validationErrorsChange: "validationErrorsChange", validationStatusChange: "validationStatusChange", valueChange: "valueChange", visibleChange: "visibleChange", widthChange: "widthChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxFileUploaderComponent", DxFileUploaderComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileUploaderComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-file-uploader',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    CUSTOM_VALUE_ACCESSOR_PROVIDER,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { abortUpload: [{
                            type: Input
                        }], accept: [{
                            type: Input
                        }], accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], allowCanceling: [{
                            type: Input
                        }], allowedFileExtensions: [{
                            type: Input
                        }], chunkSize: [{
                            type: Input
                        }], dialogTrigger: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], dropZone: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], inputAttr: [{
                            type: Input
                        }], invalidFileExtensionMessage: [{
                            type: Input
                        }], invalidMaxFileSizeMessage: [{
                            type: Input
                        }], invalidMinFileSizeMessage: [{
                            type: Input
                        }], isDirty: [{
                            type: Input
                        }], isValid: [{
                            type: Input
                        }], labelText: [{
                            type: Input
                        }], maxFileSize: [{
                            type: Input
                        }], minFileSize: [{
                            type: Input
                        }], multiple: [{
                            type: Input
                        }], name: [{
                            type: Input
                        }], progress: [{
                            type: Input
                        }], readOnly: [{
                            type: Input
                        }], readyToUploadMessage: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectButtonText: [{
                            type: Input
                        }], showFileList: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], uploadAbortedMessage: [{
                            type: Input
                        }], uploadButtonText: [{
                            type: Input
                        }], uploadChunk: [{
                            type: Input
                        }], uploadCustomData: [{
                            type: Input
                        }], uploadedMessage: [{
                            type: Input
                        }], uploadFailedMessage: [{
                            type: Input
                        }], uploadFile: [{
                            type: Input
                        }], uploadHeaders: [{
                            type: Input
                        }], uploadMethod: [{
                            type: Input
                        }], uploadMode: [{
                            type: Input
                        }], uploadUrl: [{
                            type: Input
                        }], validationError: [{
                            type: Input
                        }], validationErrors: [{
                            type: Input
                        }], validationStatus: [{
                            type: Input
                        }], value: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onBeforeSend: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onDropZoneEnter: [{
                            type: Output
                        }], onDropZoneLeave: [{
                            type: Output
                        }], onFilesUploaded: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onProgress: [{
                            type: Output
                        }], onUploadAborted: [{
                            type: Output
                        }], onUploaded: [{
                            type: Output
                        }], onUploadError: [{
                            type: Output
                        }], onUploadStarted: [{
                            type: Output
                        }], onValueChanged: [{
                            type: Output
                        }], abortUploadChange: [{
                            type: Output
                        }], acceptChange: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowCancelingChange: [{
                            type: Output
                        }], allowedFileExtensionsChange: [{
                            type: Output
                        }], chunkSizeChange: [{
                            type: Output
                        }], dialogTriggerChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], dropZoneChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], inputAttrChange: [{
                            type: Output
                        }], invalidFileExtensionMessageChange: [{
                            type: Output
                        }], invalidMaxFileSizeMessageChange: [{
                            type: Output
                        }], invalidMinFileSizeMessageChange: [{
                            type: Output
                        }], isDirtyChange: [{
                            type: Output
                        }], isValidChange: [{
                            type: Output
                        }], labelTextChange: [{
                            type: Output
                        }], maxFileSizeChange: [{
                            type: Output
                        }], minFileSizeChange: [{
                            type: Output
                        }], multipleChange: [{
                            type: Output
                        }], nameChange: [{
                            type: Output
                        }], progressChange: [{
                            type: Output
                        }], readOnlyChange: [{
                            type: Output
                        }], readyToUploadMessageChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectButtonTextChange: [{
                            type: Output
                        }], showFileListChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], uploadAbortedMessageChange: [{
                            type: Output
                        }], uploadButtonTextChange: [{
                            type: Output
                        }], uploadChunkChange: [{
                            type: Output
                        }], uploadCustomDataChange: [{
                            type: Output
                        }], uploadedMessageChange: [{
                            type: Output
                        }], uploadFailedMessageChange: [{
                            type: Output
                        }], uploadFileChange: [{
                            type: Output
                        }], uploadHeadersChange: [{
                            type: Output
                        }], uploadMethodChange: [{
                            type: Output
                        }], uploadModeChange: [{
                            type: Output
                        }], uploadUrlChange: [{
                            type: Output
                        }], validationErrorChange: [{
                            type: Output
                        }], validationErrorsChange: [{
                            type: Output
                        }], validationStatusChange: [{
                            type: Output
                        }], valueChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], onBlur: [{
                            type: Output
                        }], change: [{
                            type: HostListener,
                            args: ['valueChange', ['$event']]
                        }], touched: [{
                            type: HostListener,
                            args: ['onBlur', ['$event']]
                        }] } });
            class DxFileUploaderModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileUploaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxFileUploaderModule, declarations: [DxFileUploaderComponent], imports: [DxIntegrationModule,
                        DxTemplateModule], exports: [DxFileUploaderComponent, DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileUploaderModule, imports: [DxIntegrationModule,
                        DxTemplateModule, DxTemplateModule] });
            } exports("DxFileUploaderModule", DxFileUploaderModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileUploaderModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxFileUploaderComponent
                                ],
                                exports: [
                                    DxFileUploaderComponent,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
