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
    selector: 'dxo-tooltip-map',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTooltipMapComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get isShown(): boolean {
        return this._getOption('isShown');
    }
    set isShown(value: boolean) {
        this._setOption('isShown', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }


    protected get _optionPath() {
        return 'tooltip';
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
    DxoTooltipMapComponent
  ],
  exports: [
    DxoTooltipMapComponent
  ],
})
export class DxoTooltipMapModule { }
