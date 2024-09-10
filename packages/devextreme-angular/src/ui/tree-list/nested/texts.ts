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
    selector: 'dxo-tree-list-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListTextsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get addRowToNode(): string {
        return this._getOption('addRowToNode');
    }
    set addRowToNode(value: string) {
        this._setOption('addRowToNode', value);
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
    DxoTreeListTextsComponent
  ],
  exports: [
    DxoTreeListTextsComponent
  ],
})
export class DxoTreeListTextsModule { }
