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
    Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import { VectorMapLegendItem } from 'devextreme/viz/vector_map';
import { Font } from 'devextreme/common/charts';
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-vector-map-legend',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiVectorMapLegendComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
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
    get columnCount(): number {
        return this._getOption('columnCount');
    }
    set columnCount(value: number) {
        this._setOption('columnCount', value);
    }

    @Input()
    get columnItemSpacing(): number {
        return this._getOption('columnItemSpacing');
    }
    set columnItemSpacing(value: number) {
        this._setOption('columnItemSpacing', value);
    }

    @Input()
    get customizeHint(): ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string) {
        return this._getOption('customizeHint');
    }
    set customizeHint(value: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string)) {
        this._setOption('customizeHint', value);
    }

    @Input()
    get customizeItems(): ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>) {
        return this._getOption('customizeItems');
    }
    set customizeItems(value: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>)) {
        this._setOption('customizeItems', value);
    }

    @Input()
    get customizeText(): ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string)) {
        this._setOption('customizeText', value);
    }

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
    get itemsAlignment(): "center" | "left" | "right" {
        return this._getOption('itemsAlignment');
    }
    set itemsAlignment(value: "center" | "left" | "right") {
        this._setOption('itemsAlignment', value);
    }

    @Input()
    get itemTextPosition(): "bottom" | "left" | "right" | "top" {
        return this._getOption('itemTextPosition');
    }
    set itemTextPosition(value: "bottom" | "left" | "right" | "top") {
        this._setOption('itemTextPosition', value);
    }

    @Input()
    get margin(): number | Record<string, any> {
        return this._getOption('margin');
    }
    set margin(value: number | Record<string, any>) {
        this._setOption('margin', value);
    }

    @Input()
    get markerColor(): string {
        return this._getOption('markerColor');
    }
    set markerColor(value: string) {
        this._setOption('markerColor', value);
    }

    @Input()
    get markerShape(): "circle" | "square" {
        return this._getOption('markerShape');
    }
    set markerShape(value: "circle" | "square") {
        this._setOption('markerShape', value);
    }

    @Input()
    get markerSize(): number {
        return this._getOption('markerSize');
    }
    set markerSize(value: number) {
        this._setOption('markerSize', value);
    }

    @Input()
    get markerTemplate(): ((legendItem: VectorMapLegendItem, element: any) => string | any) | template {
        return this._getOption('markerTemplate');
    }
    set markerTemplate(value: ((legendItem: VectorMapLegendItem, element: any) => string | any) | template) {
        this._setOption('markerTemplate', value);
    }

    @Input()
    get orientation(): "horizontal" | "vertical" {
        return this._getOption('orientation');
    }
    set orientation(value: "horizontal" | "vertical") {
        this._setOption('orientation', value);
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
    get rowCount(): number {
        return this._getOption('rowCount');
    }
    set rowCount(value: number) {
        this._setOption('rowCount', value);
    }

    @Input()
    get rowItemSpacing(): number {
        return this._getOption('rowItemSpacing');
    }
    set rowItemSpacing(value: number) {
        this._setOption('rowItemSpacing', value);
    }

    @Input()
    get source(): Record<string, any> {
        return this._getOption('source');
    }
    set source(value: Record<string, any>) {
        this._setOption('source', value);
    }

    @Input()
    get title(): Record<string, any> | string {
        return this._getOption('title');
    }
    set title(value: Record<string, any> | string) {
        this._setOption('title', value);
    }

    @Input()
    get verticalAlignment(): "bottom" | "top" {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: "bottom" | "top") {
        this._setOption('verticalAlignment', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'legends';
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

}

@NgModule({
  declarations: [
    DxiVectorMapLegendComponent
  ],
  exports: [
    DxiVectorMapLegendComponent
  ],
})
export class DxiVectorMapLegendModule { }
