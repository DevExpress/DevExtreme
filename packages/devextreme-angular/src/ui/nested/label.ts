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


import { HorizontalAlignment, HorizontalEdge, Position, VerticalAlignment, VerticalEdge } from 'devextreme/common';
import { ChartsAxisLabelOverlap, DashStyle, Font, LabelOverlap, LabelPosition, RelativePosition, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';
import { LabelLocation } from 'devextreme/ui/form';
import { ChartLabelDisplayMode } from 'devextreme/viz/chart';
import { CircularGaugeLabelOverlap } from 'devextreme/viz/circular_gauge';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-label',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoLabelComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get connectorColor(): string | undefined {
        return this._getOption('connectorColor');
    }
    set connectorColor(value: string | undefined) {
        this._setOption('connectorColor', value);
    }

    @Input()
    get connectorWidth(): number {
        return this._getOption('connectorWidth');
    }
    set connectorWidth(value: number) {
        this._setOption('connectorWidth', value);
    }

    @Input()
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
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
    get format(): Format | string | undefined {
        return this._getOption('format');
    }
    set format(value: Format | string | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get indent(): number {
        return this._getOption('indent');
    }
    set indent(value: number) {
        this._setOption('indent', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get horizontalAlignment(): HorizontalAlignment | HorizontalEdge {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalAlignment | HorizontalEdge) {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get position(): RelativePosition | Position | LabelPosition | VerticalEdge {
        return this._getOption('position');
    }
    set position(value: RelativePosition | Position | LabelPosition | VerticalEdge) {
        this._setOption('position', value);
    }

    @Input()
    get text(): string | undefined {
        return this._getOption('text');
    }
    set text(value: string | undefined) {
        this._setOption('text', value);
    }

    @Input()
    get verticalAlignment(): VerticalAlignment {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: VerticalAlignment) {
        this._setOption('verticalAlignment', value);
    }

    @Input()
    get alignment(): HorizontalAlignment | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | undefined) {
        this._setOption('alignment', value);
    }

    @Input()
    get customizeHint(): Function {
        return this._getOption('customizeHint');
    }
    set customizeHint(value: Function) {
        this._setOption('customizeHint', value);
    }

    @Input()
    get displayMode(): ChartLabelDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: ChartLabelDisplayMode) {
        this._setOption('displayMode', value);
    }

    @Input()
    get indentFromAxis(): number {
        return this._getOption('indentFromAxis');
    }
    set indentFromAxis(value: number) {
        this._setOption('indentFromAxis', value);
    }

    @Input()
    get overlappingBehavior(): ChartsAxisLabelOverlap | LabelOverlap | TextOverflow {
        return this._getOption('overlappingBehavior');
    }
    set overlappingBehavior(value: ChartsAxisLabelOverlap | LabelOverlap | TextOverflow) {
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
    get template(): any | undefined {
        return this._getOption('template');
    }
    set template(value: any | undefined) {
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
    get wordWrap(): WordWrap {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: WordWrap) {
        this._setOption('wordWrap', value);
    }

    @Input()
    get argumentFormat(): Format | string | undefined {
        return this._getOption('argumentFormat');
    }
    set argumentFormat(value: Format | string | undefined) {
        this._setOption('argumentFormat', value);
    }

    @Input()
    get backgroundColor(): string | undefined {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string | undefined) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number } | { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number } | { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }) {
        this._setOption('border', value);
    }

    @Input()
    get connector(): { color?: string | undefined, visible?: boolean, width?: number } | { color?: string | undefined, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('connector');
    }
    set connector(value: { color?: string | undefined, visible?: boolean, width?: number } | { color?: string | undefined, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('connector', value);
    }

    @Input()
    get displayFormat(): string | undefined {
        return this._getOption('displayFormat');
    }
    set displayFormat(value: string | undefined) {
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

    @Input()
    get hideFirstOrLast(): CircularGaugeLabelOverlap {
        return this._getOption('hideFirstOrLast');
    }
    set hideFirstOrLast(value: CircularGaugeLabelOverlap) {
        this._setOption('hideFirstOrLast', value);
    }

    @Input()
    get indentFromTick(): number {
        return this._getOption('indentFromTick');
    }
    set indentFromTick(value: number) {
        this._setOption('indentFromTick', value);
    }

    @Input()
    get useRangeColors(): boolean {
        return this._getOption('useRangeColors');
    }
    set useRangeColors(value: boolean) {
        this._setOption('useRangeColors', value);
    }

    @Input()
    get location(): LabelLocation {
        return this._getOption('location');
    }
    set location(value: LabelLocation) {
        this._setOption('location', value);
    }

    @Input()
    get showColon(): boolean {
        return this._getOption('showColon');
    }
    set showColon(value: boolean) {
        this._setOption('showColon', value);
    }

    @Input()
    get radialOffset(): number {
        return this._getOption('radialOffset');
    }
    set radialOffset(value: number) {
        this._setOption('radialOffset', value);
    }

    @Input()
    get topIndent(): number {
        return this._getOption('topIndent');
    }
    set topIndent(value: number) {
        this._setOption('topIndent', value);
    }

    @Input()
    get shadow(): { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number } {
        return this._getOption('shadow');
    }
    set shadow(value: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }) {
        this._setOption('shadow', value);
    }

    @Input()
    get useNodeColors(): boolean {
        return this._getOption('useNodeColors');
    }
    set useNodeColors(value: boolean) {
        this._setOption('useNodeColors', value);
    }

    @Input()
    get dataField(): string {
        return this._getOption('dataField');
    }
    set dataField(value: string) {
        this._setOption('dataField', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
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
    DxoLabelComponent
  ],
  exports: [
    DxoLabelComponent
  ],
})
export class DxoLabelModule { }
