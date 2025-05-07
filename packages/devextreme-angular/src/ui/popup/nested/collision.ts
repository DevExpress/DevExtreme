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




import { CollisionResolution } from 'devextreme/common/core/animation';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-popup-collision',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPopupCollisionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get x(): CollisionResolution {
        return this._getOption('x');
    }
    set x(value: CollisionResolution) {
        this._setOption('x', value);
    }

    @Input()
    get y(): CollisionResolution {
        return this._getOption('y');
    }
    set y(value: CollisionResolution) {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'collision';
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
    DxoPopupCollisionComponent
  ],
  exports: [
    DxoPopupCollisionComponent
  ],
})
export class DxoPopupCollisionModule { }
