/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { ValidationStatus } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { BeforeSendEvent, ContentReadyEvent, DisposingEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, FileUploadMode, InitializedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadHttpMethod, UploadStartedEvent, ValueChangedEvent } from 'devextreme/ui/file_uploader';

@Component({
    template: ''
})
export abstract class DxoFileUploaderOptions extends NestedOption {
    get abortUpload(): Function {
        return this._getOption('abortUpload');
    }
    set abortUpload(value: Function) {
        this._setOption('abortUpload', value);
    }

    get accept(): string {
        return this._getOption('accept');
    }
    set accept(value: string) {
        this._setOption('accept', value);
    }

    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    get allowCanceling(): boolean {
        return this._getOption('allowCanceling');
    }
    set allowCanceling(value: boolean) {
        this._setOption('allowCanceling', value);
    }

    get allowedFileExtensions(): Array<string> {
        return this._getOption('allowedFileExtensions');
    }
    set allowedFileExtensions(value: Array<string>) {
        this._setOption('allowedFileExtensions', value);
    }

    get chunkSize(): number {
        return this._getOption('chunkSize');
    }
    set chunkSize(value: number) {
        this._setOption('chunkSize', value);
    }

    get dialogTrigger(): UserDefinedElement | string | undefined {
        return this._getOption('dialogTrigger');
    }
    set dialogTrigger(value: UserDefinedElement | string | undefined) {
        this._setOption('dialogTrigger', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get dropZone(): UserDefinedElement | string | undefined {
        return this._getOption('dropZone');
    }
    set dropZone(value: UserDefinedElement | string | undefined) {
        this._setOption('dropZone', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    get inputAttr(): any {
        return this._getOption('inputAttr');
    }
    set inputAttr(value: any) {
        this._setOption('inputAttr', value);
    }

    get invalidFileExtensionMessage(): string {
        return this._getOption('invalidFileExtensionMessage');
    }
    set invalidFileExtensionMessage(value: string) {
        this._setOption('invalidFileExtensionMessage', value);
    }

    get invalidMaxFileSizeMessage(): string {
        return this._getOption('invalidMaxFileSizeMessage');
    }
    set invalidMaxFileSizeMessage(value: string) {
        this._setOption('invalidMaxFileSizeMessage', value);
    }

    get invalidMinFileSizeMessage(): string {
        return this._getOption('invalidMinFileSizeMessage');
    }
    set invalidMinFileSizeMessage(value: string) {
        this._setOption('invalidMinFileSizeMessage', value);
    }

    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }

    get labelText(): string {
        return this._getOption('labelText');
    }
    set labelText(value: string) {
        this._setOption('labelText', value);
    }

    get maxFileSize(): number {
        return this._getOption('maxFileSize');
    }
    set maxFileSize(value: number) {
        this._setOption('maxFileSize', value);
    }

    get minFileSize(): number {
        return this._getOption('minFileSize');
    }
    set minFileSize(value: number) {
        this._setOption('minFileSize', value);
    }

    get multiple(): boolean {
        return this._getOption('multiple');
    }
    set multiple(value: boolean) {
        this._setOption('multiple', value);
    }

    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    get onBeforeSend(): ((e: BeforeSendEvent) => void) {
        return this._getOption('onBeforeSend');
    }
    set onBeforeSend(value: ((e: BeforeSendEvent) => void)) {
        this._setOption('onBeforeSend', value);
    }

    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    get onDropZoneEnter(): ((e: DropZoneEnterEvent) => void) {
        return this._getOption('onDropZoneEnter');
    }
    set onDropZoneEnter(value: ((e: DropZoneEnterEvent) => void)) {
        this._setOption('onDropZoneEnter', value);
    }

    get onDropZoneLeave(): ((e: DropZoneLeaveEvent) => void) {
        return this._getOption('onDropZoneLeave');
    }
    set onDropZoneLeave(value: ((e: DropZoneLeaveEvent) => void)) {
        this._setOption('onDropZoneLeave', value);
    }

    get onFilesUploaded(): ((e: FilesUploadedEvent) => void) {
        return this._getOption('onFilesUploaded');
    }
    set onFilesUploaded(value: ((e: FilesUploadedEvent) => void)) {
        this._setOption('onFilesUploaded', value);
    }

    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    get onProgress(): ((e: ProgressEvent) => void) {
        return this._getOption('onProgress');
    }
    set onProgress(value: ((e: ProgressEvent) => void)) {
        this._setOption('onProgress', value);
    }

    get onUploadAborted(): ((e: UploadAbortedEvent) => void) {
        return this._getOption('onUploadAborted');
    }
    set onUploadAborted(value: ((e: UploadAbortedEvent) => void)) {
        this._setOption('onUploadAborted', value);
    }

    get onUploaded(): ((e: UploadedEvent) => void) {
        return this._getOption('onUploaded');
    }
    set onUploaded(value: ((e: UploadedEvent) => void)) {
        this._setOption('onUploaded', value);
    }

    get onUploadError(): ((e: UploadErrorEvent) => void) {
        return this._getOption('onUploadError');
    }
    set onUploadError(value: ((e: UploadErrorEvent) => void)) {
        this._setOption('onUploadError', value);
    }

    get onUploadStarted(): ((e: UploadStartedEvent) => void) {
        return this._getOption('onUploadStarted');
    }
    set onUploadStarted(value: ((e: UploadStartedEvent) => void)) {
        this._setOption('onUploadStarted', value);
    }

    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    get progress(): number {
        return this._getOption('progress');
    }
    set progress(value: number) {
        this._setOption('progress', value);
    }

    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    get readyToUploadMessage(): string {
        return this._getOption('readyToUploadMessage');
    }
    set readyToUploadMessage(value: string) {
        this._setOption('readyToUploadMessage', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get selectButtonText(): string {
        return this._getOption('selectButtonText');
    }
    set selectButtonText(value: string) {
        this._setOption('selectButtonText', value);
    }

    get showFileList(): boolean {
        return this._getOption('showFileList');
    }
    set showFileList(value: boolean) {
        this._setOption('showFileList', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get uploadAbortedMessage(): string {
        return this._getOption('uploadAbortedMessage');
    }
    set uploadAbortedMessage(value: string) {
        this._setOption('uploadAbortedMessage', value);
    }

    get uploadButtonText(): string {
        return this._getOption('uploadButtonText');
    }
    set uploadButtonText(value: string) {
        this._setOption('uploadButtonText', value);
    }

    get uploadChunk(): Function {
        return this._getOption('uploadChunk');
    }
    set uploadChunk(value: Function) {
        this._setOption('uploadChunk', value);
    }

    get uploadCustomData(): any {
        return this._getOption('uploadCustomData');
    }
    set uploadCustomData(value: any) {
        this._setOption('uploadCustomData', value);
    }

    get uploadedMessage(): string {
        return this._getOption('uploadedMessage');
    }
    set uploadedMessage(value: string) {
        this._setOption('uploadedMessage', value);
    }

    get uploadFailedMessage(): string {
        return this._getOption('uploadFailedMessage');
    }
    set uploadFailedMessage(value: string) {
        this._setOption('uploadFailedMessage', value);
    }

    get uploadFile(): Function {
        return this._getOption('uploadFile');
    }
    set uploadFile(value: Function) {
        this._setOption('uploadFile', value);
    }

    get uploadHeaders(): any {
        return this._getOption('uploadHeaders');
    }
    set uploadHeaders(value: any) {
        this._setOption('uploadHeaders', value);
    }

    get uploadMethod(): UploadHttpMethod {
        return this._getOption('uploadMethod');
    }
    set uploadMethod(value: UploadHttpMethod) {
        this._setOption('uploadMethod', value);
    }

    get uploadMode(): FileUploadMode {
        return this._getOption('uploadMode');
    }
    set uploadMode(value: FileUploadMode) {
        this._setOption('uploadMode', value);
    }

    get uploadUrl(): string {
        return this._getOption('uploadUrl');
    }
    set uploadUrl(value: string) {
        this._setOption('uploadUrl', value);
    }

    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }

    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }

    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }

    get value(): Array<any> {
        return this._getOption('value');
    }
    set value(value: Array<any>) {
        this._setOption('value', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }
}
