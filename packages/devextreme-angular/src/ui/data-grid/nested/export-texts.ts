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
    selector: 'dxo-data-grid-export-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridExportTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get exportAll(): string {
        return this._getOption('exportAll');
    }
    set exportAll(value: string) {
        this._setOption('exportAll', value);
    }

    @Input()
    get exportSelectedRows(): string {
        return this._getOption('exportSelectedRows');
    }
    set exportSelectedRows(value: string) {
        this._setOption('exportSelectedRows', value);
    }

    @Input()
    get exportTo(): string {
        return this._getOption('exportTo');
    }
    set exportTo(value: string) {
        this._setOption('exportTo', value);
    }


    protected get _optionPath() {
        return 'texts';
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
    DxoDataGridExportTextsComponent
  ],
  exports: [
    DxoDataGridExportTextsComponent
  ],
})
export class DxoDataGridExportTextsModule { }
