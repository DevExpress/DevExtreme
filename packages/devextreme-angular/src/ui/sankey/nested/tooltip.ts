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
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-sankey-tooltip',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoSankeyTooltipComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get arrowLength(): number {
        return this._getOption('arrowLength');
    }
    set arrowLength(value: number) {
        this._setOption('arrowLength', value);
    }

    @Input()
    get border(): Record<string, any> {
        return this._getOption('border');
    }
    set border(value: Record<string, any>) {
        this._setOption('border', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get container(): any | string {
        return this._getOption('container');
    }
    set container(value: any | string) {
        this._setOption('container', value);
    }

    @Input()
    get cornerRadius(): number {
        return this._getOption('cornerRadius');
    }
    set cornerRadius(value: number) {
        this._setOption('cornerRadius', value);
    }

    @Input()
    get customizeLinkTooltip(): ((info: { source: string, target: string, weight: number }) => Record<string, any>) {
        return this._getOption('customizeLinkTooltip');
    }
    set customizeLinkTooltip(value: ((info: { source: string, target: string, weight: number }) => Record<string, any>)) {
        this._setOption('customizeLinkTooltip', value);
    }

    @Input()
    get customizeNodeTooltip(): ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>) {
        return this._getOption('customizeNodeTooltip');
    }
    set customizeNodeTooltip(value: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>)) {
        this._setOption('customizeNodeTooltip', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get format(): LocalizationTypes.Format {
        return this._getOption('format');
    }
    set format(value: LocalizationTypes.Format) {
        this._setOption('format', value);
    }

    @Input()
    get linkTooltipTemplate(): ((info: { source: string, target: string, weight: number }, element: any) => string | any) | template {
        return this._getOption('linkTooltipTemplate');
    }
    set linkTooltipTemplate(value: ((info: { source: string, target: string, weight: number }, element: any) => string | any) | template) {
        this._setOption('linkTooltipTemplate', value);
    }

    @Input()
    get nodeTooltipTemplate(): ((info: { label: string, weightIn: number, weightOut: number }, element: any) => string | any) | template {
        return this._getOption('nodeTooltipTemplate');
    }
    set nodeTooltipTemplate(value: ((info: { label: string, weightIn: number, weightOut: number }, element: any) => string | any) | template) {
        this._setOption('nodeTooltipTemplate', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get paddingLeftRight(): number {
        return this._getOption('paddingLeftRight');
    }
    set paddingLeftRight(value: number) {
        this._setOption('paddingLeftRight', value);
    }

    @Input()
    get paddingTopBottom(): number {
        return this._getOption('paddingTopBottom');
    }
    set paddingTopBottom(value: number) {
        this._setOption('paddingTopBottom', value);
    }

    @Input()
    get shadow(): Record<string, any> {
        return this._getOption('shadow');
    }
    set shadow(value: Record<string, any>) {
        this._setOption('shadow', value);
    }

    @Input()
    get zIndex(): number {
        return this._getOption('zIndex');
    }
    set zIndex(value: number) {
        this._setOption('zIndex', value);
    }


    protected get _optionPath() {
        return 'tooltip';
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
    DxoSankeyTooltipComponent
  ],
  exports: [
    DxoSankeyTooltipComponent
  ],
})
export class DxoSankeyTooltipModule { }
