/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import DevExpress from 'devextreme/bundles/dx.all';
import { Command } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiCommandComponent } from './command-dxi';


@Component({
    selector: 'dxo-view-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoViewToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get commands(): Array<Command | DevExpress.ui.dxDiagram.CustomCommand> {
        return this._getOption('commands');
    }
    set commands(value: Array<Command | DevExpress.ui.dxDiagram.CustomCommand>) {
        this._setOption('commands', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'viewToolbar';
    }


    @ContentChildren(forwardRef(() => DxiCommandComponent))
    get commandsChildren(): QueryList<DxiCommandComponent> {
        return this._getOption('commands');
    }
    set commandsChildren(value) {
        this.setChildren('commands', value);
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
    DxoViewToolbarComponent
  ],
  exports: [
    DxoViewToolbarComponent
  ],
})
export class DxoViewToolbarModule { }
