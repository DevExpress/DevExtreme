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




import { SchedulerPredefinedToolbarItem, ToolbarItem } from 'devextreme/ui/scheduler';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiSchedulerItemComponent } from './item-dxi';
import { DxiSchedulerToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-scheduler-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSchedulerToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get items(): Array<SchedulerPredefinedToolbarItem | ToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<SchedulerPredefinedToolbarItem | ToolbarItem>) {
        this._setOption('items', value);
    }

    @Input()
    get multiline(): boolean {
        return this._getOption('multiline');
    }
    set multiline(value: boolean) {
        this._setOption('multiline', value);
    }

    @Input()
    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'toolbar';
    }


    @ContentChildren(forwardRef(() => DxiSchedulerItemComponent))
    get itemsChildren(): QueryList<DxiSchedulerItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiSchedulerToolbarItemComponent))
    get toolbarItemsChildren(): QueryList<DxiSchedulerToolbarItemComponent> {
        return this._getOption('items');
    }
    set toolbarItemsChildren(value) {
        this.setChildren('items', value);
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
    DxoSchedulerToolbarComponent
  ],
  exports: [
    DxoSchedulerToolbarComponent
  ],
})
export class DxoSchedulerToolbarModule { }
