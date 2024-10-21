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
    selector: 'dxo-context-menu-show-submenu-mode',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoContextMenuShowSubmenuModeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get delay(): number | Record<string, any> {
        return this._getOption('delay');
    }
    set delay(value: number | Record<string, any>) {
        this._setOption('delay', value);
    }

    @Input()
    get name(): "onClick" | "onHover" {
        return this._getOption('name');
    }
    set name(value: "onClick" | "onHover") {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'showSubmenuMode';
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
    DxoContextMenuShowSubmenuModeComponent
  ],
  exports: [
    DxoContextMenuShowSubmenuModeComponent
  ],
})
export class DxoContextMenuShowSubmenuModeModule { }
