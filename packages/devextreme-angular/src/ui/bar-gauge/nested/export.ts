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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-bar-gauge-export',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBarGaugeExportComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get fileName(): string {
        return this._getOption('fileName');
    }
    set fileName(value: string) {
        this._setOption('fileName', value);
    }

    @Input()
    get formats(): Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG"> {
        return this._getOption('formats');
    }
    set formats(value: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">) {
        this._setOption('formats', value);
    }

    @Input()
    get margin(): number {
        return this._getOption('margin');
    }
    set margin(value: number) {
        this._setOption('margin', value);
    }

    @Input()
    get printingEnabled(): boolean {
        return this._getOption('printingEnabled');
    }
    set printingEnabled(value: boolean) {
        this._setOption('printingEnabled', value);
    }

    @Input()
    get svgToCanvas(): ((svg: any, canvas: any) => any) {
        return this._getOption('svgToCanvas');
    }
    set svgToCanvas(value: ((svg: any, canvas: any) => any)) {
        this._setOption('svgToCanvas', value);
    }


    protected get _optionPath() {
        return 'export';
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
    DxoBarGaugeExportComponent
  ],
  exports: [
    DxoBarGaugeExportComponent
  ],
})
export class DxoBarGaugeExportModule { }
