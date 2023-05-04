/* tslint:disable:max-line-length */
<# 
var collectionProperties = it.properties.filter(item => item.isCollection).map(item => item.name);
var collectionNestedComponents = it.nestedComponents.filter(item => item.isCollection && item.root);
var baseClass = it.isExtension ? 'DxComponentExtension' : 'DxComponent';
var reExportExplicitTypes = it.optionsTypeParams && it.optionsTypeParams.length;

var implementedInterfaces = ['OnDestroy'];

it.isEditor && implementedInterfaces.push('ControlValueAccessor');
collectionProperties.length && implementedInterfaces.push('OnChanges', 'DoCheck');
#>

import { TransferState } from '@angular/platform-browser';

import {
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,<#? it.isExtension #>
    SkipSelf,
    Optional,
    Host,<#?#>
    EventEmitter<#? it.isEditor #>,
    forwardRef,
    HostListener<#?#><#? collectionProperties.length #>,
    OnChanges,
    DoCheck,
    SimpleChanges<#?#><#? collectionNestedComponents.length #>,
    ContentChildren,
    QueryList<#?#>
} from '@angular/core';

<#? reExportExplicitTypes #>export { ExplicitTypes } from '<#= it.module #>';
<#?#>
<#? it.imports #><#~ it.imports :file #>import <#= file.importString #> from '<#= file.path #>';
<#~#><#?#>
import <#= it.className #> from '<#= it.module #>';
<#? it.isEditor #>
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';<#?#>

import {
    <#= baseClass #>,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,<#? collectionProperties.length #>
    IterableDifferHelper,<#?#>
    WatcherHelper
} from 'devextreme-angular/core';

<#~ it.nestedComponents :component:i #>import { <#= component.className #>Module } from '<#= it.packageName #>/ui/nested';
<#~#>
<#~ collectionNestedComponents :component:i #>import { <#= component.className #>Component } from '<#= it.packageName #>/ui/nested';
<#~#>

<#? it.isEditor #>

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => <#= it.className #>Component),
    multi: true
};<#?#>
/**
 * [descr:<#= it.docID #>]
<#? it.isDeprecated #>
 * @deprecated [depNote:<#= it.docID #>]
<#?#>
 */
@Component({
    selector: '<#= it.selector #>',
    template: '<#? it.isTranscludedContent #><ng-content></ng-content><#?#>',<#? it.isViz #>
    styles: [ ' :host {  display: block; }'],<#?#>
    providers: [
        DxTemplateHost,
        WatcherHelper,<#? it.isEditor #>
        CUSTOM_VALUE_ACCESSOR_PROVIDER,<#?#>
        NestedOptionHost<#? collectionProperties.length #>,
        IterableDifferHelper<#?#>
    ]
})
export class <#= it.className #>Component extends <#= baseClass #> <#? implementedInterfaces.length #>implements <#= implementedInterfaces.join(', ') #> <#?#>{
    instance: <#= it.className #>;
<#~ it.properties :prop:i #>
    /**
     * [descr:<#= prop.docID #>]
    <#? prop.isDeprecated #>
     * @deprecated [depNote:<#= prop.docID #>]
    <#?#>
     */
    @Input()
    get <#= prop.name #>(): <#= prop.type #> {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: <#= prop.type #>) {
        this._setOption('<#= prop.name #>', value);
    }<#? i < it.properties.length-1 #>

<#?#><#~#>
<#~ it.events :event:i #>
    /**
    <#? event.isInternal #>
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    <#??#>
     * [descr:<#= event.docID #>]
    <#? event.isDeprecated #>
     * @deprecated [depNote:<#= event.docID #>]
    <#?#>
    <#?#>
     */
    @Output() <#= event.emit #>: <#= event.type #>;<#? i < it.events.length-1 #>
<#?#><#~#>

<#? it.isEditor #>
    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};<#?#>

<#~ collectionNestedComponents :component:i #>
    @ContentChildren(<#= component.className #>Component)
    get <#= component.propertyName #>Children(): QueryList<<#= component.className #>Component> {
        return this._getOption('<#= component.propertyName #>');
    }
    set <#= component.propertyName #>Children(value) {
        this.setChildren('<#= component.propertyName #>', value);
    }
<#~#>

<#? it.isExtension #>
    parentElement: any;
<#?#>

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            <#? collectionProperties.length #>private <#?#>_watcherHelper: WatcherHelper<#? collectionProperties.length #>,
            private _idh: IterableDifferHelper<#?#>,<#? it.isExtension #>
            @SkipSelf() @Optional() @Host() parentOptionHost: NestedOptionHost,<#?#>
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            <#~ it.events :event:i #>{ <#? event.subscribe #>subscribe: '<#= event.subscribe #>', <#?#>emit: '<#= event.emit #>' }<#? i < it.events.length-1 #>,
            <#?#><#~#>
        ]);<#? it.isExtension #>
        this.parentElement = this.getParentElement(parentOptionHost);<#?#><#? collectionProperties.length #>

        this._idh.setHost(this);<#?#>
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {
<#? it.isExtension #>
        if (this.parentElement) {
            return new DxValidator(this.parentElement, options);
        }
<#?#>
        return new <#= it.className #>(element, options);
    }
<#? it.isExtension #>
    private getParentElement(host) {
        if (host) {
            const parentHost = host.getHost();
            return (parentHost as any).element.nativeElement;
        }
        return;
    }
<#?#>
<#? it.isEditor #>
    writeValue(value: any): void {
        this.eventHelper.lockedValueChangeEvent = true;
        this.value = value;
        this.eventHelper.lockedValueChangeEvent = false;
    }
<#? it.widgetName !== "dxRangeSelector" #>
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
<#?#>
    registerOnChange(fn: (_: any) => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }

    _createWidget(element: any) {
        super._createWidget(element);
        this.instance.on('focusOut', (e) => {
            this.eventHelper.fireNgEvent('onBlur', [e]);
        });
    }
<#?#>
    ngOnDestroy() {
        this._destroyWidget();
    }
<#? collectionProperties.length #>
    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);<#~ collectionProperties :prop:i #>
        this.setupChanges('<#= prop #>', changes);<#~#>
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {<#~ collectionProperties :prop:i #>
        this._idh.doCheck('<#= prop #>');<#~#>
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
    }<#?#>
}

@NgModule({
  imports: [<#~ it.nestedComponents :component:i #>
    <#= component.className #>Module,<#~#>
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    <#= it.className #>Component
  ],
  exports: [
    <#= it.className #>Component<#~ it.nestedComponents :component:i #>,
    <#= component.className #>Module<#~#>,
    DxTemplateModule
  ]
})
export class <#= it.className #>Module { }
<#? it.renderReexports #>
import type * as <#= it.className #>Types from "<#= it.module #>_types";
export { <#= it.className #>Types };
<#?#>

