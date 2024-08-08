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




import { Command, CustomCommand } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiDiagramCommandComponent } from './command-dxi';


@Component({
    selector: 'dxo-diagram-view-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramViewToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get commands(): Array<CustomCommand | Command> {
        return this._getOption('commands');
    }
    set commands(value: Array<CustomCommand | Command>) {
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


    @ContentChildren(forwardRef(() => DxiDiagramCommandComponent))
    get commandsChildren(): QueryList<DxiDiagramCommandComponent> {
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
    DxoDiagramViewToolbarComponent
  ],
  exports: [
    DxoDiagramViewToolbarComponent
  ],
})
export class DxoDiagramViewToolbarModule { }
