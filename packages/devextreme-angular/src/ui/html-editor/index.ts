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
    forwardRef,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import { Converter, dxHtmlEditorImageUpload, dxHtmlEditorMediaResizing, dxHtmlEditorMention, ContentReadyEvent, DisposingEvent, FocusInEvent, FocusOutEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent, dxHtmlEditorTableContextMenu, dxHtmlEditorTableResizing, dxHtmlEditorToolbar, dxHtmlEditorVariables } from 'devextreme/ui/html_editor';
import { EditorStyle, ValidationMessageMode, Position, ValidationStatus } from 'devextreme/common';

import DxHtmlEditor from 'devextreme/ui/html_editor';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoConverterModule } from 'devextreme-angular/ui/nested';
import { DxoImageUploadModule } from 'devextreme-angular/ui/nested';
import { DxoFileUploaderOptionsModule } from 'devextreme-angular/ui/nested';
import { DxiTabModule } from 'devextreme-angular/ui/nested';
import { DxoMediaResizingModule } from 'devextreme-angular/ui/nested';
import { DxiMentionModule } from 'devextreme-angular/ui/nested';
import { DxoTableContextMenuModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoTableResizingModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { DxoVariablesModule } from 'devextreme-angular/ui/nested';

import { DxoHtmlEditorConverterModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorFileUploaderOptionsModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorImageUploadModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxiHtmlEditorItemModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorMediaResizingModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxiHtmlEditorMentionModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxiHtmlEditorTabModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorTableContextMenuModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxiHtmlEditorTableContextMenuItemModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorTableResizingModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorToolbarModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxiHtmlEditorToolbarItemModule } from 'devextreme-angular/ui/html-editor/nested';
import { DxoHtmlEditorVariablesModule } from 'devextreme-angular/ui/html-editor/nested';

import { DxiMentionComponent } from 'devextreme-angular/ui/nested';

import { DxiHtmlEditorMentionComponent } from 'devextreme-angular/ui/html-editor/nested';



const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxHtmlEditorComponent),
    multi: true
};
/**
 * [descr:dxHtmlEditor]

 */
