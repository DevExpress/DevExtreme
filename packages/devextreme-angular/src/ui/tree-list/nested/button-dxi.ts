/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { TreeListPredefinedColumnButton } from 'devextreme/ui/tree_list';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-button-tree-list',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiButtonTreeListComponent extends CollectionNestedOption {
    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get disabled(): boolean | Function {
        return this._getOption('disabled');
    }
    set disabled(value: boolean | Function) {
        this._setOption('disabled', value);
    }

    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get name(): TreeListPredefinedColumnButton | string {
        return this._getOption('name');
    }
    set name(value: TreeListPredefinedColumnButton | string) {
        this._setOption('name', value);
    }

    @Input()
    get onClick(): Function {
        return this._getOption('onClick');
    }
    set onClick(value: Function) {
        this._setOption('onClick', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get visible(): boolean | Function {
        return this._getOption('visible');
    }
    set visible(value: boolean | Function) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'buttons';
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
  declarations: [
    DxiButtonTreeListComponent
  ],
  exports: [
    DxiButtonTreeListComponent
  ],
})
export class DxiButtonTreeListModule { }
