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
    selector: 'dxo-pivot-grid-field-panel-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridFieldPanelTextsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    DxoPivotGridFieldPanelTextsComponent
  ],
  exports: [
    DxoPivotGridFieldPanelTextsComponent
  ],
})
export class DxoPivotGridFieldPanelTextsModule { }
