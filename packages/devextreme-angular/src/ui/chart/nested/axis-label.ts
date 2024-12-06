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


import { HorizontalAlignment, Position } from 'devextreme/common';
import { ChartLabelDisplayMode } from 'devextreme/viz/chart';
import { Font, ChartsAxisLabelOverlap, RelativePosition, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-axis-label',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoChartAxisLabelComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get alignment(): HorizontalAlignment | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | undefined) {
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
    get displayMode(): ChartLabelDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: ChartLabelDisplayMode) {
        this._setOption('displayMode', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get format(): Format | undefined {
        return this._getOption('format');
    }
    set format(value: Format | undefined) {
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
    get overlappingBehavior(): ChartsAxisLabelOverlap {
        return this._getOption('overlappingBehavior');
    }
    set overlappingBehavior(value: ChartsAxisLabelOverlap) {
        this._setOption('overlappingBehavior', value);
    }

    @Input()
    get position(): Position | RelativePosition {
        return this._getOption('position');
    }
    set position(value: Position | RelativePosition) {
        this._setOption('position', value);
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
    get textOverflow(): TextOverflow {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: TextOverflow) {
        this._setOption('textOverflow', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get wordWrap(): WordWrap {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: WordWrap) {
        this._setOption('wordWrap', value);
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
    DxoChartAxisLabelComponent
  ],
  exports: [
    DxoChartAxisLabelComponent
  ],
})
export class DxoChartAxisLabelModule { }
