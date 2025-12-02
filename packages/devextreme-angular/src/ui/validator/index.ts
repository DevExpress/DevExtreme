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


import * as CommonTypes from 'devextreme/common';
import { DisposingEvent, InitializedEvent, OptionChangedEvent, ValidatedEvent } from 'devextreme/ui/validator';

import DxValidator from 'devextreme/ui/validator';


import {
    DxComponentExtension,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper,
    CollectionNestedOption,
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
import { 
           PROPERTY_TOKEN_validationRules,
     } from 'devextreme-angular/core/tokens';


/**
 * [descr:dxValidator]

 */
@Component({
    selector: 'dx-validator',
    standalone: true,
    template: '',
    host: { ngSkipHydration: 'true' },
    imports: [ DxIntegrationModule ],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxValidatorComponent extends DxComponentExtension implements OnDestroy, OnChanges, DoCheck {

    @ContentChildren(PROPERTY_TOKEN_validationRules)
    set _validationRulesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('validationRules', value);
    }

    instance: DxValidator = null;

    /**
     * [descr:dxValidatorOptions.adapter]
    
     */
    @Input()
    get adapter(): { applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> } {
        return this._getOption('adapter');
    }
    set adapter(value: { applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> }) {
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
    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
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
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxValidatorOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxValidatorOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxValidatorOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxValidatorOptions.onValidated]
    
    
     */
    @Output() onValidated: EventEmitter<ValidatedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adapterChange: EventEmitter<{ applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | string | undefined>;

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
    @Output() widthChange: EventEmitter<number | string | undefined>;



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
    DxIntegrationModule,
    DxTemplateModule
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

export * from 'devextreme-angular/ui/validator/nested';

import type * as DxValidatorTypes from "devextreme/ui/validator_types";
export { DxValidatorTypes };


