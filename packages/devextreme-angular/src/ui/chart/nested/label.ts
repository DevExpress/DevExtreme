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


import * as LocalizationTypes from 'devextreme/localization';
import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-label',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoChartLabelComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get horizontalAlignment(): "center" | "left" | "right" {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: "center" | "left" | "right") {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get position(): "inside" | "outside" | "bottom" | "left" | "right" | "top" {
        return this._getOption('position');
    }
    set position(value: "inside" | "outside" | "bottom" | "left" | "right" | "top") {
        this._setOption('position', value);
    }

    @Input()
    get verticalAlignment(): "bottom" | "center" | "top" {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: "bottom" | "center" | "top") {
        this._setOption('verticalAlignment', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get alignment(): "center" | "left" | "right" {
        return this._getOption('alignment');
    }
    set alignment(value: "center" | "left" | "right") {
        this._setOption('alignment', value);
    }

    @Input()
    get customizeHint(): ((argument: { value: Date | number | string, valueText: string }) => string) {
        return this._getOption('customizeHint');
    }
    set customizeHint(value: ((argument: { value: Date | number | string, valueText: string }) => string)) {
        this._setOption('customizeHint', value);
    }

    @Input()
    get customizeText(): ((argument: { value: Date | number | string, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((argument: { value: Date | number | string, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get displayMode(): "rotate" | "stagger" | "standard" {
        return this._getOption('displayMode');
    }
    set displayMode(value: "rotate" | "stagger" | "standard") {
        this._setOption('displayMode', value);
    }

    @Input()
    get format(): LocalizationTypes.Format {
        return this._getOption('format');
    }
    set format(value: LocalizationTypes.Format) {
        this._setOption('format', value);
    }

    @Input()
    get indentFromAxis(): number {
        return this._getOption('indentFromAxis');
    }
    set indentFromAxis(value: number) {
        this._setOption('indentFromAxis', value);
    }

    @Input()
    get overlappingBehavior(): "rotate" | "stagger" | "none" | "hide" {
        return this._getOption('overlappingBehavior');
    }
    set overlappingBehavior(value: "rotate" | "stagger" | "none" | "hide") {
        this._setOption('overlappingBehavior', value);
    }

    @Input()
    get rotationAngle(): number {
        return this._getOption('rotationAngle');
    }
    set rotationAngle(value: number) {
        this._setOption('rotationAngle', value);
    }

    @Input()
    get staggeringSpacing(): number {
        return this._getOption('staggeringSpacing');
    }
    set staggeringSpacing(value: number) {
        this._setOption('staggeringSpacing', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get textOverflow(): "ellipsis" | "hide" | "none" {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: "ellipsis" | "hide" | "none") {
        this._setOption('textOverflow', value);
    }

    @Input()
    get wordWrap(): "normal" | "breakWord" | "none" {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: "normal" | "breakWord" | "none") {
        this._setOption('wordWrap', value);
    }

    @Input()
    get argumentFormat(): LocalizationTypes.Format {
        return this._getOption('argumentFormat');
    }
    set argumentFormat(value: LocalizationTypes.Format) {
        this._setOption('argumentFormat', value);
    }

    @Input()
    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): Record<string, any> {
        return this._getOption('border');
    }
    set border(value: Record<string, any>) {
        this._setOption('border', value);
    }

    @Input()
    get connector(): Record<string, any> {
        return this._getOption('connector');
    }
    set connector(value: Record<string, any>) {
        this._setOption('connector', value);
    }

    @Input()
    get displayFormat(): string {
        return this._getOption('displayFormat');
    }
    set displayFormat(value: string) {
        this._setOption('displayFormat', value);
    }

    @Input()
    get horizontalOffset(): number {
        return this._getOption('horizontalOffset');
    }
    set horizontalOffset(value: number) {
        this._setOption('horizontalOffset', value);
    }

    @Input()
    get showForZeroValues(): boolean {
        return this._getOption('showForZeroValues');
    }
    set showForZeroValues(value: boolean) {
        this._setOption('showForZeroValues', value);
    }

    @Input()
    get verticalOffset(): number {
        return this._getOption('verticalOffset');
    }
    set verticalOffset(value: number) {
        this._setOption('verticalOffset', value);
    }


    protected get _optionPath() {
        return 'label';
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
    DxoChartLabelComponent
  ],
  exports: [
    DxoChartLabelComponent
  ],
})
export class DxoChartLabelModule { }
