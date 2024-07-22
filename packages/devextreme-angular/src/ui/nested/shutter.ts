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
    selector: 'dxo-shutter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoShutterComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string | undefined {
        return this._getOption('color');
    }
    set color(value: string | undefined) {
        this._setOption('color', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }


    protected get _optionPath() {
        return 'shutter';
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
    DxoShutterComponent
  ],
  exports: [
    DxoShutterComponent
  ],
})
export class DxoShutterModule { }