@Component({
    selector: 'dx-html-editor',
    template: '<ng-content></ng-content>',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxHtmlEditorComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxHtmlEditor = null;

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
     * [descr:dxHtmlEditorOptions.allowSoftLineBreak]
    
     */
    @Input()
    get allowSoftLineBreak(): boolean {
        return this._getOption('allowSoftLineBreak');
    }
    set allowSoftLineBreak(value: boolean) {
        this._setOption('allowSoftLineBreak', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.converter]
    
     */
    @Input()
    get converter(): Converter | undefined {
        return this._getOption('converter');
    }
    set converter(value: Converter | undefined) {
        this._setOption('converter', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.customizeModules]
    
     */
    @Input()
    get customizeModules(): ((config: any) => void) {
        return this._getOption('customizeModules');
    }
    set customizeModules(value: ((config: any) => void)) {
        this._setOption('customizeModules', value);
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
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
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
     * [descr:dxHtmlEditorOptions.imageUpload]
    
     */
    @Input()
    get imageUpload(): dxHtmlEditorImageUpload {
        return this._getOption('imageUpload');
    }
    set imageUpload(value: dxHtmlEditorImageUpload) {
        this._setOption('imageUpload', value);
    }


    /**
     * [descr:EditorOptions.isDirty]
    
     */
    @Input()
    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }


    /**
     * [descr:EditorOptions.isValid]
    
     */
    @Input()
    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.mediaResizing]
    
     */
    @Input()
    get mediaResizing(): dxHtmlEditorMediaResizing {
        return this._getOption('mediaResizing');
    }
    set mediaResizing(value: dxHtmlEditorMediaResizing) {
        this._setOption('mediaResizing', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.mentions]
    
     */
    @Input()
    get mentions(): Array<dxHtmlEditorMention> {
        return this._getOption('mentions');
    }
    set mentions(value: Array<dxHtmlEditorMention>) {
        this._setOption('mentions', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.name]
    
     */
    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.placeholder]
    
     */
    @Input()
    get placeholder(): string {
        return this._getOption('placeholder');
    }
    set placeholder(value: string) {
        this._setOption('placeholder', value);
    }


    /**
     * [descr:EditorOptions.readOnly]
    
     */
    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
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
     * [descr:dxHtmlEditorOptions.stylingMode]
    
     */
    @Input()
    get stylingMode(): EditorStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: EditorStyle) {
        this._setOption('stylingMode', value);
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
     * [descr:dxHtmlEditorOptions.tableContextMenu]
    
     */
    @Input()
    get tableContextMenu(): dxHtmlEditorTableContextMenu {
        return this._getOption('tableContextMenu');
    }
    set tableContextMenu(value: dxHtmlEditorTableContextMenu) {
        this._setOption('tableContextMenu', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.tableResizing]
    
     */
    @Input()
    get tableResizing(): dxHtmlEditorTableResizing {
        return this._getOption('tableResizing');
    }
    set tableResizing(value: dxHtmlEditorTableResizing) {
        this._setOption('tableResizing', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.toolbar]
    
     */
    @Input()
    get toolbar(): dxHtmlEditorToolbar {
        return this._getOption('toolbar');
    }
    set toolbar(value: dxHtmlEditorToolbar) {
        this._setOption('toolbar', value);
    }


    /**
     * [descr:EditorOptions.validationError]
    
     */
    @Input()
    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }


    /**
     * [descr:EditorOptions.validationErrors]
    
     */
    @Input()
    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }


    /**
     * [descr:EditorOptions.validationMessageMode]
    
     */
    @Input()
    get validationMessageMode(): ValidationMessageMode {
        return this._getOption('validationMessageMode');
    }
    set validationMessageMode(value: ValidationMessageMode) {
        this._setOption('validationMessageMode', value);
    }


    /**
     * [descr:EditorOptions.validationMessagePosition]
    
     */
    @Input()
    get validationMessagePosition(): Position {
        return this._getOption('validationMessagePosition');
    }
    set validationMessagePosition(value: Position) {
        this._setOption('validationMessagePosition', value);
    }


    /**
     * [descr:EditorOptions.validationStatus]
    
     */
    @Input()
    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }


    /**
     * [descr:EditorOptions.value]
    
     */
    @Input()
    get value(): any {
        return this._getOption('value');
    }
    set value(value: any) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxHtmlEditorOptions.variables]
    
     */
    @Input()
    get variables(): dxHtmlEditorVariables {
        return this._getOption('variables');
    }
    set variables(value: dxHtmlEditorVariables) {
        this._setOption('variables', value);
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
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxHtmlEditorOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxHtmlEditorOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxHtmlEditorOptions.onFocusIn]
    
    
     */
    @Output() onFocusIn: EventEmitter<FocusInEvent>;

    /**
    
     * [descr:dxHtmlEditorOptions.onFocusOut]
    
    
     */
    @Output() onFocusOut: EventEmitter<FocusOutEvent>;

    /**
    
     * [descr:dxHtmlEditorOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxHtmlEditorOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxHtmlEditorOptions.onValueChanged]
    
    
     */
    @Output() onValueChanged: EventEmitter<ValueChangedEvent>;

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
    @Output() allowSoftLineBreakChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() converterChange: EventEmitter<Converter | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeModulesChange: EventEmitter<((config: any) => void)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

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
    @Output() imageUploadChange: EventEmitter<dxHtmlEditorImageUpload>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() isDirtyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() isValidChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() mediaResizingChange: EventEmitter<dxHtmlEditorMediaResizing>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() mentionsChange: EventEmitter<Array<dxHtmlEditorMention>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() placeholderChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() readOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stylingModeChange: EventEmitter<EditorStyle>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tableContextMenuChange: EventEmitter<dxHtmlEditorTableContextMenu>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tableResizingChange: EventEmitter<dxHtmlEditorTableResizing>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarChange: EventEmitter<dxHtmlEditorToolbar>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationErrorChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationErrorsChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationMessageModeChange: EventEmitter<ValidationMessageMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationMessagePositionChange: EventEmitter<Position>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() validationStatusChange: EventEmitter<ValidationStatus>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() variablesChange: EventEmitter<dxHtmlEditorVariables>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};


    @ContentChildren(DxiHtmlEditorMentionComponent)
    get mentionsChildren(): QueryList<DxiHtmlEditorMentionComponent> {
        return this._getOption('mentions');
    }
    set mentionsChildren(value) {
        this._setChildren('mentions', value, 'DxiHtmlEditorMentionComponent');
    }


    @ContentChildren(DxiMentionComponent)
    get mentionsLegacyChildren(): QueryList<DxiMentionComponent> {
        return this._getOption('mentions');
    }
    set mentionsLegacyChildren(value) {
        this._setChildren('mentions', value, 'DxiMentionComponent');
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
            { subscribe: 'focusIn', emit: 'onFocusIn' },
            { subscribe: 'focusOut', emit: 'onFocusOut' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowSoftLineBreakChange' },
            { emit: 'converterChange' },
            { emit: 'customizeModulesChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'imageUploadChange' },
            { emit: 'isDirtyChange' },
            { emit: 'isValidChange' },
            { emit: 'mediaResizingChange' },
            { emit: 'mentionsChange' },
            { emit: 'nameChange' },
            { emit: 'placeholderChange' },
            { emit: 'readOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'tableContextMenuChange' },
            { emit: 'tableResizingChange' },
            { emit: 'toolbarChange' },
            { emit: 'validationErrorChange' },
            { emit: 'validationErrorsChange' },
            { emit: 'validationMessageModeChange' },
            { emit: 'validationMessagePositionChange' },
            { emit: 'validationStatusChange' },
            { emit: 'valueChange' },
            { emit: 'variablesChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'onBlur' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxHtmlEditor(element, options);
    }


    writeValue(value: any): void {
        this.eventHelper.lockedValueChangeEvent = true;
        this.value = value;
        this.eventHelper.lockedValueChangeEvent = false;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnChange(fn: (_: any) => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }

    _createWidget(element: any) {
        super._createWidget(element);
        this.instance.on('focusOut', (e) => {
            this.eventHelper.fireNgEvent('onBlur', [e]);
        });
    }

    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('mentions', changes);
        this.setupChanges('validationErrors', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('mentions');
        this._idh.doCheck('validationErrors');
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
    DxoConverterModule,
    DxoImageUploadModule,
    DxoFileUploaderOptionsModule,
    DxiTabModule,
    DxoMediaResizingModule,
    DxiMentionModule,
    DxoTableContextMenuModule,
    DxiItemModule,
    DxoTableResizingModule,
    DxoToolbarModule,
    DxoVariablesModule,
    DxoHtmlEditorConverterModule,
    DxoHtmlEditorFileUploaderOptionsModule,
    DxoHtmlEditorImageUploadModule,
    DxiHtmlEditorItemModule,
    DxoHtmlEditorMediaResizingModule,
    DxiHtmlEditorMentionModule,
    DxiHtmlEditorTabModule,
    DxoHtmlEditorTableContextMenuModule,
    DxiHtmlEditorTableContextMenuItemModule,
    DxoHtmlEditorTableResizingModule,
    DxoHtmlEditorToolbarModule,
    DxiHtmlEditorToolbarItemModule,
    DxoHtmlEditorVariablesModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxHtmlEditorComponent
  ],
  exports: [
    DxHtmlEditorComponent,
    DxoConverterModule,
    DxoImageUploadModule,
    DxoFileUploaderOptionsModule,
    DxiTabModule,
    DxoMediaResizingModule,
    DxiMentionModule,
    DxoTableContextMenuModule,
    DxiItemModule,
    DxoTableResizingModule,
    DxoToolbarModule,
    DxoVariablesModule,
    DxoHtmlEditorConverterModule,
    DxoHtmlEditorFileUploaderOptionsModule,
    DxoHtmlEditorImageUploadModule,
    DxiHtmlEditorItemModule,
    DxoHtmlEditorMediaResizingModule,
    DxiHtmlEditorMentionModule,
    DxiHtmlEditorTabModule,
    DxoHtmlEditorTableContextMenuModule,
    DxiHtmlEditorTableContextMenuItemModule,
    DxoHtmlEditorTableResizingModule,
    DxoHtmlEditorToolbarModule,
    DxiHtmlEditorToolbarItemModule,
    DxoHtmlEditorVariablesModule,
    DxTemplateModule
  ]
})
export class DxHtmlEditorModule { }

import type * as DxHtmlEditorTypes from "devextreme/ui/html_editor_types";
export { DxHtmlEditorTypes };


