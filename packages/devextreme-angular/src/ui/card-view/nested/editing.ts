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




import { DataChange } from 'devextreme/common/grids';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiCardViewChangeComponent } from './change-dxi';


@Component({
    selector: 'dxo-card-view-editing',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewEditingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowAdding(): boolean {
        return this._getOption('allowAdding');
    }
    set allowAdding(value: boolean) {
        this._setOption('allowAdding', value);
    }

    @Input()
    get allowDeleting(): boolean {
        return this._getOption('allowDeleting');
    }
    set allowDeleting(value: boolean) {
        this._setOption('allowDeleting', value);
    }

    @Input()
    get allowUpdating(): boolean {
        return this._getOption('allowUpdating');
    }
    set allowUpdating(value: boolean) {
        this._setOption('allowUpdating', value);
    }

    @Input()
    get changes(): Array<DataChange> {
        return this._getOption('changes');
    }
    set changes(value: Array<DataChange>) {
        this._setOption('changes', value);
    }

    @Input()
    get confirmDelete(): boolean {
        return this._getOption('confirmDelete');
    }
    set confirmDelete(value: boolean) {
        this._setOption('confirmDelete', value);
    }

    @Input()
    get editCardKey(): any {
        return this._getOption('editCardKey');
    }
    set editCardKey(value: any) {
        this._setOption('editCardKey', value);
    }

    @Input()
    get form(): Record<string, any> {
        return this._getOption('form');
    }
    set form(value: Record<string, any>) {
        this._setOption('form', value);
    }

    @Input()
    get popup(): Record<string, any> {
        return this._getOption('popup');
    }
    set popup(value: Record<string, any>) {
        this._setOption('popup', value);
    }


    protected get _optionPath() {
        return 'editing';
    }


    @ContentChildren(forwardRef(() => DxiCardViewChangeComponent))
    get changesChildren(): QueryList<DxiCardViewChangeComponent> {
        return this._getOption('changes');
    }
    set changesChildren(value) {
        this.setChildren('changes', value);
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
    DxoCardViewEditingComponent
  ],
  exports: [
    DxoCardViewEditingComponent
  ],
})
export class DxoCardViewEditingModule { }
