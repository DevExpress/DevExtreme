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




import { DashStyle, Font } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-sankey-tooltip',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSankeyTooltipComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
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
    get customizeLinkTooltip(): ((info: { source: string, target: string, weight: number }) => Record<string, any>) | undefined {
        return this._getOption('customizeLinkTooltip');
    }
    set customizeLinkTooltip(value: ((info: { source: string, target: string, weight: number }) => Record<string, any>) | undefined) {
        this._setOption('customizeLinkTooltip', value);
    }

    @Input()
    get customizeNodeTooltip(): ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>) | undefined {
        return this._getOption('customizeNodeTooltip');
    }
    set customizeNodeTooltip(value: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>) | undefined) {
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
    get format(): Format | undefined {
        return this._getOption('format');
    }
    set format(value: Format | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get linkTooltipTemplate(): any {
        return this._getOption('linkTooltipTemplate');
    }
    set linkTooltipTemplate(value: any) {
        this._setOption('linkTooltipTemplate', value);
    }

    @Input()
    get nodeTooltipTemplate(): any {
        return this._getOption('nodeTooltipTemplate');
    }
    set nodeTooltipTemplate(value: any) {
        this._setOption('nodeTooltipTemplate', value);
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
    DxoSankeyTooltipComponent
  ],
  exports: [
    DxoSankeyTooltipComponent
  ],
})
export class DxoSankeyTooltipModule { }
