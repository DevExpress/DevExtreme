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
    selector: 'dxo-my',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoMyComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get x(): string {
        return this._getOption('x');
    }
    set x(value: string) {
        this._setOption('x', value);
    }

    @Input()
    get y(): string {
        return this._getOption('y');
    }
    set y(value: string) {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'my';
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
    DxoMyComponent
  ],
  exports: [
    DxoMyComponent
  ],
})
export class DxoMyModule { }
