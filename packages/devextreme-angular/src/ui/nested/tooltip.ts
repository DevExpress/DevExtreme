/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { TooltipShowMode, VerticalEdge } from 'devextreme/common';
import { DashStyle, Font } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';
import { UserDefinedElement } from 'devextreme/core/element';
import { ChartTooltipLocation } from 'devextreme/viz/chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tooltip',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTooltipComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get arrowLength(): number {
        return this._getOption('arrowLength');
    }
    set arrowLength(value: number) {
        this._setOption('arrowLength', value);
    }

    @Input()
    get border(): { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }) {
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
    get container(): UserDefinedElement | string | undefined {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string | undefined) {
        this._setOption('container', value);
    }

    @Input()
    get contentTemplate(): any | undefined {
        return this._getOption('contentTemplate');
    }
    set contentTemplate(value: any | undefined) {
        this._setOption('contentTemplate', value);
    }

    @Input()
    get cornerRadius(): number {
        return this._getOption('cornerRadius');
    }
    set cornerRadius(value: number) {
        this._setOption('cornerRadius', value);
    }

    @Input()
    get customizeTooltip(): Function | undefined {
        return this._getOption('customizeTooltip');
    }
    set customizeTooltip(value: Function | undefined) {
        this._setOption('customizeTooltip', value);
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
    get format(): Format | string | undefined {
        return this._getOption('format');
    }
    set format(value: Format | string | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get interactive(): boolean {
        return this._getOption('interactive');
    }
    set interactive(value: boolean) {
        this._setOption('interactive', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
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
    get shadow(): { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number } {
        return this._getOption('shadow');
    }
    set shadow(value: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }) {
        this._setOption('shadow', value);
    }

    @Input()
    get zIndex(): number | undefined {
        return this._getOption('zIndex');
    }
    set zIndex(value: number | undefined) {
        this._setOption('zIndex', value);
    }

    @Input()
    get argumentFormat(): Format | string | undefined {
        return this._getOption('argumentFormat');
    }
    set argumentFormat(value: Format | string | undefined) {
        this._setOption('argumentFormat', value);
    }

    @Input()
    get location(): ChartTooltipLocation {
        return this._getOption('location');
    }
    set location(value: ChartTooltipLocation) {
        this._setOption('location', value);
    }

    @Input()
    get shared(): boolean {
        return this._getOption('shared');
    }
    set shared(value: boolean) {
        this._setOption('shared', value);
    }

    @Input()
    get isShown(): boolean {
        return this._getOption('isShown');
    }
    set isShown(value: boolean) {
        this._setOption('isShown', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get position(): VerticalEdge {
        return this._getOption('position');
    }
    set position(value: VerticalEdge) {
        this._setOption('position', value);
    }

    @Input()
    get showMode(): TooltipShowMode {
        return this._getOption('showMode');
    }
    set showMode(value: TooltipShowMode) {
        this._setOption('showMode', value);
    }

    @Input()
    get customizeLinkTooltip(): Function | undefined {
        return this._getOption('customizeLinkTooltip');
    }
    set customizeLinkTooltip(value: Function | undefined) {
        this._setOption('customizeLinkTooltip', value);
    }

    @Input()
    get customizeNodeTooltip(): Function | undefined {
        return this._getOption('customizeNodeTooltip');
    }
    set customizeNodeTooltip(value: Function | undefined) {
        this._setOption('customizeNodeTooltip', value);
    }

    @Input()
    get linkTooltipTemplate(): any | undefined {
        return this._getOption('linkTooltipTemplate');
    }
    set linkTooltipTemplate(value: any | undefined) {
        this._setOption('linkTooltipTemplate', value);
    }

    @Input()
    get nodeTooltipTemplate(): any | undefined {
        return this._getOption('nodeTooltipTemplate');
    }
    set nodeTooltipTemplate(value: any | undefined) {
        this._setOption('nodeTooltipTemplate', value);
    }


    protected get _optionPath() {
        return 'tooltip';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
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
    DxoTooltipComponent
  ],
  exports: [
    DxoTooltipComponent
  ],
})
export class DxoTooltipModule { }
