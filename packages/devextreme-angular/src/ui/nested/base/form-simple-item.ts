/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';

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

    get editorType(): string {
        return this._getOption('editorType');
    }
    set editorType(value: string) {
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

    get itemType(): string {
        return this._getOption('itemType');
    }
    set itemType(value: string) {
        this._setOption('itemType', value);
    }

    get label(): { alignment?: string, location?: string, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: string, location?: string, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean }) {
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

    get validationRules(): Array<DevExpress.common.RequiredRule | DevExpress.common.NumericRule | DevExpress.common.RangeRule | DevExpress.common.StringLengthRule | DevExpress.common.CustomRule | DevExpress.common.CompareRule | DevExpress.common.PatternRule | DevExpress.common.EmailRule | DevExpress.common.AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<DevExpress.common.RequiredRule | DevExpress.common.NumericRule | DevExpress.common.RangeRule | DevExpress.common.StringLengthRule | DevExpress.common.CustomRule | DevExpress.common.CompareRule | DevExpress.common.PatternRule | DevExpress.common.EmailRule | DevExpress.common.AsyncRule>) {
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
