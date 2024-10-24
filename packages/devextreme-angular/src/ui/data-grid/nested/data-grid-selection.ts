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
    selector: 'dxo-data-grid-data-grid-selection',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridDataGridSelectionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowSelectAll(): boolean {
        return this._getOption('allowSelectAll');
    }
    set allowSelectAll(value: boolean) {
        this._setOption('allowSelectAll', value);
    }

    @Input()
    get deferred(): boolean {
        return this._getOption('deferred');
    }
    set deferred(value: boolean) {
        this._setOption('deferred', value);
    }

    @Input()
    get mode(): "single" | "multiple" | "none" {
        return this._getOption('mode');
    }
    set mode(value: "single" | "multiple" | "none") {
        this._setOption('mode', value);
    }

    @Input()
    get selectAllMode(): "allPages" | "page" {
        return this._getOption('selectAllMode');
    }
    set selectAllMode(value: "allPages" | "page") {
        this._setOption('selectAllMode', value);
    }

    @Input()
    get sensitivity(): "base" | "accent" | "case" | "variant" {
        return this._getOption('sensitivity');
    }
    set sensitivity(value: "base" | "accent" | "case" | "variant") {
        this._setOption('sensitivity', value);
    }

    @Input()
    get showCheckBoxesMode(): "always" | "none" | "onClick" | "onLongTap" {
        return this._getOption('showCheckBoxesMode');
    }
    set showCheckBoxesMode(value: "always" | "none" | "onClick" | "onLongTap") {
        this._setOption('showCheckBoxesMode', value);
    }


    protected get _optionPath() {
        return 'selection';
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
    DxoDataGridDataGridSelectionComponent
  ],
  exports: [
    DxoDataGridDataGridSelectionComponent
  ],
})
export class DxoDataGridDataGridSelectionModule { }
