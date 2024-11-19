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
    Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import { ClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, OptionChangedEvent } from 'devextreme/ui/button';
import { ButtonStyle, ButtonType } from 'devextreme/common';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-number-box-options',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoNumberBoxOptionsComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get onClick(): ((e: ClickEvent) => void) {
        return this._getOption('onClick');
    }
    set onClick(value: ((e: ClickEvent) => void)) {
        this._setOption('onClick', value);
    }

    @Input()
    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get stylingMode(): ButtonStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: ButtonStyle) {
        this._setOption('stylingMode', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get type(): ButtonType | string {
        return this._getOption('type');
    }
    set type(value: ButtonType | string) {
        this._setOption('type', value);
    }

    @Input()
    get useSubmitBehavior(): boolean {
        return this._getOption('useSubmitBehavior');
    }
    set useSubmitBehavior(value: boolean) {
        this._setOption('useSubmitBehavior', value);
    }

    @Input()
    get validationGroup(): string | undefined {
        return this._getOption('validationGroup');
    }
    set validationGroup(value: string | undefined) {
        this._setOption('validationGroup', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'options';
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
    DxoNumberBoxOptionsComponent
  ],
  exports: [
    DxoNumberBoxOptionsComponent
  ],
})
export class DxoNumberBoxOptionsModule { }
