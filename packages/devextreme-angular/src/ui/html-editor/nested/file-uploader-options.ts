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




import UploadInfo from 'devextreme/file_management/upload_info';
import { BeforeSendEvent, ContentReadyEvent, DisposingEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, InitializedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, ValueChangedEvent } from 'devextreme/ui/file_uploader';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-html-editor-file-uploader-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHtmlEditorFileUploaderOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get abortUpload(): ((file: any, uploadInfo?: UploadInfo) => any) {
        return this._getOption('abortUpload');
    }
    set abortUpload(value: ((file: any, uploadInfo?: UploadInfo) => any)) {
        this._setOption('abortUpload', value);
    }

    @Input()
    get accept(): string {
        return this._getOption('accept');
    }
    set accept(value: string) {
        this._setOption('accept', value);
    }

    @Input()
    get accessKey(): string {
        return this._getOption('accessKey');
    }
    set accessKey(value: string) {
        this._setOption('accessKey', value);
    }

    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    @Input()
    get allowCanceling(): boolean {
        return this._getOption('allowCanceling');
    }
    set allowCanceling(value: boolean) {
        this._setOption('allowCanceling', value);
    }

    @Input()
    get allowedFileExtensions(): Array<string> {
        return this._getOption('allowedFileExtensions');
    }
    set allowedFileExtensions(value: Array<string>) {
        this._setOption('allowedFileExtensions', value);
    }

    @Input()
    get bindingOptions(): Record<string, any> {
        return this._getOption('bindingOptions');
    }
    set bindingOptions(value: Record<string, any>) {
        this._setOption('bindingOptions', value);
    }

    @Input()
    get chunkSize(): number {
        return this._getOption('chunkSize');
    }
    set chunkSize(value: number) {
        this._setOption('chunkSize', value);
    }

    @Input()
    get dialogTrigger(): any | string {
        return this._getOption('dialogTrigger');
    }
    set dialogTrigger(value: any | string) {
        this._setOption('dialogTrigger', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get dropZone(): any | string {
        return this._getOption('dropZone');
    }
    set dropZone(value: any | string) {
        this._setOption('dropZone', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }

    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    @Input()
    get inputAttr(): any {
        return this._getOption('inputAttr');
    }
    set inputAttr(value: any) {
        this._setOption('inputAttr', value);
    }

    @Input()
    get invalidFileExtensionMessage(): string {
        return this._getOption('invalidFileExtensionMessage');
    }
    set invalidFileExtensionMessage(value: string) {
        this._setOption('invalidFileExtensionMessage', value);
    }

    @Input()
    get invalidMaxFileSizeMessage(): string {
        return this._getOption('invalidMaxFileSizeMessage');
    }
    set invalidMaxFileSizeMessage(value: string) {
        this._setOption('invalidMaxFileSizeMessage', value);
    }

    @Input()
    get invalidMinFileSizeMessage(): string {
        return this._getOption('invalidMinFileSizeMessage');
    }
    set invalidMinFileSizeMessage(value: string) {
        this._setOption('invalidMinFileSizeMessage', value);
    }

    @Input()
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    @Input()
    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }

    @Input()
    get labelText(): string {
        return this._getOption('labelText');
    }
    set labelText(value: string) {
        this._setOption('labelText', value);
    }

    @Input()
    get maxFileSize(): number {
        return this._getOption('maxFileSize');
    }
    set maxFileSize(value: number) {
        this._setOption('maxFileSize', value);
    }

    @Input()
    get minFileSize(): number {
        return this._getOption('minFileSize');
    }
    set minFileSize(value: number) {
        this._setOption('minFileSize', value);
    }

    @Input()
    get multiple(): boolean {
        return this._getOption('multiple');
    }
    set multiple(value: boolean) {
        this._setOption('multiple', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get onBeforeSend(): ((e: BeforeSendEvent) => void) {
        return this._getOption('onBeforeSend');
    }
    set onBeforeSend(value: ((e: BeforeSendEvent) => void)) {
        this._setOption('onBeforeSend', value);
    }

    @Input()
    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onDropZoneEnter(): ((e: DropZoneEnterEvent) => void) {
        return this._getOption('onDropZoneEnter');
    }
    set onDropZoneEnter(value: ((e: DropZoneEnterEvent) => void)) {
        this._setOption('onDropZoneEnter', value);
    }

    @Input()
    get onDropZoneLeave(): ((e: DropZoneLeaveEvent) => void) {
        return this._getOption('onDropZoneLeave');
    }
    set onDropZoneLeave(value: ((e: DropZoneLeaveEvent) => void)) {
        this._setOption('onDropZoneLeave', value);
    }

    @Input()
    get onFilesUploaded(): ((e: FilesUploadedEvent) => void) {
        return this._getOption('onFilesUploaded');
    }
    set onFilesUploaded(value: ((e: FilesUploadedEvent) => void)) {
        this._setOption('onFilesUploaded', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onProgress(): ((e: ProgressEvent) => void) {
        return this._getOption('onProgress');
    }
    set onProgress(value: ((e: ProgressEvent) => void)) {
        this._setOption('onProgress', value);
    }

    @Input()
    get onUploadAborted(): ((e: UploadAbortedEvent) => void) {
        return this._getOption('onUploadAborted');
    }
    set onUploadAborted(value: ((e: UploadAbortedEvent) => void)) {
        this._setOption('onUploadAborted', value);
    }

    @Input()
    get onUploaded(): ((e: UploadedEvent) => void) {
        return this._getOption('onUploaded');
    }
    set onUploaded(value: ((e: UploadedEvent) => void)) {
        this._setOption('onUploaded', value);
    }

    @Input()
    get onUploadError(): ((e: UploadErrorEvent) => void) {
        return this._getOption('onUploadError');
    }
    set onUploadError(value: ((e: UploadErrorEvent) => void)) {
        this._setOption('onUploadError', value);
    }

    @Input()
    get onUploadStarted(): ((e: UploadStartedEvent) => void) {
        return this._getOption('onUploadStarted');
    }
    set onUploadStarted(value: ((e: UploadStartedEvent) => void)) {
        this._setOption('onUploadStarted', value);
    }

    @Input()
    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    @Input()
    get progress(): number {
        return this._getOption('progress');
    }
    set progress(value: number) {
        this._setOption('progress', value);
    }

    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    @Input()
    get readyToUploadMessage(): string {
        return this._getOption('readyToUploadMessage');
    }
    set readyToUploadMessage(value: string) {
        this._setOption('readyToUploadMessage', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get selectButtonText(): string {
        return this._getOption('selectButtonText');
    }
    set selectButtonText(value: string) {
        this._setOption('selectButtonText', value);
    }

    @Input()
    get showFileList(): boolean {
        return this._getOption('showFileList');
    }
    set showFileList(value: boolean) {
        this._setOption('showFileList', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get uploadAbortedMessage(): string {
        return this._getOption('uploadAbortedMessage');
    }
    set uploadAbortedMessage(value: string) {
        this._setOption('uploadAbortedMessage', value);
    }

    @Input()
    get uploadButtonText(): string {
        return this._getOption('uploadButtonText');
    }
    set uploadButtonText(value: string) {
        this._setOption('uploadButtonText', value);
    }

    @Input()
    get uploadChunk(): ((file: any, uploadInfo: UploadInfo) => any) {
        return this._getOption('uploadChunk');
    }
    set uploadChunk(value: ((file: any, uploadInfo: UploadInfo) => any)) {
        this._setOption('uploadChunk', value);
    }

    @Input()
    get uploadCustomData(): any {
        return this._getOption('uploadCustomData');
    }
    set uploadCustomData(value: any) {
        this._setOption('uploadCustomData', value);
    }

    @Input()
    get uploadedMessage(): string {
        return this._getOption('uploadedMessage');
    }
    set uploadedMessage(value: string) {
        this._setOption('uploadedMessage', value);
    }

    @Input()
    get uploadFailedMessage(): string {
        return this._getOption('uploadFailedMessage');
    }
    set uploadFailedMessage(value: string) {
        this._setOption('uploadFailedMessage', value);
    }

    @Input()
    get uploadFile(): ((file: any, progressCallback: (() => void)) => any) {
        return this._getOption('uploadFile');
    }
    set uploadFile(value: ((file: any, progressCallback: (() => void)) => any)) {
        this._setOption('uploadFile', value);
    }

    @Input()
    get uploadHeaders(): any {
        return this._getOption('uploadHeaders');
    }
    set uploadHeaders(value: any) {
        this._setOption('uploadHeaders', value);
    }

    @Input()
    get uploadMethod(): "POST" | "PUT" {
        return this._getOption('uploadMethod');
    }
    set uploadMethod(value: "POST" | "PUT") {
        this._setOption('uploadMethod', value);
    }

    @Input()
    get uploadMode(): "instantly" | "useButtons" | "useForm" {
        return this._getOption('uploadMode');
    }
    set uploadMode(value: "instantly" | "useButtons" | "useForm") {
        this._setOption('uploadMode', value);
    }

    @Input()
    get uploadUrl(): string {
        return this._getOption('uploadUrl');
    }
    set uploadUrl(value: string) {
        this._setOption('uploadUrl', value);
    }

    @Input()
    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }

    @Input()
    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }

    @Input()
    get validationStatus(): "valid" | "invalid" | "pending" {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: "valid" | "invalid" | "pending") {
        this._setOption('validationStatus', value);
    }

    @Input()
    get value(): Array<any> {
        return this._getOption('value');
    }
    set value(value: Array<any>) {
        this._setOption('value', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'fileUploaderOptions';
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
    DxoHtmlEditorFileUploaderOptionsComponent
  ],
  exports: [
    DxoHtmlEditorFileUploaderOptionsComponent
  ],
})
export class DxoHtmlEditorFileUploaderOptionsModule { }
