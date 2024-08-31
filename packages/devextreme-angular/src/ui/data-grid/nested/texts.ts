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
    selector: 'dxo-data-grid-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fix(): string {
        return this._getOption('fix');
    }
    set fix(value: string) {
        this._setOption('fix', value);
    }

    @Input()
    get leftPosition(): string {
        return this._getOption('leftPosition');
    }
    set leftPosition(value: string) {
        this._setOption('leftPosition', value);
    }

    @Input()
    get rightPosition(): string {
        return this._getOption('rightPosition');
    }
    set rightPosition(value: string) {
        this._setOption('rightPosition', value);
    }

    @Input()
    get unfix(): string {
        return this._getOption('unfix');
    }
    set unfix(value: string) {
        this._setOption('unfix', value);
    }

    @Input()
    get addRow(): string {
        return this._getOption('addRow');
    }
    set addRow(value: string) {
        this._setOption('addRow', value);
    }

    @Input()
    get cancelAllChanges(): string {
        return this._getOption('cancelAllChanges');
    }
    set cancelAllChanges(value: string) {
        this._setOption('cancelAllChanges', value);
    }

    @Input()
    get cancelRowChanges(): string {
        return this._getOption('cancelRowChanges');
    }
    set cancelRowChanges(value: string) {
        this._setOption('cancelRowChanges', value);
    }

    @Input()
    get confirmDeleteMessage(): string {
        return this._getOption('confirmDeleteMessage');
    }
    set confirmDeleteMessage(value: string) {
        this._setOption('confirmDeleteMessage', value);
    }

    @Input()
    get confirmDeleteTitle(): string {
        return this._getOption('confirmDeleteTitle');
    }
    set confirmDeleteTitle(value: string) {
        this._setOption('confirmDeleteTitle', value);
    }

    @Input()
    get deleteRow(): string {
        return this._getOption('deleteRow');
    }
    set deleteRow(value: string) {
        this._setOption('deleteRow', value);
    }

    @Input()
    get editRow(): string {
        return this._getOption('editRow');
    }
    set editRow(value: string) {
        this._setOption('editRow', value);
    }

    @Input()
    get saveAllChanges(): string {
        return this._getOption('saveAllChanges');
    }
    set saveAllChanges(value: string) {
        this._setOption('saveAllChanges', value);
    }

    @Input()
    get saveRowChanges(): string {
        return this._getOption('saveRowChanges');
    }
    set saveRowChanges(value: string) {
        this._setOption('saveRowChanges', value);
    }

    @Input()
    get undeleteRow(): string {
        return this._getOption('undeleteRow');
    }
    set undeleteRow(value: string) {
        this._setOption('undeleteRow', value);
    }

    @Input()
    get validationCancelChanges(): string {
        return this._getOption('validationCancelChanges');
    }
    set validationCancelChanges(value: string) {
        this._setOption('validationCancelChanges', value);
    }

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

    @Input()
    get clearFilter(): string {
        return this._getOption('clearFilter');
    }
    set clearFilter(value: string) {
        this._setOption('clearFilter', value);
    }

    @Input()
    get createFilter(): string {
        return this._getOption('createFilter');
    }
    set createFilter(value: string) {
        this._setOption('createFilter', value);
    }

    @Input()
    get filterEnabledHint(): string {
        return this._getOption('filterEnabledHint');
    }
    set filterEnabledHint(value: string) {
        this._setOption('filterEnabledHint', value);
    }

    @Input()
    get groupByThisColumn(): string {
        return this._getOption('groupByThisColumn');
    }
    set groupByThisColumn(value: string) {
        this._setOption('groupByThisColumn', value);
    }

    @Input()
    get groupContinuedMessage(): string {
        return this._getOption('groupContinuedMessage');
    }
    set groupContinuedMessage(value: string) {
        this._setOption('groupContinuedMessage', value);
    }

    @Input()
    get groupContinuesMessage(): string {
        return this._getOption('groupContinuesMessage');
    }
    set groupContinuesMessage(value: string) {
        this._setOption('groupContinuesMessage', value);
    }

    @Input()
    get ungroup(): string {
        return this._getOption('ungroup');
    }
    set ungroup(value: string) {
        this._setOption('ungroup', value);
    }

    @Input()
    get ungroupAll(): string {
        return this._getOption('ungroupAll');
    }
    set ungroupAll(value: string) {
        this._setOption('ungroupAll', value);
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
    get avg(): string {
        return this._getOption('avg');
    }
    set avg(value: string) {
        this._setOption('avg', value);
    }

    @Input()
    get avgOtherColumn(): string {
        return this._getOption('avgOtherColumn');
    }
    set avgOtherColumn(value: string) {
        this._setOption('avgOtherColumn', value);
    }

    @Input()
    get count(): string {
        return this._getOption('count');
    }
    set count(value: string) {
        this._setOption('count', value);
    }

    @Input()
    get max(): string {
        return this._getOption('max');
    }
    set max(value: string) {
        this._setOption('max', value);
    }

    @Input()
    get maxOtherColumn(): string {
        return this._getOption('maxOtherColumn');
    }
    set maxOtherColumn(value: string) {
        this._setOption('maxOtherColumn', value);
    }

    @Input()
    get min(): string {
        return this._getOption('min');
    }
    set min(value: string) {
        this._setOption('min', value);
    }

    @Input()
    get minOtherColumn(): string {
        return this._getOption('minOtherColumn');
    }
    set minOtherColumn(value: string) {
        this._setOption('minOtherColumn', value);
    }

    @Input()
    get sum(): string {
        return this._getOption('sum');
    }
    set sum(value: string) {
        this._setOption('sum', value);
    }

    @Input()
    get sumOtherColumn(): string {
        return this._getOption('sumOtherColumn');
    }
    set sumOtherColumn(value: string) {
        this._setOption('sumOtherColumn', value);
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
    DxoDataGridTextsComponent
  ],
  exports: [
    DxoDataGridTextsComponent
  ],
})
export class DxoDataGridTextsModule { }
