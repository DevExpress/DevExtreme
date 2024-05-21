/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Mode } from 'devextreme/common';
import { ButtonItem, ContentReadyEvent, DisposingEvent, EditorEnterKeyEvent, EmptyItem, FieldDataChangedEvent, FormLabelMode, GroupItem, InitializedEvent, LabelLocation, OptionChangedEvent, SimpleItem, TabbedItem } from 'devextreme/ui/form';

@Component({
    template: ''
})
export abstract class DxoFormOptions extends NestedOption {
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

    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }

    get alignItemLabelsInAllGroups(): boolean {
        return this._getOption('alignItemLabelsInAllGroups');
    }
    set alignItemLabelsInAllGroups(value: boolean) {
        this._setOption('alignItemLabelsInAllGroups', value);
    }

    get colCount(): Mode | number {
        return this._getOption('colCount');
    }
    set colCount(value: Mode | number) {
        this._setOption('colCount', value);
    }

    get colCountByScreen(): { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined } {
        return this._getOption('colCountByScreen');
    }
    set colCountByScreen(value: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }) {
        this._setOption('colCountByScreen', value);
    }

    get customizeItem(): Function {
        return this._getOption('customizeItem');
    }
    set customizeItem(value: Function) {
        this._setOption('customizeItem', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
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

    get formData(): any {
        return this._getOption('formData');
    }
    set formData(value: any) {
        this._setOption('formData', value);
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

    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    get items(): Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem> {
        return this._getOption('items');
    }
    set items(value: Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>) {
        this._setOption('items', value);
    }

    get labelLocation(): LabelLocation {
        return this._getOption('labelLocation');
    }
    set labelLocation(value: LabelLocation) {
        this._setOption('labelLocation', value);
    }

    get labelMode(): FormLabelMode {
        return this._getOption('labelMode');
    }
    set labelMode(value: FormLabelMode) {
        this._setOption('labelMode', value);
    }

    get minColWidth(): number {
        return this._getOption('minColWidth');
    }
    set minColWidth(value: number) {
        this._setOption('minColWidth', value);
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

    get onEditorEnterKey(): ((e: EditorEnterKeyEvent) => void) {
        return this._getOption('onEditorEnterKey');
    }
    set onEditorEnterKey(value: ((e: EditorEnterKeyEvent) => void)) {
        this._setOption('onEditorEnterKey', value);
    }

    get onFieldDataChanged(): ((e: FieldDataChangedEvent) => void) {
        return this._getOption('onFieldDataChanged');
    }
    set onFieldDataChanged(value: ((e: FieldDataChangedEvent) => void)) {
        this._setOption('onFieldDataChanged', value);
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

    get optionalMark(): string {
        return this._getOption('optionalMark');
    }
    set optionalMark(value: string) {
        this._setOption('optionalMark', value);
    }

    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    get requiredMark(): string {
        return this._getOption('requiredMark');
    }
    set requiredMark(value: string) {
        this._setOption('requiredMark', value);
    }

    get requiredMessage(): string {
        return this._getOption('requiredMessage');
    }
    set requiredMessage(value: string) {
        this._setOption('requiredMessage', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get screenByWidth(): Function {
        return this._getOption('screenByWidth');
    }
    set screenByWidth(value: Function) {
        this._setOption('screenByWidth', value);
    }

    get scrollingEnabled(): boolean {
        return this._getOption('scrollingEnabled');
    }
    set scrollingEnabled(value: boolean) {
        this._setOption('scrollingEnabled', value);
    }

    get showColonAfterLabel(): boolean {
        return this._getOption('showColonAfterLabel');
    }
    set showColonAfterLabel(value: boolean) {
        this._setOption('showColonAfterLabel', value);
    }

    get showOptionalMark(): boolean {
        return this._getOption('showOptionalMark');
    }
    set showOptionalMark(value: boolean) {
        this._setOption('showOptionalMark', value);
    }

    get showRequiredMark(): boolean {
        return this._getOption('showRequiredMark');
    }
    set showRequiredMark(value: boolean) {
        this._setOption('showRequiredMark', value);
    }

    get showValidationSummary(): boolean {
        return this._getOption('showValidationSummary');
    }
    set showValidationSummary(value: boolean) {
        this._setOption('showValidationSummary', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get validationGroup(): string | undefined {
        return this._getOption('validationGroup');
    }
    set validationGroup(value: string | undefined) {
        this._setOption('validationGroup', value);
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
