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
    QueryList,
    AfterContentInit
} from '@angular/core';




import { dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from 'devextreme/ui/form';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiSchedulerButtonItemComponent } from './button-item-dxi';
import { DxiSchedulerEmptyItemComponent } from './empty-item-dxi';
import { DxiSchedulerGroupItemComponent } from './group-item-dxi';
import { DxiSchedulerItemComponent } from './item-dxi';
import { DxiSchedulerSimpleItemComponent } from './simple-item-dxi';
import { DxiSchedulerTabbedItemComponent } from './tabbed-item-dxi';


@Component({
    selector: 'dxo-scheduler-form',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoSchedulerFormComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit  {
    @Input()
    get items(): Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>) {
        this._setOption('items', value);
    }

    @Input()
    get onCancel(): ((formData: any) => void) | null {
        return this._getOption('onCancel');
    }
    set onCancel(value: ((formData: any) => void) | null) {
        this._setOption('onCancel', value);
    }

    @Input()
    get onSubmit(): ((formData: any) => void) | null {
        return this._getOption('onSubmit');
    }
    set onSubmit(value: ((formData: any) => void) | null) {
        this._setOption('onSubmit', value);
    }


    protected get _optionPath() {
        return 'form';
    }


    @ContentChildren(forwardRef(() => DxiSchedulerButtonItemComponent)) buttonItemsChildren!: QueryList<DxiSchedulerButtonItemComponent>
    
    @ContentChildren(forwardRef(() => DxiSchedulerEmptyItemComponent)) emptyItemsChildren!: QueryList<DxiSchedulerEmptyItemComponent>
    
    @ContentChildren(forwardRef(() => DxiSchedulerGroupItemComponent)) groupItemsChildren!: QueryList<DxiSchedulerGroupItemComponent>
    
    @ContentChildren(forwardRef(() => DxiSchedulerItemComponent)) itemsChildren!: QueryList<DxiSchedulerItemComponent>
    
    @ContentChildren(forwardRef(() => DxiSchedulerSimpleItemComponent)) simpleItemsChildren!: QueryList<DxiSchedulerSimpleItemComponent>
    
    @ContentChildren(forwardRef(() => DxiSchedulerTabbedItemComponent)) tabbedItemsChildren!: QueryList<DxiSchedulerTabbedItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.buttonItemsChildren.toArray(),
            ...this.emptyItemsChildren.toArray(),
            ...this.groupItemsChildren.toArray(),
            ...this.itemsChildren.toArray(),
            ...this.simpleItemsChildren.toArray(),
            ...this.tabbedItemsChildren.toArray(),
        ]);
        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();
        
        this.buttonItemsChildren.changes.subscribe(() => { this.setItems() });
        this.emptyItemsChildren.changes.subscribe(() => { this.setItems() });
        this.groupItemsChildren.changes.subscribe(() => { this.setItems() });
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
        this.simpleItemsChildren.changes.subscribe(() => { this.setItems() });
        this.tabbedItemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxoSchedulerFormComponent
  ],
  exports: [
    DxoSchedulerFormComponent
  ],
})
export class DxoSchedulerFormModule { }
