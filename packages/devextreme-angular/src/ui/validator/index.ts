/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    SkipSelf,
    Optional,
    Host,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import DOMComponent from 'devextreme/core/dom_component';
import * as CommonTypes from 'devextreme/common';
import { EventInfo } from 'devextreme/events/index';
import { Component } from 'devextreme/core/component';

import DxValidator from 'devextreme/ui/validator';


import {
    DxComponentExtension,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoAdapterModule } from 'devextreme-angular/ui/nested';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';

import { DxoValidatorAdapterModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorAsyncRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorCompareRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorCustomRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorEmailRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorNumericRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorPatternRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorRangeRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorRequiredRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorStringLengthRuleModule } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorValidationRuleModule } from 'devextreme-angular/ui/validator/nested';

import { DxiValidationRuleComponent } from 'devextreme-angular/ui/nested';

import { DxiValidatorAsyncRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorCompareRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorCustomRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorEmailRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorNumericRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorPatternRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorRangeRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorRequiredRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorStringLengthRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { DxiValidatorValidationRuleComponent } from 'devextreme-angular/ui/validator/nested';


/**
 * [descr:dxValidator]

 */
@Component({
    selector: 'dx-validator',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxValidatorComponent extends DxComponentExtension implements OnDestroy, OnChanges, DoCheck {
    instance: DxValidator = null;

    /**
     * [descr:dxValidatorOptions.adapter]
    
     */
    @Input()
    get adapter(): Record<string, any> {
        return this._getOption('adapter');
    }
    set adapter(value: Record<string, any>) {
        this._setOption('adapter', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxValidatorOptions.name]
    
     */
    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    /**
     * [descr:dxValidatorOptions.validationGroup]
    
     */
    @Input()
    get validationGroup(): string {
        return this._getOption('validationGroup');
    }
    set validationGroup(value: string) {
        this._setOption('validationGroup', value);
    }


    /**
     * [descr:dxValidatorOptions.validationRules]
    
     */
    @Input()
    get validationRules(): Array<CommonTypes.ValidationRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<CommonTypes.ValidationRule>) {
        this._setOption('validationRules', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:DOMComponentOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<EventInfo>;

    /**
    
     * [descr:ComponentOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<Object>;

    /**
    
     * [descr:DOMComponentOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<Object>;

    /**
    
     * [descr:dxValidatorOptions.onValidated]
    
    
     */
    @Output() onValidated: EventEmitter<Object>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adapterChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationGroupChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationRulesChange: EventEmitter<Array<CommonTypes.ValidationRule>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;




    @ContentChildren(DxiValidatorAsyncRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorAsyncRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorAsyncRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorCompareRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorCompareRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorCompareRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorCustomRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorCustomRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorCustomRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorEmailRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorEmailRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorEmailRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorNumericRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorNumericRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorNumericRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorPatternRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorPatternRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorPatternRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorRangeRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorRangeRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorRangeRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorRequiredRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorRequiredRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorRequiredRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorStringLengthRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorStringLengthRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorStringLengthRuleComponent');
        this.setChildren('validationRules', value);
    }

    @ContentChildren(DxiValidatorValidationRuleComponent)
    get validationRulesChildren(): QueryList<DxiValidatorValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setContentChildren('validationRules', value, 'DxiValidatorValidationRuleComponent');
        this.setChildren('validationRules', value);
    }


    @ContentChildren(DxiValidationRuleComponent)
    get validationRulesLegacyChildren(): QueryList<DxiValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesLegacyChildren(value) {
        if (this.checkContentChildren('validationRules', value, 'DxiValidationRuleComponent')) {
           this.setChildren('validationRules', value);
        }
    }



    parentElement: any;


    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            @SkipSelf() @Optional() @Host() parentOptionHost: NestedOptionHost,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'validated', emit: 'onValidated' },
            { emit: 'adapterChange' },
            { emit: 'elementAttrChange' },
            { emit: 'heightChange' },
            { emit: 'nameChange' },
            { emit: 'validationGroupChange' },
            { emit: 'validationRulesChange' },
            { emit: 'widthChange' }
        ]);
        this.parentElement = this.getParentElement(parentOptionHost);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        if (this.parentElement) {
            return new DxValidator(this.parentElement, options);
        }

        return new DxValidator(element, options);
    }

    private getParentElement(host) {
        if (host) {
            const parentHost = host.getHost();
            return (parentHost as any).element.nativeElement;
        }
        return;
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('validationRules', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('validationRules');
        this._watcherHelper.checkWatchers();
        super.ngDoCheck();
        super.clearChangedOptions();
    }

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
  imports: [
    DxoAdapterModule,
    DxiValidationRuleModule,
    DxoValidatorAdapterModule,
    DxiValidatorAsyncRuleModule,
    DxiValidatorCompareRuleModule,
    DxiValidatorCustomRuleModule,
    DxiValidatorEmailRuleModule,
    DxiValidatorNumericRuleModule,
    DxiValidatorPatternRuleModule,
    DxiValidatorRangeRuleModule,
    DxiValidatorRequiredRuleModule,
    DxiValidatorStringLengthRuleModule,
    DxiValidatorValidationRuleModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxValidatorComponent
  ],
  exports: [
    DxValidatorComponent,
    DxoAdapterModule,
    DxiValidationRuleModule,
    DxoValidatorAdapterModule,
    DxiValidatorAsyncRuleModule,
    DxiValidatorCompareRuleModule,
    DxiValidatorCustomRuleModule,
    DxiValidatorEmailRuleModule,
    DxiValidatorNumericRuleModule,
    DxiValidatorPatternRuleModule,
    DxiValidatorRangeRuleModule,
    DxiValidatorRequiredRuleModule,
    DxiValidatorStringLengthRuleModule,
    DxiValidatorValidationRuleModule,
    DxTemplateModule
  ]
})
export class DxValidatorModule { }

import type * as DxValidatorTypes from "devextreme/ui/validator_types";
export { DxValidatorTypes };


