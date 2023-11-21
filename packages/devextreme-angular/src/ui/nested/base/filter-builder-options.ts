/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { ContentReadyEvent, DisposingEvent, EditorPreparedEvent, EditorPreparingEvent, GroupOperation, InitializedEvent, OptionChangedEvent, ValueChangedEvent } from 'devextreme/ui/filter_builder';

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

    get customOperations(): Array<DevExpress.ui.dxFilterBuilderCustomOperation> {
        return this._getOption('customOperations');
    }
    set customOperations(value: Array<DevExpress.ui.dxFilterBuilderCustomOperation>) {
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

    get fields(): Array<DevExpress.ui.dxFilterBuilderField> {
        return this._getOption('fields');
    }
    set fields(value: Array<DevExpress.ui.dxFilterBuilderField>) {
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

    get onContentReady(): Function {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: Function) {
        this._setOption('onContentReady', value);
    }

    get onDisposing(): Function {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: Function) {
        this._setOption('onDisposing', value);
    }

    get onEditorPrepared(): Function {
        return this._getOption('onEditorPrepared');
    }
    set onEditorPrepared(value: Function) {
        this._setOption('onEditorPrepared', value);
    }

    get onEditorPreparing(): Function {
        return this._getOption('onEditorPreparing');
    }
    set onEditorPreparing(value: Function) {
        this._setOption('onEditorPreparing', value);
    }

    get onInitialized(): Function {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: Function) {
        this._setOption('onInitialized', value);
    }

    get onOptionChanged(): Function {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: Function) {
        this._setOption('onOptionChanged', value);
    }

    get onValueChanged(): Function {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: Function) {
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
