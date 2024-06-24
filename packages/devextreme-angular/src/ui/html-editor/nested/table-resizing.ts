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
    selector: 'dxo-table-resizing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTableResizingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get minColumnWidth(): number {
        return this._getOption('minColumnWidth');
    }
    set minColumnWidth(value: number) {
        this._setOption('minColumnWidth', value);
    }

    @Input()
    get minRowHeight(): number {
        return this._getOption('minRowHeight');
    }
    set minRowHeight(value: number) {
        this._setOption('minRowHeight', value);
    }


    protected get _optionPath() {
        return 'tableResizing';
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
    DxoTableResizingComponent
  ],
  exports: [
    DxoTableResizingComponent
  ],
})
export class DxoTableResizingModule { }
