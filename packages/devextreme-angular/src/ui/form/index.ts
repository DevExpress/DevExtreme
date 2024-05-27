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
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import { Mode } from 'devextreme/common';
import { ButtonItem, ContentReadyEvent, DisposingEvent, EditorEnterKeyEvent, EmptyItem, FieldDataChangedEvent, FormLabelMode, GroupItem, InitializedEvent, LabelLocation, OptionChangedEvent, SimpleItem, TabbedItem } from 'devextreme/ui/form';

import DxForm from 'devextreme/ui/form';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoColCountByScreenModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';
import { DxoTabPanelOptionsModule } from 'devextreme-angular/ui/nested';
import { DxiTabModule } from 'devextreme-angular/ui/nested';
import { DxoButtonOptionsModule } from 'devextreme-angular/ui/nested';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';



/**
 * [descr:dxForm]

 */
@Component({
    selector: 'dx-form',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxFormComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxForm = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxFormOptions.alignItemLabels]
    
     */
    @Input()
    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }


    /**
     * [descr:dxFormOptions.alignItemLabelsInAllGroups]
    
     */
    @Input()
    get alignItemLabelsInAllGroups(): boolean {
        return this._getOption('alignItemLabelsInAllGroups');
    }
    set alignItemLabelsInAllGroups(value: boolean) {
        this._setOption('alignItemLabelsInAllGroups', value);
    }


    /**
     * [descr:dxFormOptions.colCount]
    
     */
    @Input()
    get colCount(): Mode | number {
        return this._getOption('colCount');
    }
    set colCount(value: Mode | number) {
        this._setOption('colCount', value);
    }


    /**
     * [descr:dxFormOptions.colCountByScreen]
    
     */
    @Input()
    get colCountByScreen(): { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined } {
        return this._getOption('colCountByScreen');
    }
    set colCountByScreen(value: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }) {
        this._setOption('colCountByScreen', value);
    }


    /**
     * [descr:dxFormOptions.customizeItem]
    
     */
    @Input()
    get customizeItem(): Function {
        return this._getOption('customizeItem');
    }
    set customizeItem(value: Function) {
        this._setOption('customizeItem', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:WidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxFormOptions.formData]
    
     */
    @Input()
    get formData(): any {
        return this._getOption('formData');
    }
    set formData(value: any) {
        this._setOption('formData', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    /**
     * [descr:WidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxFormOptions.isDirty]
    
     */
    @Input()
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }


    /**
     * [descr:dxFormOptions.items]
    
     */
    @Input()
    get items(): Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem> {
        return this._getOption('items');
    }
    set items(value: Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>) {
        this._setOption('items', value);
    }


    /**
     * [descr:dxFormOptions.labelLocation]
    
     */
    @Input()
    get labelLocation(): LabelLocation {
        return this._getOption('labelLocation');
    }
    set labelLocation(value: LabelLocation) {
        this._setOption('labelLocation', value);
    }


    /**
     * [descr:dxFormOptions.labelMode]
    
     */
    @Input()
    get labelMode(): FormLabelMode {
        return this._getOption('labelMode');
    }
    set labelMode(value: FormLabelMode) {
        this._setOption('labelMode', value);
    }


    /**
     * [descr:dxFormOptions.minColWidth]
    
     */
    @Input()
    get minColWidth(): number {
        return this._getOption('minColWidth');
    }
    set minColWidth(value: number) {
        this._setOption('minColWidth', value);
    }


    /**
     * [descr:dxFormOptions.optionalMark]
    
     */
    @Input()
    get optionalMark(): string {
        return this._getOption('optionalMark');
    }
    set optionalMark(value: string) {
        this._setOption('optionalMark', value);
    }


    /**
     * [descr:dxFormOptions.readOnly]
    
     */
    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }


    /**
     * [descr:dxFormOptions.requiredMark]
    
     */
    @Input()
    get requiredMark(): string {
        return this._getOption('requiredMark');
    }
    set requiredMark(value: string) {
        this._setOption('requiredMark', value);
    }


    /**
     * [descr:dxFormOptions.requiredMessage]
    
     */
    @Input()
    get requiredMessage(): string {
        return this._getOption('requiredMessage');
    }
    set requiredMessage(value: string) {
        this._setOption('requiredMessage', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxFormOptions.screenByWidth]
    
     */
    @Input()
    get screenByWidth(): Function {
        return this._getOption('screenByWidth');
    }
    set screenByWidth(value: Function) {
        this._setOption('screenByWidth', value);
    }


    /**
     * [descr:dxFormOptions.scrollingEnabled]
    
     */
    @Input()
    get scrollingEnabled(): boolean {
        return this._getOption('scrollingEnabled');
    }
    set scrollingEnabled(value: boolean) {
        this._setOption('scrollingEnabled', value);
    }


    /**
     * [descr:dxFormOptions.showColonAfterLabel]
    
     */
    @Input()
    get showColonAfterLabel(): boolean {
        return this._getOption('showColonAfterLabel');
    }
    set showColonAfterLabel(value: boolean) {
        this._setOption('showColonAfterLabel', value);
    }


    /**
     * [descr:dxFormOptions.showOptionalMark]
    
     */
    @Input()
    get showOptionalMark(): boolean {
        return this._getOption('showOptionalMark');
    }
    set showOptionalMark(value: boolean) {
        this._setOption('showOptionalMark', value);
    }


    /**
     * [descr:dxFormOptions.showRequiredMark]
    
     */
    @Input()
    get showRequiredMark(): boolean {
        return this._getOption('showRequiredMark');
    }
    set showRequiredMark(value: boolean) {
        this._setOption('showRequiredMark', value);
    }


    /**
     * [descr:dxFormOptions.showValidationSummary]
    
     */
    @Input()
    get showValidationSummary(): boolean {
        return this._getOption('showValidationSummary');
    }
    set showValidationSummary(value: boolean) {
        this._setOption('showValidationSummary', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxFormOptions.validationGroup]
    
     */
    @Input()
    get validationGroup(): string | undefined {
        return this._getOption('validationGroup');
    }
    set validationGroup(value: string | undefined) {
        this._setOption('validationGroup', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxFormOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxFormOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxFormOptions.onEditorEnterKey]
    
    
     */
    @Output() onEditorEnterKey: EventEmitter<EditorEnterKeyEvent>;

    /**
    
     * [descr:dxFormOptions.onFieldDataChanged]
    
    
     */
    @Output() onFieldDataChanged: EventEmitter<FieldDataChangedEvent>;

    /**
    
     * [descr:dxFormOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxFormOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() alignItemLabelsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() alignItemLabelsInAllGroupsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colCountChange: EventEmitter<Mode | number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colCountByScreenChange: EventEmitter<{ lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeItemChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() formDataChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() isDirtyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelLocationChange: EventEmitter<LabelLocation>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelModeChange: EventEmitter<FormLabelMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minColWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() optionalMarkChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() readOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() requiredMarkChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() requiredMessageChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() screenByWidthChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showColonAfterLabelChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showOptionalMarkChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showRequiredMarkChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showValidationSummaryChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationGroupChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;




    @ContentChildren(DxiItemComponent)
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'editorEnterKey', emit: 'onEditorEnterKey' },
            { subscribe: 'fieldDataChanged', emit: 'onFieldDataChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'alignItemLabelsChange' },
            { emit: 'alignItemLabelsInAllGroupsChange' },
            { emit: 'colCountChange' },
            { emit: 'colCountByScreenChange' },
            { emit: 'customizeItemChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'formDataChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'isDirtyChange' },
            { emit: 'itemsChange' },
            { emit: 'labelLocationChange' },
            { emit: 'labelModeChange' },
            { emit: 'minColWidthChange' },
            { emit: 'optionalMarkChange' },
            { emit: 'readOnlyChange' },
            { emit: 'requiredMarkChange' },
            { emit: 'requiredMessageChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'screenByWidthChange' },
            { emit: 'scrollingEnabledChange' },
            { emit: 'showColonAfterLabelChange' },
            { emit: 'showOptionalMarkChange' },
            { emit: 'showRequiredMarkChange' },
            { emit: 'showValidationSummaryChange' },
            { emit: 'tabIndexChange' },
            { emit: 'validationGroupChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxForm(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('items', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('items');
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
    DxoColCountByScreenModule,
    DxiItemModule,
    DxoLabelModule,
    DxiValidationRuleModule,
    DxoTabPanelOptionsModule,
    DxiTabModule,
    DxoButtonOptionsModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxFormComponent
  ],
  exports: [
    DxFormComponent,
    DxoColCountByScreenModule,
    DxiItemModule,
    DxoLabelModule,
    DxiValidationRuleModule,
    DxoTabPanelOptionsModule,
    DxiTabModule,
    DxoButtonOptionsModule,
    DxTemplateModule
  ]
})
export class DxFormModule { }

import type * as DxFormTypes from "devextreme/ui/form_types";
export { DxFormTypes };


