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
    selector: 'dxo-data-grid-export',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridExportComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowExportSelectedData(): boolean {
        return this._getOption('allowExportSelectedData');
    }
    set allowExportSelectedData(value: boolean) {
        this._setOption('allowExportSelectedData', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get formats(): Array<"pdf" | "xlsx" | string> {
        return this._getOption('formats');
    }
    set formats(value: Array<"pdf" | "xlsx" | string>) {
        this._setOption('formats', value);
    }

    @Input()
    get texts(): Record<string, any> {
        return this._getOption('texts');
    }
    set texts(value: Record<string, any>) {
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
    DxoDataGridExportComponent
  ],
  exports: [
    DxoDataGridExportComponent
  ],
})
export class DxoDataGridExportModule { }
