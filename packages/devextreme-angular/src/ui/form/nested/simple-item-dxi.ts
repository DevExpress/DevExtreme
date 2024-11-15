/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import * as CommonTypes from 'devextreme/common';
import { FormItemComponent, FormItemType, LabelLocation } from 'devextreme/ui/form';
import { HorizontalAlignment } from 'devextreme/common';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiFormAsyncRuleComponent } from './async-rule-dxi';
import { DxiFormCompareRuleComponent } from './compare-rule-dxi';
import { DxiFormCustomRuleComponent } from './custom-rule-dxi';
import { DxiFormEmailRuleComponent } from './email-rule-dxi';
import { DxiFormNumericRuleComponent } from './numeric-rule-dxi';
import { DxiFormPatternRuleComponent } from './pattern-rule-dxi';
import { DxiFormRangeRuleComponent } from './range-rule-dxi';
import { DxiFormRequiredRuleComponent } from './required-rule-dxi';
import { DxiFormStringLengthRuleComponent } from './string-length-rule-dxi';
import { DxiFormValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxi-form-simple-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiFormSimpleItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get colSpan(): number | undefined {
        return this._getOption('colSpan');
    }
    set colSpan(value: number | undefined) {
        this._setOption('colSpan', value);
    }

    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    @Input()
    get editorOptions(): any | undefined {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any | undefined) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get editorType(): FormItemComponent {
        return this._getOption('editorType');
    }
    set editorType(value: FormItemComponent) {
        this._setOption('editorType', value);
    }

    @Input()
    get helpText(): string | undefined {
        return this._getOption('helpText');
    }
    set helpText(value: string | undefined) {
        this._setOption('helpText', value);
    }

    @Input()
    get isRequired(): boolean | undefined {
        return this._getOption('isRequired');
    }
    set isRequired(value: boolean | undefined) {
        this._setOption('isRequired', value);
    }

    @Input()
    get itemType(): FormItemType {
        return this._getOption('itemType');
    }
    set itemType(value: FormItemType) {
        this._setOption('itemType', value);
    }

    @Input()
    get label(): { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get validationRules(): Array<CommonTypes.ValidationRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<CommonTypes.ValidationRule>) {
        this._setOption('validationRules', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }


    protected get _optionPath() {
        return 'items';
    }


    @ContentChildren(forwardRef(() => DxiFormAsyncRuleComponent))
    get asyncRulesChildren(): QueryList<DxiFormAsyncRuleComponent> {
        return this._getOption('validationRules');
    }
    set asyncRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormCompareRuleComponent))
    get compareRulesChildren(): QueryList<DxiFormCompareRuleComponent> {
        return this._getOption('validationRules');
    }
    set compareRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormCustomRuleComponent))
    get customRulesChildren(): QueryList<DxiFormCustomRuleComponent> {
        return this._getOption('validationRules');
    }
    set customRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormEmailRuleComponent))
    get emailRulesChildren(): QueryList<DxiFormEmailRuleComponent> {
        return this._getOption('validationRules');
    }
    set emailRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormNumericRuleComponent))
    get numericRulesChildren(): QueryList<DxiFormNumericRuleComponent> {
        return this._getOption('validationRules');
    }
    set numericRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormPatternRuleComponent))
    get patternRulesChildren(): QueryList<DxiFormPatternRuleComponent> {
        return this._getOption('validationRules');
    }
    set patternRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormRangeRuleComponent))
    get rangeRulesChildren(): QueryList<DxiFormRangeRuleComponent> {
        return this._getOption('validationRules');
    }
    set rangeRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormRequiredRuleComponent))
    get requiredRulesChildren(): QueryList<DxiFormRequiredRuleComponent> {
        return this._getOption('validationRules');
    }
    set requiredRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormStringLengthRuleComponent))
    get stringLengthRulesChildren(): QueryList<DxiFormStringLengthRuleComponent> {
        return this._getOption('validationRules');
    }
    set stringLengthRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiFormValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiFormValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost,
            private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            @Host() templateHost: DxTemplateHost,
            private element: ElementRef) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        templateHost.setHost(this);
    }

    setTemplate(template: DxTemplateDirective) {
        this.template = template;
    }
    ngAfterViewInit() {
        extractTemplate(this, this.element, this.renderer, this.document);
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiFormSimpleItemComponent
  ],
  exports: [
    DxiFormSimpleItemComponent
  ],
})
export class DxiFormSimpleItemModule { }
