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
    selector: 'dxo-export',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoExportComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get formats(): Array<string> {
        return this._getOption('formats');
    }
    set formats(value: Array<string>) {
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
    get svgToCanvas(): Function | undefined {
        return this._getOption('svgToCanvas');
    }
    set svgToCanvas(value: Function | undefined) {
        this._setOption('svgToCanvas', value);
    }

    @Input()
    get allowExportSelectedData(): boolean {
        return this._getOption('allowExportSelectedData');
    }
    set allowExportSelectedData(value: boolean) {
        this._setOption('allowExportSelectedData', value);
    }

    @Input()
    get texts(): { exportAll?: string, exportSelectedRows?: string, exportTo?: string } {
        return this._getOption('texts');
    }
    set texts(value: { exportAll?: string, exportSelectedRows?: string, exportTo?: string }) {
        this._setOption('texts', value);
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
    DxoExportComponent
  ],
  exports: [
    DxoExportComponent
  ],
})
export class DxoExportModule { }
