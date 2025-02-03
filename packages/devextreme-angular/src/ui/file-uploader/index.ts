/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    forwardRef,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';


import UploadInfo from 'devextreme/file_management/upload_info';
import { BeforeSendEvent, ContentReadyEvent, DisposingEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, InitializedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, ValueChangedEvent, UploadHttpMethod, FileUploadMode } from 'devextreme/ui/file_uploader';
import { ValidationStatus } from 'devextreme/common';

import DxFileUploader from 'devextreme/ui/file_uploader';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';







const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxFileUploaderComponent),
    multi: true
};
/**
 * [descr:dxFileUploader]

 */
@Component({
    selector: 'dx-file-uploader',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxFileUploaderComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxFileUploader = null;

    /**
     * [descr:dxFileUploaderOptions.abortUpload]
    
     */
    @Input()
    get abortUpload(): ((file: any, uploadInfo?: UploadInfo) => any) {
        return this._getOption('abortUpload');
    }
    set abortUpload(value: ((file: any, uploadInfo?: UploadInfo) => any)) {
        this._setOption('abortUpload', value);
    }


    /**
     * [descr:dxFileUploaderOptions.accept]
    
     */
    @Input()
    get accept(): string {
        return this._getOption('accept');
    }
    set accept(value: string) {
        this._setOption('accept', value);
    }


    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxFileUploaderOptions.allowCanceling]
    
     */
    @Input()
    get allowCanceling(): boolean {
        return this._getOption('allowCanceling');
    }
    set allowCanceling(value: boolean) {
        this._setOption('allowCanceling', value);
    }


    /**
     * [descr:dxFileUploaderOptions.allowedFileExtensions]
    
     */
    @Input()
    get allowedFileExtensions(): Array<string> {
        return this._getOption('allowedFileExtensions');
    }
    set allowedFileExtensions(value: Array<string>) {
        this._setOption('allowedFileExtensions', value);
    }


    /**
     * [descr:dxFileUploaderOptions.chunkSize]
    
     */
    @Input()
    get chunkSize(): number {
        return this._getOption('chunkSize');
    }
    set chunkSize(value: number) {
        this._setOption('chunkSize', value);
    }


    /**
     * [descr:dxFileUploaderOptions.dialogTrigger]
    
     */
    @Input()
    get dialogTrigger(): any | string | undefined {
        return this._getOption('dialogTrigger');
    }
    set dialogTrigger(value: any | string | undefined) {
        this._setOption('dialogTrigger', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:dxFileUploaderOptions.dropZone]
    
     */
    @Input()
    get dropZone(): any | string | undefined {
        return this._getOption('dropZone');
    }
    set dropZone(value: any | string | undefined) {
        this._setOption('dropZone', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxFileUploaderOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    /**
     * [descr:dxFileUploaderOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxFileUploaderOptions.inputAttr]
    
     */
    @Input()
    get inputAttr(): any {
        return this._getOption('inputAttr');
    }
    set inputAttr(value: any) {
        this._setOption('inputAttr', value);
    }


    /**
     * [descr:dxFileUploaderOptions.invalidFileExtensionMessage]
    
     */
    @Input()
    get invalidFileExtensionMessage(): string {
        return this._getOption('invalidFileExtensionMessage');
    }
    set invalidFileExtensionMessage(value: string) {
        this._setOption('invalidFileExtensionMessage', value);
    }


    /**
     * [descr:dxFileUploaderOptions.invalidMaxFileSizeMessage]
    
     */
    @Input()
    get invalidMaxFileSizeMessage(): string {
        return this._getOption('invalidMaxFileSizeMessage');
    }
    set invalidMaxFileSizeMessage(value: string) {
        this._setOption('invalidMaxFileSizeMessage', value);
    }


    /**
     * [descr:dxFileUploaderOptions.invalidMinFileSizeMessage]
    
     */
    @Input()
    get invalidMinFileSizeMessage(): string {
        return this._getOption('invalidMinFileSizeMessage');
    }
    set invalidMinFileSizeMessage(value: string) {
        this._setOption('invalidMinFileSizeMessage', value);
    }


    /**
     * [descr:EditorOptions.isDirty]
    
     */
    @Input()
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }


    /**
     * [descr:EditorOptions.isValid]
    
     */
    @Input()
    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }


    /**
     * [descr:dxFileUploaderOptions.labelText]
    
     */
    @Input()
    get labelText(): string {
        return this._getOption('labelText');
    }
    set labelText(value: string) {
        this._setOption('labelText', value);
    }


    /**
     * [descr:dxFileUploaderOptions.maxFileSize]
    
     */
    @Input()
    get maxFileSize(): number {
        return this._getOption('maxFileSize');
    }
    set maxFileSize(value: number) {
        this._setOption('maxFileSize', value);
    }


    /**
     * [descr:dxFileUploaderOptions.minFileSize]
    
     */
    @Input()
    get minFileSize(): number {
        return this._getOption('minFileSize');
    }
    set minFileSize(value: number) {
        this._setOption('minFileSize', value);
    }


    /**
     * [descr:dxFileUploaderOptions.multiple]
    
     */
    @Input()
    get multiple(): boolean {
        return this._getOption('multiple');
    }
    set multiple(value: boolean) {
        this._setOption('multiple', value);
    }


    /**
     * [descr:dxFileUploaderOptions.name]
    
     */
    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    /**
     * [descr:dxFileUploaderOptions.progress]
    
     */
    @Input()
    get progress(): number {
        return this._getOption('progress');
    }
    set progress(value: number) {
        this._setOption('progress', value);
    }


    /**
     * [descr:EditorOptions.readOnly]
    
     */
    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }


    /**
     * [descr:dxFileUploaderOptions.readyToUploadMessage]
    
     */
    @Input()
    get readyToUploadMessage(): string {
        return this._getOption('readyToUploadMessage');
    }
    set readyToUploadMessage(value: string) {
        this._setOption('readyToUploadMessage', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxFileUploaderOptions.selectButtonText]
    
     */
    @Input()
    get selectButtonText(): string {
        return this._getOption('selectButtonText');
    }
    set selectButtonText(value: string) {
        this._setOption('selectButtonText', value);
    }


    /**
     * [descr:dxFileUploaderOptions.showFileList]
    
     */
    @Input()
    get showFileList(): boolean {
        return this._getOption('showFileList');
    }
    set showFileList(value: boolean) {
        this._setOption('showFileList', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadAbortedMessage]
    
     */
    @Input()
    get uploadAbortedMessage(): string {
        return this._getOption('uploadAbortedMessage');
    }
    set uploadAbortedMessage(value: string) {
        this._setOption('uploadAbortedMessage', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadButtonText]
    
     */
    @Input()
    get uploadButtonText(): string {
        return this._getOption('uploadButtonText');
    }
    set uploadButtonText(value: string) {
        this._setOption('uploadButtonText', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadChunk]
    
     */
    @Input()
    get uploadChunk(): ((file: any, uploadInfo: UploadInfo) => any) {
        return this._getOption('uploadChunk');
    }
    set uploadChunk(value: ((file: any, uploadInfo: UploadInfo) => any)) {
        this._setOption('uploadChunk', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadCustomData]
    
     */
    @Input()
    get uploadCustomData(): any {
        return this._getOption('uploadCustomData');
    }
    set uploadCustomData(value: any) {
        this._setOption('uploadCustomData', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadedMessage]
    
     */
    @Input()
    get uploadedMessage(): string {
        return this._getOption('uploadedMessage');
    }
    set uploadedMessage(value: string) {
        this._setOption('uploadedMessage', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadFailedMessage]
    
     */
    @Input()
    get uploadFailedMessage(): string {
        return this._getOption('uploadFailedMessage');
    }
    set uploadFailedMessage(value: string) {
        this._setOption('uploadFailedMessage', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadFile]
    
     */
    @Input()
    get uploadFile(): ((file: any, progressCallback: Function) => any) {
        return this._getOption('uploadFile');
    }
    set uploadFile(value: ((file: any, progressCallback: Function) => any)) {
        this._setOption('uploadFile', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadHeaders]
    
     */
    @Input()
    get uploadHeaders(): any {
        return this._getOption('uploadHeaders');
    }
    set uploadHeaders(value: any) {
        this._setOption('uploadHeaders', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadMethod]
    
     */
    @Input()
    get uploadMethod(): UploadHttpMethod {
        return this._getOption('uploadMethod');
    }
    set uploadMethod(value: UploadHttpMethod) {
        this._setOption('uploadMethod', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadMode]
    
     */
    @Input()
    get uploadMode(): FileUploadMode {
        return this._getOption('uploadMode');
    }
    set uploadMode(value: FileUploadMode) {
        this._setOption('uploadMode', value);
    }


    /**
     * [descr:dxFileUploaderOptions.uploadUrl]
    
     */
    @Input()
    get uploadUrl(): string {
        return this._getOption('uploadUrl');
    }
    set uploadUrl(value: string) {
        this._setOption('uploadUrl', value);
    }


    /**
     * [descr:EditorOptions.validationError]
    
     */
    @Input()
    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }


    /**
     * [descr:EditorOptions.validationErrors]
    
     */
    @Input()
    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }


    /**
     * [descr:EditorOptions.validationStatus]
    
     */
    @Input()
    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }


    /**
     * [descr:dxFileUploaderOptions.value]
    
     */
    @Input()
    get value(): Array<any> {
        return this._getOption('value');
    }
    set value(value: Array<any>) {
        this._setOption('value', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxFileUploaderOptions.onBeforeSend]
    
    
     */
    @Output() onBeforeSend: EventEmitter<BeforeSendEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onDropZoneEnter]
    
    
     */
    @Output() onDropZoneEnter: EventEmitter<DropZoneEnterEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onDropZoneLeave]
    
    
     */
    @Output() onDropZoneLeave: EventEmitter<DropZoneLeaveEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onFilesUploaded]
    
    
     */
    @Output() onFilesUploaded: EventEmitter<FilesUploadedEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onProgress]
    
    
     */
    @Output() onProgress: EventEmitter<ProgressEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onUploadAborted]
    
    
     */
    @Output() onUploadAborted: EventEmitter<UploadAbortedEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onUploaded]
    
    
     */
    @Output() onUploaded: EventEmitter<UploadedEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onUploadError]
    
    
     */
    @Output() onUploadError: EventEmitter<UploadErrorEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onUploadStarted]
    
    
     */
    @Output() onUploadStarted: EventEmitter<UploadStartedEvent>;

    /**
    
     * [descr:dxFileUploaderOptions.onValueChanged]
    
    
     */
    @Output() onValueChanged: EventEmitter<ValueChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() abortUploadChange: EventEmitter<((file: any, uploadInfo?: UploadInfo) => any)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() acceptChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowCancelingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowedFileExtensionsChange: EventEmitter<Array<string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() chunkSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dialogTriggerChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropZoneChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() inputAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() invalidFileExtensionMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() invalidMaxFileSizeMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() invalidMinFileSizeMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() isDirtyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() isValidChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxFileSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minFileSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() multipleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() progressChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() readOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() readyToUploadMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showFileListChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadAbortedMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadButtonTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadChunkChange: EventEmitter<((file: any, uploadInfo: UploadInfo) => any)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadCustomDataChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadedMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadFailedMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadFileChange: EventEmitter<((file: any, progressCallback: Function) => any)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadHeadersChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadMethodChange: EventEmitter<UploadHttpMethod>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadModeChange: EventEmitter<FileUploadMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadUrlChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationErrorChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationErrorsChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationStatusChange: EventEmitter<ValidationStatus>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};






    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

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

    protected _createInstance(element, options) {

        return new DxFileUploader(element, options);
    }


    writeValue(value: any): void {
        this.eventHelper.lockedValueChangeEvent = true;
        this.value = value;
        this.eventHelper.lockedValueChangeEvent = false;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnChange(fn: (_: any) => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }

    _createWidget(element: any) {
        super._createWidget(element);
        this.instance.on('focusOut', (e) => {
            this.eventHelper.fireNgEvent('onBlur', [e]);
        });
    }

    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('allowedFileExtensions', changes);
        this.setupChanges('validationErrors', changes);
        this.setupChanges('value', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
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

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
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
})
export class DxFileUploaderModule { }

import type * as DxFileUploaderTypes from "devextreme/ui/file_uploader_types";
export { DxFileUploaderTypes };


