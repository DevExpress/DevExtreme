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
    selector: 'dxo-tree-list-tree-list-selection',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListTreeListSelectionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowSelectAll(): boolean {
        return this._getOption('allowSelectAll');
    }
    set allowSelectAll(value: boolean) {
        this._setOption('allowSelectAll', value);
    }

    @Input()
    get mode(): "single" | "multiple" | "none" {
        return this._getOption('mode');
    }
    set mode(value: "single" | "multiple" | "none") {
        this._setOption('mode', value);
    }

    @Input()
    get recursive(): boolean {
        return this._getOption('recursive');
    }
    set recursive(value: boolean) {
        this._setOption('recursive', value);
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
    DxoTreeListTreeListSelectionComponent
  ],
  exports: [
    DxoTreeListTreeListSelectionComponent
  ],
})
export class DxoTreeListTreeListSelectionModule { }
