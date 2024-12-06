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




import dxSortable from 'devextreme/ui/sortable';
import dxDraggable from 'devextreme/ui/draggable';
import { DragDirection, DragHighlight } from 'devextreme/common';
import { GridBase } from 'devextreme/common/grids';
import { event } from 'devextreme/events/events.types';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-row-dragging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridRowDraggingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDropInsideItem(): boolean {
        return this._getOption('allowDropInsideItem');
    }
    set allowDropInsideItem(value: boolean) {
        this._setOption('allowDropInsideItem', value);
    }

    @Input()
    get allowReordering(): boolean {
        return this._getOption('allowReordering');
    }
    set allowReordering(value: boolean) {
        this._setOption('allowReordering', value);
    }

    @Input()
    get autoScroll(): boolean {
        return this._getOption('autoScroll');
    }
    set autoScroll(value: boolean) {
        this._setOption('autoScroll', value);
    }

    @Input()
    get boundary(): any | string | undefined {
        return this._getOption('boundary');
    }
    set boundary(value: any | string | undefined) {
        this._setOption('boundary', value);
    }

    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
        this._setOption('container', value);
    }

    @Input()
    get cursorOffset(): string | { x?: number, y?: number } {
        return this._getOption('cursorOffset');
    }
    set cursorOffset(value: string | { x?: number, y?: number }) {
        this._setOption('cursorOffset', value);
    }

    @Input()
    get data(): any | undefined {
        return this._getOption('data');
    }
    set data(value: any | undefined) {
        this._setOption('data', value);
    }

    @Input()
    get dragDirection(): DragDirection {
        return this._getOption('dragDirection');
    }
    set dragDirection(value: DragDirection) {
        this._setOption('dragDirection', value);
    }

    @Input()
    get dragTemplate(): any {
        return this._getOption('dragTemplate');
    }
    set dragTemplate(value: any) {
        this._setOption('dragTemplate', value);
    }

    @Input()
    get dropFeedbackMode(): DragHighlight {
        return this._getOption('dropFeedbackMode');
    }
    set dropFeedbackMode(value: DragHighlight) {
        this._setOption('dropFeedbackMode', value);
    }

    @Input()
    get filter(): string {
        return this._getOption('filter');
    }
    set filter(value: string) {
        this._setOption('filter', value);
    }

    @Input()
    get group(): string | undefined {
        return this._getOption('group');
    }
    set group(value: string | undefined) {
        this._setOption('group', value);
    }

    @Input()
    get handle(): string {
        return this._getOption('handle');
    }
    set handle(value: string) {
        this._setOption('handle', value);
    }

    @Input()
    get onAdd(): ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void) {
        return this._getOption('onAdd');
    }
    set onAdd(value: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)) {
        this._setOption('onAdd', value);
    }

    @Input()
    get onDragChange(): ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void) {
        return this._getOption('onDragChange');
    }
    set onDragChange(value: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)) {
        this._setOption('onDragChange', value);
    }

    @Input()
    get onDragEnd(): ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void) {
        return this._getOption('onDragEnd');
    }
    set onDragEnd(value: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)) {
        this._setOption('onDragEnd', value);
    }

    @Input()
    get onDragMove(): ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void) {
        return this._getOption('onDragMove');
    }
    set onDragMove(value: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)) {
        this._setOption('onDragMove', value);
    }

    @Input()
    get onDragStart(): ((e: { cancel: boolean, component: GridBase, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any }) => void) {
        return this._getOption('onDragStart');
    }
    set onDragStart(value: ((e: { cancel: boolean, component: GridBase, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any }) => void)) {
        this._setOption('onDragStart', value);
    }

    @Input()
    get onRemove(): ((e: { component: GridBase, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void) {
        return this._getOption('onRemove');
    }
    set onRemove(value: ((e: { component: GridBase, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)) {
        this._setOption('onRemove', value);
    }

    @Input()
    get onReorder(): ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void) {
        return this._getOption('onReorder');
    }
    set onReorder(value: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)) {
        this._setOption('onReorder', value);
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

    @Input()
    get showDragIcons(): boolean {
        return this._getOption('showDragIcons');
    }
    set showDragIcons(value: boolean) {
        this._setOption('showDragIcons', value);
    }


    protected get _optionPath() {
        return 'rowDragging';
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
    DxoDataGridRowDraggingComponent
  ],
  exports: [
    DxoDataGridRowDraggingComponent
  ],
})
export class DxoDataGridRowDraggingModule { }
