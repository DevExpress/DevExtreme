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
    QueryList
} from '@angular/core';




import type { DataChange } from 'devextreme/common/grids';
import type { dxFormOptions } from 'devextreme/ui/form';
import type { EditingTexts } from 'devextreme/ui/card_view';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_changes,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-card-view-editing',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewEditingComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_changes)
    set _changesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('changes', value);
    }
    
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
    get form(): dxFormOptions {
        return this._getOption('form');
    }
    set form(value: dxFormOptions) {
        this._setOption('form', value);
    }

    @Input()
    get popup(): Record<string, any> {
        return this._getOption('popup');
    }
    set popup(value: Record<string, any>) {
        this._setOption('popup', value);
    }

    @Input()
    get texts(): EditingTexts {
        return this._getOption('texts');
    }
    set texts(value: EditingTexts) {
        this._setOption('texts', value);
    }


    protected get _optionPath() {
        return 'editing';
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
