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




import { Orientation } from 'devextreme/common';
import { DiagramDataLayoutType } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-auto-layout',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoAutoLayoutComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get orientation(): Orientation {
        return this._getOption('orientation');
    }
    set orientation(value: Orientation) {
        this._setOption('orientation', value);
    }

    @Input()
    get type(): DiagramDataLayoutType {
        return this._getOption('type');
    }
    set type(value: DiagramDataLayoutType) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'autoLayout';
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
    DxoAutoLayoutComponent
  ],
  exports: [
    DxoAutoLayoutComponent
  ],
})
export class DxoAutoLayoutModule { }
