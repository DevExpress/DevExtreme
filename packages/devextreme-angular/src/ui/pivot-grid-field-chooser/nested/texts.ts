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
    selector: 'dxo-pivot-grid-field-chooser-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridFieldChooserTextsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    DxoPivotGridFieldChooserTextsComponent
  ],
  exports: [
    DxoPivotGridFieldChooserTextsComponent
  ],
})
export class DxoPivotGridFieldChooserTextsModule { }
