/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { AsyncRule, CompareRule, CustomRule, EmailRule, HorizontalAlignment, NumericRule, PatternRule, RangeRule, RequiredRule, StringLengthRule } from 'devextreme/common';
import { FormItemComponent, FormItemType, LabelLocation } from 'devextreme/ui/form';

@Component({
    template: ''
})
export abstract class DxoFormSimpleItem extends NestedOption {
    get colSpan(): number | undefined {
        return this._getOption('colSpan');
    }
    set colSpan(value: number | undefined) {
        this._setOption('colSpan', value);
    }

    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    get editorOptions(): any | undefined {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any | undefined) {
        this._setOption('editorOptions', value);
    }

    get editorType(): FormItemComponent {
        return this._getOption('editorType');
    }
    set editorType(value: FormItemComponent) {
        this._setOption('editorType', value);
    }

    get helpText(): string | undefined {
        return this._getOption('helpText');
    }
    set helpText(value: string | undefined) {
        this._setOption('helpText', value);
    }

    get isRequired(): boolean | undefined {
        return this._getOption('isRequired');
    }
    set isRequired(value: boolean | undefined) {
        this._setOption('isRequired', value);
    }

    get itemType(): FormItemType {
        return this._getOption('itemType');
    }
    set itemType(value: FormItemType) {
        this._setOption('itemType', value);
    }

    get label(): { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean }) {
        this._setOption('label', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    get validationRules(): Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>) {
        this._setOption('validationRules', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }
}
