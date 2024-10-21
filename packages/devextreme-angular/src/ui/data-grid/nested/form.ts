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




import { dxFormSimpleItem, dxFormGroupItem, dxFormTabbedItem, dxFormEmptyItem, dxFormButtonItem, ContentReadyEvent, DisposingEvent, EditorEnterKeyEvent, FieldDataChangedEvent, InitializedEvent, OptionChangedEvent } from 'devextreme/ui/form';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-form',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridFormComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }

    @Input()
    get alignItemLabelsInAllGroups(): boolean {
        return this._getOption('alignItemLabelsInAllGroups');
    }
    set alignItemLabelsInAllGroups(value: boolean) {
        this._setOption('alignItemLabelsInAllGroups', value);
    }

    @Input()
    get bindingOptions(): Record<string, any> {
        return this._getOption('bindingOptions');
    }
    set bindingOptions(value: Record<string, any>) {
        this._setOption('bindingOptions', value);
    }

    @Input()
    get colCount(): number | "auto" {
        return this._getOption('colCount');
    }
    set colCount(value: number | "auto") {
        this._setOption('colCount', value);
    }

    @Input()
    get colCountByScreen(): Record<string, any> {
        return this._getOption('colCountByScreen');
    }
    set colCountByScreen(value: Record<string, any>) {
        this._setOption('colCountByScreen', value);
    }

    @Input()
    get customizeItem(): ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void) {
        return this._getOption('customizeItem');
    }
    set customizeItem(value: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void)) {
        this._setOption('customizeItem', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
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
    get formData(): any {
        return this._getOption('formData');
    }
    set formData(value: any) {
        this._setOption('formData', value);
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
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    @Input()
    get items(): Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>) {
        this._setOption('items', value);
    }

    @Input()
    get labelLocation(): "left" | "right" | "top" {
        return this._getOption('labelLocation');
    }
    set labelLocation(value: "left" | "right" | "top") {
        this._setOption('labelLocation', value);
    }

    @Input()
    get labelMode(): "static" | "floating" | "hidden" | "outside" {
        return this._getOption('labelMode');
    }
    set labelMode(value: "static" | "floating" | "hidden" | "outside") {
        this._setOption('labelMode', value);
    }

    @Input()
    get minColWidth(): number {
        return this._getOption('minColWidth');
    }
    set minColWidth(value: number) {
        this._setOption('minColWidth', value);
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
    get onEditorEnterKey(): ((e: EditorEnterKeyEvent) => void) {
        return this._getOption('onEditorEnterKey');
    }
    set onEditorEnterKey(value: ((e: EditorEnterKeyEvent) => void)) {
        this._setOption('onEditorEnterKey', value);
    }

    @Input()
    get onFieldDataChanged(): ((e: FieldDataChangedEvent) => void) {
        return this._getOption('onFieldDataChanged');
    }
    set onFieldDataChanged(value: ((e: FieldDataChangedEvent) => void)) {
        this._setOption('onFieldDataChanged', value);
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
    get optionalMark(): string {
        return this._getOption('optionalMark');
    }
    set optionalMark(value: string) {
        this._setOption('optionalMark', value);
    }

    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    @Input()
    get requiredMark(): string {
        return this._getOption('requiredMark');
    }
    set requiredMark(value: string) {
        this._setOption('requiredMark', value);
    }

    @Input()
    get requiredMessage(): string {
        return this._getOption('requiredMessage');
    }
    set requiredMessage(value: string) {
        this._setOption('requiredMessage', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get screenByWidth(): (() => void) {
        return this._getOption('screenByWidth');
    }
    set screenByWidth(value: (() => void)) {
        this._setOption('screenByWidth', value);
    }

    @Input()
    get scrollingEnabled(): boolean {
        return this._getOption('scrollingEnabled');
    }
    set scrollingEnabled(value: boolean) {
        this._setOption('scrollingEnabled', value);
    }

    @Input()
    get showColonAfterLabel(): boolean {
        return this._getOption('showColonAfterLabel');
    }
    set showColonAfterLabel(value: boolean) {
        this._setOption('showColonAfterLabel', value);
    }

    @Input()
    get showOptionalMark(): boolean {
        return this._getOption('showOptionalMark');
    }
    set showOptionalMark(value: boolean) {
        this._setOption('showOptionalMark', value);
    }

    @Input()
    get showRequiredMark(): boolean {
        return this._getOption('showRequiredMark');
    }
    set showRequiredMark(value: boolean) {
        this._setOption('showRequiredMark', value);
    }

    @Input()
    get showValidationSummary(): boolean {
        return this._getOption('showValidationSummary');
    }
    set showValidationSummary(value: boolean) {
        this._setOption('showValidationSummary', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get validationGroup(): string {
        return this._getOption('validationGroup');
    }
    set validationGroup(value: string) {
        this._setOption('validationGroup', value);
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
        return 'form';
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
    DxoDataGridFormComponent
  ],
  exports: [
    DxoDataGridFormComponent
  ],
})
export class DxoDataGridFormModule { }
