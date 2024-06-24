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
    selector: 'dxo-notifications',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoNotificationsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get showPanel(): boolean {
        return this._getOption('showPanel');
    }
    set showPanel(value: boolean) {
        this._setOption('showPanel', value);
    }

    @Input()
    get showPopup(): boolean {
        return this._getOption('showPopup');
    }
    set showPopup(value: boolean) {
        this._setOption('showPopup', value);
    }


    protected get _optionPath() {
        return 'notifications';
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
    DxoNotificationsComponent
  ],
  exports: [
    DxoNotificationsComponent
  ],
})
export class DxoNotificationsModule { }
