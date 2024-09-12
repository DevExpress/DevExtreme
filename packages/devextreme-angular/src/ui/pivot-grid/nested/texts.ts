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
    selector: 'dxo-pivot-grid-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allFields(): string {
        return this._getOption('allFields');
    }
    set allFields(value: string) {
        this._setOption('allFields', value);
    }

    @Input()
    get columnFields(): string {
        return this._getOption('columnFields');
    }
    set columnFields(value: string) {
        this._setOption('columnFields', value);
    }

    @Input()
    get dataFields(): string {
        return this._getOption('dataFields');
    }
    set dataFields(value: string) {
        this._setOption('dataFields', value);
    }

    @Input()
    get filterFields(): string {
        return this._getOption('filterFields');
    }
    set filterFields(value: string) {
        this._setOption('filterFields', value);
    }

    @Input()
    get rowFields(): string {
        return this._getOption('rowFields');
    }
    set rowFields(value: string) {
        this._setOption('rowFields', value);
    }

    @Input()
    get columnFieldArea(): string {
        return this._getOption('columnFieldArea');
    }
    set columnFieldArea(value: string) {
        this._setOption('columnFieldArea', value);
    }

    @Input()
    get dataFieldArea(): string {
        return this._getOption('dataFieldArea');
    }
    set dataFieldArea(value: string) {
        this._setOption('dataFieldArea', value);
    }

    @Input()
    get filterFieldArea(): string {
        return this._getOption('filterFieldArea');
    }
    set filterFieldArea(value: string) {
        this._setOption('filterFieldArea', value);
    }

    @Input()
    get rowFieldArea(): string {
        return this._getOption('rowFieldArea');
    }
    set rowFieldArea(value: string) {
        this._setOption('rowFieldArea', value);
    }

    @Input()
    get cancel(): string {
        return this._getOption('cancel');
    }
    set cancel(value: string) {
        this._setOption('cancel', value);
    }

    @Input()
    get emptyValue(): string {
        return this._getOption('emptyValue');
    }
    set emptyValue(value: string) {
        this._setOption('emptyValue', value);
    }

    @Input()
    get ok(): string {
        return this._getOption('ok');
    }
    set ok(value: string) {
        this._setOption('ok', value);
    }

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
    DxoPivotGridTextsComponent
  ],
  exports: [
    DxoPivotGridTextsComponent
  ],
})
export class DxoPivotGridTextsModule { }
