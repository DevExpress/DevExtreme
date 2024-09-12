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




import { FieldChooserLayout } from 'devextreme/common';
import { ApplyChangesMode } from 'devextreme/common/grids';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-pivot-grid-field-chooser',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridFieldChooserComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    @Input()
    get applyChangesMode(): ApplyChangesMode {
        return this._getOption('applyChangesMode');
    }
    set applyChangesMode(value: ApplyChangesMode) {
        this._setOption('applyChangesMode', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    @Input()
    get layout(): FieldChooserLayout {
        return this._getOption('layout');
    }
    set layout(value: FieldChooserLayout) {
        this._setOption('layout', value);
    }

    @Input()
    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }

    @Input()
    get texts(): { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string } {
        return this._getOption('texts');
    }
    set texts(value: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'fieldChooser';
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
    DxoPivotGridFieldChooserComponent
  ],
  exports: [
    DxoPivotGridFieldChooserComponent
  ],
})
export class DxoPivotGridFieldChooserModule { }
