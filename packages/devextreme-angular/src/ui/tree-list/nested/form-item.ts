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
    QueryList,
    AfterContentInit
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import * as CommonTypes from 'devextreme/common';
import { FormItemComponent, FormItemType, LabelLocation } from 'devextreme/ui/form';
import { HorizontalAlignment } from 'devextreme/common';

import {
    DxIntegrationModule,
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
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoTreeListFormItemComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost, AfterContentInit  {
    @Input()
    get aiOptions(): { disabled?: boolean, instruction?: string | undefined } {
        return this._getOption('aiOptions');
    }
    set aiOptions(value: { disabled?: boolean, instruction?: string | undefined }) {
        this._setOption('aiOptions', value);
    }

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


    @ContentChildren(forwardRef(() => DxiTreeListAsyncRuleComponent)) asyncRulesChildren!: QueryList<DxiTreeListAsyncRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListCompareRuleComponent)) compareRulesChildren!: QueryList<DxiTreeListCompareRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListCustomRuleComponent)) customRulesChildren!: QueryList<DxiTreeListCustomRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListEmailRuleComponent)) emailRulesChildren!: QueryList<DxiTreeListEmailRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListNumericRuleComponent)) numericRulesChildren!: QueryList<DxiTreeListNumericRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListPatternRuleComponent)) patternRulesChildren!: QueryList<DxiTreeListPatternRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListRangeRuleComponent)) rangeRulesChildren!: QueryList<DxiTreeListRangeRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListRequiredRuleComponent)) requiredRulesChildren!: QueryList<DxiTreeListRequiredRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListStringLengthRuleComponent)) stringLengthRulesChildren!: QueryList<DxiTreeListStringLengthRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiTreeListValidationRuleComponent)) validationRulesChildren!: QueryList<DxiTreeListValidationRuleComponent>
    
    setValidationRules() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.asyncRulesChildren.toArray(),
            ...this.compareRulesChildren.toArray(),
            ...this.customRulesChildren.toArray(),
            ...this.emailRulesChildren.toArray(),
            ...this.numericRulesChildren.toArray(),
            ...this.patternRulesChildren.toArray(),
            ...this.rangeRulesChildren.toArray(),
            ...this.requiredRulesChildren.toArray(),
            ...this.stringLengthRulesChildren.toArray(),
            ...this.validationRulesChildren.toArray(),
        ]);
        this.setChildren('validationRules', q);
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


    ngAfterContentInit() {
        this.setValidationRules();
        
        this.asyncRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.compareRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.customRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.emailRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.numericRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.patternRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.rangeRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.requiredRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.stringLengthRulesChildren.changes.subscribe(() => { this.setValidationRules() });
        this.validationRulesChildren.changes.subscribe(() => { this.setValidationRules() });
    }
}

@NgModule({
  imports: [
    DxoTreeListFormItemComponent
  ],
  exports: [
    DxoTreeListFormItemComponent
  ],
})
export class DxoTreeListFormItemModule { }
