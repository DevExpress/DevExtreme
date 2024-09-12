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
    selector: 'dxo-context-menu-delay',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoContextMenuDelayComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get hide(): number {
        return this._getOption('hide');
    }
    set hide(value: number) {
        this._setOption('hide', value);
    }

    @Input()
    get show(): number {
        return this._getOption('show');
    }
    set show(value: number) {
        this._setOption('show', value);
    }


    protected get _optionPath() {
        return 'delay';
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
    DxoContextMenuDelayComponent
  ],
  exports: [
    DxoContextMenuDelayComponent
  ],
})
export class DxoContextMenuDelayModule { }
