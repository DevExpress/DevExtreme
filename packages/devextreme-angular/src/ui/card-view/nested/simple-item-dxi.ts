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
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiCardViewAsyncRuleComponent } from './async-rule-dxi';
import { DxiCardViewCompareRuleComponent } from './compare-rule-dxi';
import { DxiCardViewCustomRuleComponent } from './custom-rule-dxi';
import { DxiCardViewEmailRuleComponent } from './email-rule-dxi';
import { DxiCardViewNumericRuleComponent } from './numeric-rule-dxi';
import { DxiCardViewPatternRuleComponent } from './pattern-rule-dxi';
import { DxiCardViewRangeRuleComponent } from './range-rule-dxi';
import { DxiCardViewRequiredRuleComponent } from './required-rule-dxi';
import { DxiCardViewStringLengthRuleComponent } from './string-length-rule-dxi';
import { DxiCardViewValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxi-card-view-simple-item',
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiCardViewSimpleItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost, AfterContentInit  {
    @Input()
    get aiProcessing(): { disabled?: boolean, instruction?: string } {
        return this._getOption('aiProcessing');
    }
    set aiProcessing(value: { disabled?: boolean, instruction?: string }) {
        this._setOption('aiProcessing', value);
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
        return 'items';
    }


    @ContentChildren(forwardRef(() => DxiCardViewAsyncRuleComponent)) asyncRulesChildren!: QueryList<DxiCardViewAsyncRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewCompareRuleComponent)) compareRulesChildren!: QueryList<DxiCardViewCompareRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewCustomRuleComponent)) customRulesChildren!: QueryList<DxiCardViewCustomRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewEmailRuleComponent)) emailRulesChildren!: QueryList<DxiCardViewEmailRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewNumericRuleComponent)) numericRulesChildren!: QueryList<DxiCardViewNumericRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewPatternRuleComponent)) patternRulesChildren!: QueryList<DxiCardViewPatternRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewRangeRuleComponent)) rangeRulesChildren!: QueryList<DxiCardViewRangeRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewRequiredRuleComponent)) requiredRulesChildren!: QueryList<DxiCardViewRequiredRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewStringLengthRuleComponent)) stringLengthRulesChildren!: QueryList<DxiCardViewStringLengthRuleComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewValidationRuleComponent)) validationRulesChildren!: QueryList<DxiCardViewValidationRuleComponent>
    
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



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
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
    DxiCardViewSimpleItemComponent
  ],
  exports: [
    DxiCardViewSimpleItemComponent
  ],
})
export class DxiCardViewSimpleItemModule { }
