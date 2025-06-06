/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList,
    AfterContentInit
} from '@angular/core';




import { Command, CustomCommand } from 'devextreme/ui/diagram';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiDiagramCommandComponent } from './command-dxi';
import { DxiDiagramGroupComponent } from './group-dxi';
import { DxiDiagramTabGroupComponent } from './tab-group-dxi';


@Component({
    selector: 'dxi-diagram-tab',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxiDiagramTabComponent extends CollectionNestedOption implements AfterContentInit  {
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


    @ContentChildren(forwardRef(() => DxiDiagramGroupComponent)) groupsChildren!: QueryList<DxiDiagramGroupComponent>
    
    @ContentChildren(forwardRef(() => DxiDiagramTabGroupComponent)) tabGroupsChildren!: QueryList<DxiDiagramTabGroupComponent>
    
    setGroups() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.groupsChildren.toArray(),
            ...this.tabGroupsChildren.toArray(),
        ]);
        this.setChildren('groups', q);
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



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

    ngAfterContentInit() {
        this.setGroups();
        
        this.groupsChildren.changes.subscribe(() => { this.setGroups() });
        this.tabGroupsChildren.changes.subscribe(() => { this.setGroups() });
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
