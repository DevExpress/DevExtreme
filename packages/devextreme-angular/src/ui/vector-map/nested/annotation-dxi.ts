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


import { dxVectorMapAnnotationConfig } from 'devextreme/viz/vector_map';
import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-vector-map-annotation',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiVectorMapAnnotationComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get allowDragging(): boolean {
        return this._getOption('allowDragging');
    }
    set allowDragging(value: boolean) {
        this._setOption('allowDragging', value);
    }

    @Input()
    get arrowLength(): number {
        return this._getOption('arrowLength');
    }
    set arrowLength(value: number) {
        this._setOption('arrowLength', value);
    }

    @Input()
    get arrowWidth(): number {
        return this._getOption('arrowWidth');
    }
    set arrowWidth(value: number) {
        this._setOption('arrowWidth', value);
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
    get coordinates(): Array<number> {
        return this._getOption('coordinates');
    }
    set coordinates(value: Array<number>) {
        this._setOption('coordinates', value);
    }

    @Input()
    get customizeTooltip(): ((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>) {
        return this._getOption('customizeTooltip');
    }
    set customizeTooltip(value: ((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>)) {
        this._setOption('customizeTooltip', value);
    }

    @Input()
    get data(): any {
        return this._getOption('data');
    }
    set data(value: any) {
        this._setOption('data', value);
    }

    @Input()
    get description(): string {
        return this._getOption('description');
    }
    set description(value: string) {
        this._setOption('description', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    @Input()
    get image(): Record<string, any> | string {
        return this._getOption('image');
    }
    set image(value: Record<string, any> | string) {
        this._setOption('image', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get offsetX(): number {
        return this._getOption('offsetX');
    }
    set offsetX(value: number) {
        this._setOption('offsetX', value);
    }

    @Input()
    get offsetY(): number {
        return this._getOption('offsetY');
    }
    set offsetY(value: number) {
        this._setOption('offsetY', value);
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
    get textOverflow(): "ellipsis" | "hide" | "none" {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: "ellipsis" | "hide" | "none") {
        this._setOption('textOverflow', value);
    }

    @Input()
    get tooltipEnabled(): boolean {
        return this._getOption('tooltipEnabled');
    }
    set tooltipEnabled(value: boolean) {
        this._setOption('tooltipEnabled', value);
    }

    @Input()
    get tooltipTemplate(): any {
        return this._getOption('tooltipTemplate');
    }
    set tooltipTemplate(value: any) {
        this._setOption('tooltipTemplate', value);
    }

    @Input()
    get type(): "text" | "image" | "custom" {
        return this._getOption('type');
    }
    set type(value: "text" | "image" | "custom") {
        this._setOption('type', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }

    @Input()
    get wordWrap(): "normal" | "breakWord" | "none" {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: "normal" | "breakWord" | "none") {
        this._setOption('wordWrap', value);
    }

    @Input()
    get x(): number {
        return this._getOption('x');
    }
    set x(value: number) {
        this._setOption('x', value);
    }

    @Input()
    get y(): number {
        return this._getOption('y');
    }
    set y(value: number) {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'annotations';
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
    DxiVectorMapAnnotationComponent
  ],
  exports: [
    DxiVectorMapAnnotationComponent
  ],
})
export class DxiVectorMapAnnotationModule { }
