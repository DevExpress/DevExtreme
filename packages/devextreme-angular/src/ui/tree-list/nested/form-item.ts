/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
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
import { NestedOption } from 'devextreme-angular/core';
import { DxiTreeListAsyncRuleComponent } from './async-rule-dxi';
import { DxiTreeListCompareRuleComponent } from './compare-rule-dxi';
import { DxiTreeListCustomRuleComponent } from './custom-rule-dxi';
import { DxiTreeListEmailRuleComponent } from './email-rule-dxi';
import { DxiTreeListNumericRuleComponent } from './numeric-rule-dxi';
import { DxiTreeListPatternRuleComponent } from './pattern-rule-dxi';
import { DxiTreeListRangeRuleComponent } from './range-rule-dxi';
import { DxiTreeListRequiredRuleComponent } from './required-rule-dxi';
import { DxiTreeListStringLengthRuleComponent } from './string-length-rule-dxi';
import { DxiTreeListValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxo-tree-list-form-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoTreeListFormItemComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
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
        return 'formItem';
    }


    @ContentChildren(forwardRef(() => DxiTreeListAsyncRuleComponent))
    get asyncRulesChildren(): QueryList<DxiTreeListAsyncRuleComponent> {
        return this._getOption('validationRules');
    }
    set asyncRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListCompareRuleComponent))
    get compareRulesChildren(): QueryList<DxiTreeListCompareRuleComponent> {
        return this._getOption('validationRules');
    }
    set compareRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListCustomRuleComponent))
    get customRulesChildren(): QueryList<DxiTreeListCustomRuleComponent> {
        return this._getOption('validationRules');
    }
    set customRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListEmailRuleComponent))
    get emailRulesChildren(): QueryList<DxiTreeListEmailRuleComponent> {
        return this._getOption('validationRules');
    }
    set emailRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListNumericRuleComponent))
    get numericRulesChildren(): QueryList<DxiTreeListNumericRuleComponent> {
        return this._getOption('validationRules');
    }
    set numericRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListPatternRuleComponent))
    get patternRulesChildren(): QueryList<DxiTreeListPatternRuleComponent> {
        return this._getOption('validationRules');
    }
    set patternRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListRangeRuleComponent))
    get rangeRulesChildren(): QueryList<DxiTreeListRangeRuleComponent> {
        return this._getOption('validationRules');
    }
    set rangeRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListRequiredRuleComponent))
    get requiredRulesChildren(): QueryList<DxiTreeListRequiredRuleComponent> {
        return this._getOption('validationRules');
    }
    set requiredRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListStringLengthRuleComponent))
    get stringLengthRulesChildren(): QueryList<DxiTreeListStringLengthRuleComponent> {
        return this._getOption('validationRules');
    }
    set stringLengthRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiTreeListValidationRuleComponent> {
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


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoTreeListFormItemComponent
  ],
  exports: [
    DxoTreeListFormItemComponent
  ],
})
export class DxoTreeListFormItemModule { }
