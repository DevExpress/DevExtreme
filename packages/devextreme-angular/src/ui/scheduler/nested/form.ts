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




import { AppointmentFormIconsShowMode } from 'devextreme/ui/scheduler';
import { dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from 'devextreme/ui/form';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-scheduler-form',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoSchedulerFormComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    
    @Input()
    get iconsShowMode(): AppointmentFormIconsShowMode {
        return this._getOption('iconsShowMode');
    }
    set iconsShowMode(value: AppointmentFormIconsShowMode) {
        this._setOption('iconsShowMode', value);
    }

    @Input()
    get items(): Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>) {
        this._setOption('items', value);
    }

    @Input()
    get onCanceled(): ((formData: any) => void) {
        return this._getOption('onCanceled');
    }
    set onCanceled(value: ((formData: any) => void)) {
        this._setOption('onCanceled', value);
    }

    @Input()
    get onSaved(): ((formData: any) => void) {
        return this._getOption('onSaved');
    }
    set onSaved(value: ((formData: any) => void)) {
        this._setOption('onSaved', value);
    }


    protected get _optionPath() {
        return 'form';
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
    DxoSchedulerFormComponent
  ],
  exports: [
    DxoSchedulerFormComponent
  ],
})
export class DxoSchedulerFormModule { }
