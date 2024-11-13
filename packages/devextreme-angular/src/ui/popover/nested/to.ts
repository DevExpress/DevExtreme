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




import { PositionConfig } from 'devextreme/common/core/animation';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-popover-to',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPopoverToComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get left(): number {
        return this._getOption('left');
    }
    set left(value: number) {
        this._setOption('left', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get position(): PositionConfig {
        return this._getOption('position');
    }
    set position(value: PositionConfig) {
        this._setOption('position', value);
    }

    @Input()
    get scale(): number {
        return this._getOption('scale');
    }
    set scale(value: number) {
        this._setOption('scale', value);
    }

    @Input()
    get top(): number {
        return this._getOption('top');
    }
    set top(value: number) {
        this._setOption('top', value);
    }


    protected get _optionPath() {
        return 'to';
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
    DxoPopoverToComponent
  ],
  exports: [
    DxoPopoverToComponent
  ],
})
export class DxoPopoverToModule { }
