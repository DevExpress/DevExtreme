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
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-source',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoSourceComponent) => ({
                propertyName: 'source',
                className: 'DxoSourceComponent',
                component
            }),
            deps: [DxoSourceComponent],
         }
         ]
})
export class DxoSourceComponent extends NestedOption implements OnDestroy, OnInit {
    @Input()
    get grouping(): string {
        return this._getOption('grouping');
    }
    set grouping(value: string) {
        this._setOption('grouping', value);
    }

    @Input()
    get layer(): string {
        return this._getOption('layer');
    }
    set layer(value: string) {
        this._setOption('layer', value);
    }


    protected get _optionPath() {
        return 'source';
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
    DxoSourceComponent
  ],
  exports: [
    DxoSourceComponent
  ],
})
export class DxoSourceModule { }
