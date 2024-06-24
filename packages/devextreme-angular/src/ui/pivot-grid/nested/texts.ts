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
    selector: 'dxo-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get collapseAll(): string {
        return this._getOption('collapseAll');
    }
    set collapseAll(value: string) {
        this._setOption('collapseAll', value);
    }

    @Input()
    get dataNotAvailable(): string {
        return this._getOption('dataNotAvailable');
    }
    set dataNotAvailable(value: string) {
        this._setOption('dataNotAvailable', value);
    }

    @Input()
    get expandAll(): string {
        return this._getOption('expandAll');
    }
    set expandAll(value: string) {
        this._setOption('expandAll', value);
    }

    @Input()
    get exportToExcel(): string {
        return this._getOption('exportToExcel');
    }
    set exportToExcel(value: string) {
        this._setOption('exportToExcel', value);
    }

    @Input()
    get grandTotal(): string {
        return this._getOption('grandTotal');
    }
    set grandTotal(value: string) {
        this._setOption('grandTotal', value);
    }

    @Input()
    get noData(): string {
        return this._getOption('noData');
    }
    set noData(value: string) {
        this._setOption('noData', value);
    }

    @Input()
    get removeAllSorting(): string {
        return this._getOption('removeAllSorting');
    }
    set removeAllSorting(value: string) {
        this._setOption('removeAllSorting', value);
    }

    @Input()
    get showFieldChooser(): string {
        return this._getOption('showFieldChooser');
    }
    set showFieldChooser(value: string) {
        this._setOption('showFieldChooser', value);
    }

    @Input()
    get sortColumnBySummary(): string {
        return this._getOption('sortColumnBySummary');
    }
    set sortColumnBySummary(value: string) {
        this._setOption('sortColumnBySummary', value);
    }

    @Input()
    get sortRowBySummary(): string {
        return this._getOption('sortRowBySummary');
    }
    set sortRowBySummary(value: string) {
        this._setOption('sortRowBySummary', value);
    }

    @Input()
    get total(): string {
        return this._getOption('total');
    }
    set total(value: string) {
        this._setOption('total', value);
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
    DxoTextsComponent
  ],
  exports: [
    DxoTextsComponent
  ],
})
export class DxoTextsModule { }
