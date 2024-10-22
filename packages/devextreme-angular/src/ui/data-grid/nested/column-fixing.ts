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
    selector: 'dxo-data-grid-column-fixing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridColumnFixingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get icons(): Record<string, any> | { fix: string, leftPosition: string, rightPosition: string, stickyPosition: string, unfix: string } {
        return this._getOption('icons');
    }
    set icons(value: Record<string, any> | { fix: string, leftPosition: string, rightPosition: string, stickyPosition: string, unfix: string }) {
        this._setOption('icons', value);
    }

    @Input()
    get texts(): Record<string, any> | { fix: string, leftPosition: string, rightPosition: string, stickyPosition: string, unfix: string } {
        return this._getOption('texts');
    }
    set texts(value: Record<string, any> | { fix: string, leftPosition: string, rightPosition: string, stickyPosition: string, unfix: string }) {
        this._setOption('texts', value);
    }


    protected get _optionPath() {
        return 'columnFixing';
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
    DxoDataGridColumnFixingComponent
  ],
  exports: [
    DxoDataGridColumnFixingComponent
  ],
})
export class DxoDataGridColumnFixingModule { }
