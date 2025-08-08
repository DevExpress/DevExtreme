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




import { HorizontalAlignment, VerticalAlignment } from 'devextreme/common';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-color-box-at',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoColorBoxAtComponent) => ({
                propertyName: 'at',
                className: 'DxoColorBoxAtComponent',
                component
            }),
            deps: [DxoColorBoxAtComponent],
         }
         ]
})
export class DxoColorBoxAtComponent extends NestedOption implements OnDestroy, OnInit {
    @Input()
    get x(): HorizontalAlignment {
        return this._getOption('x');
    }
    set x(value: HorizontalAlignment) {
        this._setOption('x', value);
    }

    @Input()
    get y(): VerticalAlignment {
        return this._getOption('y');
    }
    set y(value: VerticalAlignment) {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'at';
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
  imports: [
    DxoColorBoxAtComponent
  ],
  exports: [
    DxoColorBoxAtComponent
  ],
})
export class DxoColorBoxAtModule { }
