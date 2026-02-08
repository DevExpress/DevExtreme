/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';




import { Command, CustomCommand } from 'devextreme/ui/diagram';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_tabs } from 'devextreme-angular/core/tokens';
import {
    PROPERTY_TOKEN_commands,
    PROPERTY_TOKEN_groups,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-diagram-tab',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_tabs,
           useExisting: DxiDiagramTabComponent,
        }
    ]
})
export class DxiDiagramTabComponent extends CollectionNestedOption {
    @ContentChildren(PROPERTY_TOKEN_commands)
    set _commandsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('commands', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_groups)
    set _groupsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('groups', value);
    }
    
    @Input()
    get commands(): Array<Command | CustomCommand> {
        return this._getOption('commands');
    }
    set commands(value: Array<Command | CustomCommand>) {
        this._setOption('commands', value);
    }

    @Input()
    get groups(): { commands?: Array<Command | CustomCommand>, title?: string }[] {
        return this._getOption('groups');
    }
    set groups(value: { commands?: Array<Command | CustomCommand>, title?: string }[]) {
        this._setOption('groups', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }


    protected get _optionPath() {
        return 'tabs';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiDiagramTabComponent
  ],
  exports: [
    DxiDiagramTabComponent
  ],
})
export class DxiDiagramTabModule { }
