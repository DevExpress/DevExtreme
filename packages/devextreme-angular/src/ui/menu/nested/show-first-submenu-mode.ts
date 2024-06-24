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




import { SubmenuShowMode } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-show-first-submenu-mode',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoShowFirstSubmenuModeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get delay(): number | { hide?: number, show?: number } {
        return this._getOption('delay');
    }
    set delay(value: number | { hide?: number, show?: number }) {
        this._setOption('delay', value);
    }

    @Input()
    get name(): SubmenuShowMode {
        return this._getOption('name');
    }
    set name(value: SubmenuShowMode) {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'showFirstSubmenuMode';
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
    DxoShowFirstSubmenuModeComponent
  ],
  exports: [
    DxoShowFirstSubmenuModeComponent
  ],
})
export class DxoShowFirstSubmenuModeModule { }
