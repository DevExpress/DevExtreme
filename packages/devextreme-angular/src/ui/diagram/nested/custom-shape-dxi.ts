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


import { dxSVGElement } from 'devextreme/core/element';
import { dxDiagramShape } from 'devextreme/ui/diagram';
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
    selector: 'dxi-diagram-custom-shape',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiDiagramCustomShapeComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get allowEditImage(): boolean {
        return this._getOption('allowEditImage');
    }
    set allowEditImage(value: boolean) {
        this._setOption('allowEditImage', value);
    }

    @Input()
    get allowEditText(): boolean {
        return this._getOption('allowEditText');
    }
    set allowEditText(value: boolean) {
        this._setOption('allowEditText', value);
    }

    @Input()
    get allowResize(): boolean {
        return this._getOption('allowResize');
    }
    set allowResize(value: boolean) {
        this._setOption('allowResize', value);
    }

    @Input()
    get backgroundImageHeight(): number {
        return this._getOption('backgroundImageHeight');
    }
    set backgroundImageHeight(value: number) {
        this._setOption('backgroundImageHeight', value);
    }

    @Input()
    get backgroundImageLeft(): number {
        return this._getOption('backgroundImageLeft');
    }
    set backgroundImageLeft(value: number) {
        this._setOption('backgroundImageLeft', value);
    }

    @Input()
    get backgroundImageToolboxUrl(): string {
        return this._getOption('backgroundImageToolboxUrl');
    }
    set backgroundImageToolboxUrl(value: string) {
        this._setOption('backgroundImageToolboxUrl', value);
    }

    @Input()
    get backgroundImageTop(): number {
        return this._getOption('backgroundImageTop');
    }
    set backgroundImageTop(value: number) {
        this._setOption('backgroundImageTop', value);
    }

    @Input()
    get backgroundImageUrl(): string {
        return this._getOption('backgroundImageUrl');
    }
    set backgroundImageUrl(value: string) {
        this._setOption('backgroundImageUrl', value);
    }

    @Input()
    get backgroundImageWidth(): number {
        return this._getOption('backgroundImageWidth');
    }
    set backgroundImageWidth(value: number) {
        this._setOption('backgroundImageWidth', value);
    }

    @Input()
    get baseType(): "text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight" {
        return this._getOption('baseType');
    }
    set baseType(value: "text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight") {
        this._setOption('baseType', value);
    }

    @Input()
    get category(): string {
        return this._getOption('category');
    }
    set category(value: string) {
        this._setOption('category', value);
    }

    @Input()
    get connectionPoints(): Array<Record<string, any>> {
        return this._getOption('connectionPoints');
    }
    set connectionPoints(value: Array<Record<string, any>>) {
        this._setOption('connectionPoints', value);
    }

    @Input()
    get defaultHeight(): number {
        return this._getOption('defaultHeight');
    }
    set defaultHeight(value: number) {
        this._setOption('defaultHeight', value);
    }

    @Input()
    get defaultImageUrl(): string {
        return this._getOption('defaultImageUrl');
    }
    set defaultImageUrl(value: string) {
        this._setOption('defaultImageUrl', value);
    }

    @Input()
    get defaultText(): string {
        return this._getOption('defaultText');
    }
    set defaultText(value: string) {
        this._setOption('defaultText', value);
    }

    @Input()
    get defaultWidth(): number {
        return this._getOption('defaultWidth');
    }
    set defaultWidth(value: number) {
        this._setOption('defaultWidth', value);
    }

    @Input()
    get imageHeight(): number {
        return this._getOption('imageHeight');
    }
    set imageHeight(value: number) {
        this._setOption('imageHeight', value);
    }

    @Input()
    get imageLeft(): number {
        return this._getOption('imageLeft');
    }
    set imageLeft(value: number) {
        this._setOption('imageLeft', value);
    }

    @Input()
    get imageTop(): number {
        return this._getOption('imageTop');
    }
    set imageTop(value: number) {
        this._setOption('imageTop', value);
    }

    @Input()
    get imageWidth(): number {
        return this._getOption('imageWidth');
    }
    set imageWidth(value: number) {
        this._setOption('imageWidth', value);
    }

    @Input()
    get keepRatioOnAutoSize(): boolean {
        return this._getOption('keepRatioOnAutoSize');
    }
    set keepRatioOnAutoSize(value: boolean) {
        this._setOption('keepRatioOnAutoSize', value);
    }

    @Input()
    get maxHeight(): number {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number) {
        this._setOption('maxHeight', value);
    }

    @Input()
    get maxWidth(): number {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number) {
        this._setOption('maxWidth', value);
    }

    @Input()
    get minHeight(): number {
        return this._getOption('minHeight');
    }
    set minHeight(value: number) {
        this._setOption('minHeight', value);
    }

    @Input()
    get minWidth(): number {
        return this._getOption('minWidth');
    }
    set minWidth(value: number) {
        this._setOption('minWidth', value);
    }

    @Input()
    get template(): ((container: dxSVGElement, data: { item: dxDiagramShape }) => void) | template {
        return this._getOption('template');
    }
    set template(value: ((container: dxSVGElement, data: { item: dxDiagramShape }) => void) | template) {
        this._setOption('template', value);
    }

    @Input()
    get templateHeight(): number {
        return this._getOption('templateHeight');
    }
    set templateHeight(value: number) {
        this._setOption('templateHeight', value);
    }

    @Input()
    get templateLeft(): number {
        return this._getOption('templateLeft');
    }
    set templateLeft(value: number) {
        this._setOption('templateLeft', value);
    }

    @Input()
    get templateTop(): number {
        return this._getOption('templateTop');
    }
    set templateTop(value: number) {
        this._setOption('templateTop', value);
    }

    @Input()
    get templateWidth(): number {
        return this._getOption('templateWidth');
    }
    set templateWidth(value: number) {
        this._setOption('templateWidth', value);
    }

    @Input()
    get textHeight(): number {
        return this._getOption('textHeight');
    }
    set textHeight(value: number) {
        this._setOption('textHeight', value);
    }

    @Input()
    get textLeft(): number {
        return this._getOption('textLeft');
    }
    set textLeft(value: number) {
        this._setOption('textLeft', value);
    }

    @Input()
    get textTop(): number {
        return this._getOption('textTop');
    }
    set textTop(value: number) {
        this._setOption('textTop', value);
    }

    @Input()
    get textWidth(): number {
        return this._getOption('textWidth');
    }
    set textWidth(value: number) {
        this._setOption('textWidth', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get toolboxTemplate(): ((container: dxSVGElement, data: { item: dxDiagramShape }) => void) | template {
        return this._getOption('toolboxTemplate');
    }
    set toolboxTemplate(value: ((container: dxSVGElement, data: { item: dxDiagramShape }) => void) | template) {
        this._setOption('toolboxTemplate', value);
    }

    @Input()
    get toolboxWidthToHeightRatio(): number {
        return this._getOption('toolboxWidthToHeightRatio');
    }
    set toolboxWidthToHeightRatio(value: number) {
        this._setOption('toolboxWidthToHeightRatio', value);
    }

    @Input()
    get type(): string {
        return this._getOption('type');
    }
    set type(value: string) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'customShapes';
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
    DxiDiagramCustomShapeComponent
  ],
  exports: [
    DxiDiagramCustomShapeComponent
  ],
})
export class DxiDiagramCustomShapeModule { }
