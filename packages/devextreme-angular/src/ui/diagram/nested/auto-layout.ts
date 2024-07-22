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
import { DataLayoutType } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-auto-layout-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoAutoLayoutDiagramComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get orientation(): Orientation {
        return this._getOption('orientation');
    }
    set orientation(value: Orientation) {
        this._setOption('orientation', value);
    }

    @Input()
    get type(): DataLayoutType {
        return this._getOption('type');
    }
    set type(value: DataLayoutType) {
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
    DxoAutoLayoutDiagramComponent
  ],
  exports: [
    DxoAutoLayoutDiagramComponent
  ],
})
export class DxoAutoLayoutDiagramModule { }
