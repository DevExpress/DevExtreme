/* tslint:disable:max-line-length */

<#? it.inputs #>/* tslint:disable:use-input-property-decorator */
<#?#>
import {
    Component,<#? !it.isCollection #>
    OnInit,
    OnDestroy,<#?#>
    NgModule,
    Host,<#? it.hasTemplate #>
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,<#?#>
    SkipSelf<#? it.properties #>,
    Input<#?#><#? it.events #>,
    Output,
    EventEmitter<#?#><#? it.collectionNestedComponents.length #>,
    ContentChildren,
    forwardRef,
    QueryList<#?#>
} from '@angular/core';

<#? it.hasTemplate #>import { DOCUMENT } from '@angular/common';<#?#>


<#? it.imports #><#~ it.imports :file #>import <#= file.importString #> from '<#= file.path #>';
<#~#><#?#>
import {
    NestedOptionHost,<#? it.hasTemplate #>
    extractTemplate,<#?#><#? it.hasTemplate #>
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost<#?#>
} from 'devextreme-angular/core';
import { <#= it.baseClass #> } from '<#= it.basePath #>';
<#~ it.collectionNestedComponents :component:i #><#? component.className !== it.className #>import { <#= component.className #>Component } from './<#= component.path #>';
<#?#><#~#>

@Component({
    selector: '<#= it.selector #>',
    template: '<#? it.hasTemplate #><ng-content></ng-content><#?#>',
    styles: ['<#? it.hasTemplate #>:host { display: block; }<#?#>'],
    providers: [NestedOptionHost<#? it.hasTemplate #>, DxTemplateHost<#?#>]<#? it.inputs #>,
    inputs: [<#~ it.inputs :input:i #>
        '<#= input.name #>'<#? i < it.inputs.length-1 #>,<#?#><#~#>
    ]<#?#>
})
export class <#= it.className #>Component extends <#= it.baseClass #><#? it.hasTemplate #> implements AfterViewInit,<#? !it.isCollection #> OnDestroy, OnInit,<#?#>
    IDxTemplateHost<#?#><#? !it.isCollection && !it.hasTemplate #> implements OnDestroy, OnInit <#?#> {<#~ it.properties :prop:i #>
    @Input()
    get <#= prop.name #>(): <#= prop.type #> {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: <#= prop.type #>) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>
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
    protected get _optionPath() {
        return '<#= it.optionName #>';
    }

<#~ it.collectionNestedComponents :component:i #>
    @ContentChildren(forwardRef(() => <#= component.className #>Component))
    get <#= component.propertyName #>Children(): QueryList<<#= component.className #>Component> {
        return this._getOption('<#= component.propertyName #>');
    }
    set <#= component.propertyName #>Children(value) {
        this.setChildren('<#= component.propertyName #>', value);
    }
<#~#>
    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost<#? it.hasTemplate #>,
            private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            @Host() templateHost: DxTemplateHost,
            private element: ElementRef<#?#>) {
        super();<#? it.events #>

        this._createEventEmitters([
            <#~ it.events :event:i #>{ emit: '<#= event.emit #>' }<#? i < it.events.length-1 #>,
            <#?#><#~#>
        ]);
<#?#>
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));<#? it.hasTemplate #>
        templateHost.setHost(this);<#?#><#? it.optionName === 'dataSource' #>
        if ((console) && (console.warn)) {
            console.warn('The nested \'<#= it.selector #>\' component is deprecated in 17.2. ' +
                'Use the \'<#= it.optionName #>\' option instead. ' +
                'See:\nhttps://github.com/DevExpress/devextreme-angular/blob/master/CHANGELOG.md#17.2.3'
            );
        }<#?#>
    }
<#? it.hasTemplate #>
    setTemplate(template: DxTemplateDirective) {
        this.template = template;
    }
    ngAfterViewInit() {
        extractTemplate(this, this.element, this.renderer, this.document);
    }
<#?#>
<#? !it.isCollection #>
    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }
<#?#>
<#? it.isCollection #>
    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }
<#?#>
}

@NgModule({
  declarations: [
    <#= it.className #>Component
  ],
  exports: [
    <#= it.className #>Component
  ],
})
export class <#= it.className #>Module { }
