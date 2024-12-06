/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import dxScheduler from 'devextreme/ui/scheduler';
import dxSortable from 'devextreme/ui/sortable';
import dxDraggable from 'devextreme/ui/draggable';
import { event } from 'devextreme/events/events.types';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-scheduler-appointment-dragging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSchedulerAppointmentDraggingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get autoScroll(): boolean {
        return this._getOption('autoScroll');
    }
    set autoScroll(value: boolean) {
        this._setOption('autoScroll', value);
    }

    @Input()
    get data(): any | undefined {
        return this._getOption('data');
    }
    set data(value: any | undefined) {
        this._setOption('data', value);
    }

    @Input()
    get group(): string | undefined {
        return this._getOption('group');
    }
    set group(value: string | undefined) {
        this._setOption('group', value);
    }

    @Input()
    get onAdd(): ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void) {
        return this._getOption('onAdd');
    }
    set onAdd(value: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void)) {
        this._setOption('onAdd', value);
    }

    @Input()
    get onDragEnd(): ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void) {
        return this._getOption('onDragEnd');
    }
    set onDragEnd(value: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void)) {
        this._setOption('onDragEnd', value);
    }

    @Input()
    get onDragMove(): ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void) {
        return this._getOption('onDragMove');
    }
    set onDragMove(value: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void)) {
        this._setOption('onDragMove', value);
    }

    @Input()
    get onDragStart(): ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void) {
        return this._getOption('onDragStart');
    }
    set onDragStart(value: ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void)) {
        this._setOption('onDragStart', value);
    }

    @Input()
    get onRemove(): ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void) {
        return this._getOption('onRemove');
    }
    set onRemove(value: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void)) {
        this._setOption('onRemove', value);
    }

    @Input()
    get scrollSensitivity(): number {
        return this._getOption('scrollSensitivity');
    }
    set scrollSensitivity(value: number) {
        this._setOption('scrollSensitivity', value);
    }

    @Input()
    get scrollSpeed(): number {
        return this._getOption('scrollSpeed');
    }
    set scrollSpeed(value: number) {
        this._setOption('scrollSpeed', value);
    }


    protected get _optionPath() {
        return 'appointmentDragging';
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
    DxoSchedulerAppointmentDraggingComponent
  ],
  exports: [
    DxoSchedulerAppointmentDraggingComponent
  ],
})
export class DxoSchedulerAppointmentDraggingModule { }
