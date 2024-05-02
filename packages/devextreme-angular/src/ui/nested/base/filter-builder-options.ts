/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { ContentReadyEvent, DisposingEvent, dxFilterBuilderCustomOperation, dxFilterBuilderField, EditorPreparedEvent, EditorPreparingEvent, GroupOperation, InitializedEvent, OptionChangedEvent, ValueChangedEvent } from 'devextreme/ui/filter_builder';

@Component({
    template: ''
})
export abstract class DxoFilterBuilderOptions extends NestedOption {
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

    get allowHierarchicalFields(): boolean {
        return this._getOption('allowHierarchicalFields');
    }
    set allowHierarchicalFields(value: boolean) {
        this._setOption('allowHierarchicalFields', value);
    }

    get customOperations(): Array<dxFilterBuilderCustomOperation> {
        return this._getOption('customOperations');
    }
    set customOperations(value: Array<dxFilterBuilderCustomOperation>) {
        this._setOption('customOperations', value);
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

    get fields(): Array<dxFilterBuilderField> {
        return this._getOption('fields');
    }
    set fields(value: Array<dxFilterBuilderField>) {
        this._setOption('fields', value);
    }

    get filterOperationDescriptions(): { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string } {
        return this._getOption('filterOperationDescriptions');
    }
    set filterOperationDescriptions(value: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }) {
        this._setOption('filterOperationDescriptions', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get groupOperationDescriptions(): { and?: string, notAnd?: string, notOr?: string, or?: string } {
        return this._getOption('groupOperationDescriptions');
    }
    set groupOperationDescriptions(value: { and?: string, notAnd?: string, notOr?: string, or?: string }) {
        this._setOption('groupOperationDescriptions', value);
    }

    get groupOperations(): any | Array<GroupOperation> {
        return this._getOption('groupOperations');
    }
    set groupOperations(value: any | Array<GroupOperation>) {
        this._setOption('groupOperations', value);
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

    get maxGroupLevel(): number | undefined {
        return this._getOption('maxGroupLevel');
    }
    set maxGroupLevel(value: number | undefined) {
        this._setOption('maxGroupLevel', value);
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

    get onEditorPrepared(): ((e: EditorPreparedEvent) => void) {
        return this._getOption('onEditorPrepared');
    }
    set onEditorPrepared(value: ((e: EditorPreparedEvent) => void)) {
        this._setOption('onEditorPrepared', value);
    }

    get onEditorPreparing(): ((e: EditorPreparingEvent) => void) {
        return this._getOption('onEditorPreparing');
    }
    set onEditorPreparing(value: ((e: EditorPreparingEvent) => void)) {
        this._setOption('onEditorPreparing', value);
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

    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get value(): any {
        return this._getOption('value');
    }
    set value(value: any) {
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
