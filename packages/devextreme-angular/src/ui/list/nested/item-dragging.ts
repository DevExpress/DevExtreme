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




import { DragDirection, DragHighlight, Orientation } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { AddEvent, DisposingEvent, DragChangeEvent, DragEndEvent, DragMoveEvent, DragStartEvent, InitializedEvent, OptionChangedEvent, RemoveEvent, ReorderEvent } from 'devextreme/ui/sortable';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-list-item-dragging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoListItemDraggingComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get boundary(): UserDefinedElement | string | undefined {
        return this._getOption('boundary');
    }
    set boundary(value: UserDefinedElement | string | undefined) {
        this._setOption('boundary', value);
    }

    @Input()
    get container(): UserDefinedElement | string | undefined {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string | undefined) {
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
    get dragTemplate(): any | undefined {
        return this._getOption('dragTemplate');
    }
    set dragTemplate(value: any | undefined) {
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
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
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
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get itemOrientation(): Orientation {
        return this._getOption('itemOrientation');
    }
    set itemOrientation(value: Orientation) {
        this._setOption('itemOrientation', value);
    }

    @Input()
    get moveItemOnDrop(): boolean {
        return this._getOption('moveItemOnDrop');
    }
    set moveItemOnDrop(value: boolean) {
        this._setOption('moveItemOnDrop', value);
    }

    @Input()
    get onAdd(): ((e: AddEvent) => void) {
        return this._getOption('onAdd');
    }
    set onAdd(value: ((e: AddEvent) => void)) {
        this._setOption('onAdd', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onDragChange(): ((e: DragChangeEvent) => void) {
        return this._getOption('onDragChange');
    }
    set onDragChange(value: ((e: DragChangeEvent) => void)) {
        this._setOption('onDragChange', value);
    }

    @Input()
    get onDragEnd(): ((e: DragEndEvent) => void) {
        return this._getOption('onDragEnd');
    }
    set onDragEnd(value: ((e: DragEndEvent) => void)) {
        this._setOption('onDragEnd', value);
    }

    @Input()
    get onDragMove(): ((e: DragMoveEvent) => void) {
        return this._getOption('onDragMove');
    }
    set onDragMove(value: ((e: DragMoveEvent) => void)) {
        this._setOption('onDragMove', value);
    }

    @Input()
    get onDragStart(): ((e: DragStartEvent) => void) {
        return this._getOption('onDragStart');
    }
    set onDragStart(value: ((e: DragStartEvent) => void)) {
        this._setOption('onDragStart', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onRemove(): ((e: RemoveEvent) => void) {
        return this._getOption('onRemove');
    }
    set onRemove(value: ((e: RemoveEvent) => void)) {
        this._setOption('onRemove', value);
    }

    @Input()
    get onReorder(): ((e: ReorderEvent) => void) {
        return this._getOption('onReorder');
    }
    set onReorder(value: ((e: ReorderEvent) => void)) {
        this._setOption('onReorder', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
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
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'itemDragging';
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
    DxoListItemDraggingComponent
  ],
  exports: [
    DxoListItemDraggingComponent
  ],
})
export class DxoListItemDraggingModule { }
