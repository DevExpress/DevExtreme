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
    QueryList,
} from '@angular/core';




import { Command, CustomCommand } from 'devextreme/ui/diagram';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


import {
    PROPERTY_TOKEN_commands,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-diagram-main-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
})
export class DxoDiagramMainToolbarComponent extends NestedOption implements OnDestroy, OnInit {

    @ContentChildren(PROPERTY_TOKEN_commands)
    set _commandsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('commands', value);
    }
    
    @Input()
    get commands(): Array<Command | CustomCommand> {
        return this._getOption('commands');
    }
    set commands(value: Array<Command | CustomCommand>) {
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
        return 'mainToolbar';
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
    DxoDiagramMainToolbarComponent
  ],
  exports: [
    DxoDiagramMainToolbarComponent
  ],
})
export class DxoDiagramMainToolbarModule { }
