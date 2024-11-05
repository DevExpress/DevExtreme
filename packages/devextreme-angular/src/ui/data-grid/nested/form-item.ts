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
import { DxiDataGridAsyncRuleComponent } from './async-rule-dxi';
import { DxiDataGridCompareRuleComponent } from './compare-rule-dxi';
import { DxiDataGridCustomRuleComponent } from './custom-rule-dxi';
import { DxiDataGridEmailRuleComponent } from './email-rule-dxi';
import { DxiDataGridNumericRuleComponent } from './numeric-rule-dxi';
import { DxiDataGridPatternRuleComponent } from './pattern-rule-dxi';
import { DxiDataGridRangeRuleComponent } from './range-rule-dxi';
import { DxiDataGridRequiredRuleComponent } from './required-rule-dxi';
import { DxiDataGridStringLengthRuleComponent } from './string-length-rule-dxi';
import { DxiDataGridValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxo-data-grid-form-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoDataGridFormItemComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get colSpan(): number {
        return this._getOption('colSpan');
    }
    set colSpan(value: number) {
        this._setOption('colSpan', value);
    }

    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get dataField(): string {
        return this._getOption('dataField');
    }
    set dataField(value: string) {
        this._setOption('dataField', value);
    }

    @Input()
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
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
    get helpText(): string {
        return this._getOption('helpText');
    }
    set helpText(value: string) {
        this._setOption('helpText', value);
    }

    @Input()
    get isRequired(): boolean {
        return this._getOption('isRequired');
    }
    set isRequired(value: boolean) {
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
    get label(): Record<string, any> | { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
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
    get visibleIndex(): number {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number) {
        this._setOption('visibleIndex', value);
    }


    protected get _optionPath() {
        return 'formItem';
    }


    @ContentChildren(forwardRef(() => DxiDataGridAsyncRuleComponent))
    get asyncRulesChildren(): QueryList<DxiDataGridAsyncRuleComponent> {
        return this._getOption('validationRules');
    }
    set asyncRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridCompareRuleComponent))
    get compareRulesChildren(): QueryList<DxiDataGridCompareRuleComponent> {
        return this._getOption('validationRules');
    }
    set compareRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridCustomRuleComponent))
    get customRulesChildren(): QueryList<DxiDataGridCustomRuleComponent> {
        return this._getOption('validationRules');
    }
    set customRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridEmailRuleComponent))
    get emailRulesChildren(): QueryList<DxiDataGridEmailRuleComponent> {
        return this._getOption('validationRules');
    }
    set emailRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridNumericRuleComponent))
    get numericRulesChildren(): QueryList<DxiDataGridNumericRuleComponent> {
        return this._getOption('validationRules');
    }
    set numericRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridPatternRuleComponent))
    get patternRulesChildren(): QueryList<DxiDataGridPatternRuleComponent> {
        return this._getOption('validationRules');
    }
    set patternRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridRangeRuleComponent))
    get rangeRulesChildren(): QueryList<DxiDataGridRangeRuleComponent> {
        return this._getOption('validationRules');
    }
    set rangeRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridRequiredRuleComponent))
    get requiredRulesChildren(): QueryList<DxiDataGridRequiredRuleComponent> {
        return this._getOption('validationRules');
    }
    set requiredRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridStringLengthRuleComponent))
    get stringLengthRulesChildren(): QueryList<DxiDataGridStringLengthRuleComponent> {
        return this._getOption('validationRules');
    }
    set stringLengthRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiDataGridValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiDataGridValidationRuleComponent> {
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
    DxoDataGridFormItemComponent
  ],
  exports: [
    DxoDataGridFormItemComponent
  ],
})
export class DxoDataGridFormItemModule { }
