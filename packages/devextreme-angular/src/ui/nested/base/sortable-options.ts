/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { DragDirection, DragHighlight, Orientation } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { AddEvent, DisposingEvent, DragChangeEvent, DragEndEvent, DragMoveEvent, DragStartEvent, InitializedEvent, OptionChangedEvent, RemoveEvent, ReorderEvent } from 'devextreme/ui/sortable';

@Component({
    template: ''
})
export abstract class DxoSortableOptions extends NestedOption {
    get allowDropInsideItem(): boolean {
        return this._getOption('allowDropInsideItem');
    }
    set allowDropInsideItem(value: boolean) {
        this._setOption('allowDropInsideItem', value);
    }

    get allowReordering(): boolean {
        return this._getOption('allowReordering');
    }
    set allowReordering(value: boolean) {
        this._setOption('allowReordering', value);
    }

    get autoScroll(): boolean {
        return this._getOption('autoScroll');
    }
    set autoScroll(value: boolean) {
        this._setOption('autoScroll', value);
    }

    get boundary(): UserDefinedElement | string | undefined {
        return this._getOption('boundary');
    }
    set boundary(value: UserDefinedElement | string | undefined) {
        this._setOption('boundary', value);
    }

    get container(): UserDefinedElement | string | undefined {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string | undefined) {
        this._setOption('container', value);
    }

    get cursorOffset(): string | { x?: number, y?: number } {
        return this._getOption('cursorOffset');
    }
    set cursorOffset(value: string | { x?: number, y?: number }) {
        this._setOption('cursorOffset', value);
    }

    get data(): any | undefined {
        return this._getOption('data');
    }
    set data(value: any | undefined) {
        this._setOption('data', value);
    }

    get dragDirection(): DragDirection {
        return this._getOption('dragDirection');
    }
    set dragDirection(value: DragDirection) {
        this._setOption('dragDirection', value);
    }

    get dragTemplate(): any | undefined {
        return this._getOption('dragTemplate');
    }
    set dragTemplate(value: any | undefined) {
        this._setOption('dragTemplate', value);
    }

    get dropFeedbackMode(): DragHighlight {
        return this._getOption('dropFeedbackMode');
    }
    set dropFeedbackMode(value: DragHighlight) {
        this._setOption('dropFeedbackMode', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get filter(): string {
        return this._getOption('filter');
    }
    set filter(value: string) {
        this._setOption('filter', value);
    }

    get group(): string | undefined {
        return this._getOption('group');
    }
    set group(value: string | undefined) {
        this._setOption('group', value);
    }

    get handle(): string {
        return this._getOption('handle');
    }
    set handle(value: string) {
        this._setOption('handle', value);
    }

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    get itemOrientation(): Orientation {
        return this._getOption('itemOrientation');
    }
    set itemOrientation(value: Orientation) {
        this._setOption('itemOrientation', value);
    }

    get moveItemOnDrop(): boolean {
        return this._getOption('moveItemOnDrop');
    }
    set moveItemOnDrop(value: boolean) {
        this._setOption('moveItemOnDrop', value);
    }

    get onAdd(): ((e: AddEvent) => void) {
        return this._getOption('onAdd');
    }
    set onAdd(value: ((e: AddEvent) => void)) {
        this._setOption('onAdd', value);
    }

    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    get onDragChange(): ((e: DragChangeEvent) => void) {
        return this._getOption('onDragChange');
    }
    set onDragChange(value: ((e: DragChangeEvent) => void)) {
        this._setOption('onDragChange', value);
    }

    get onDragEnd(): ((e: DragEndEvent) => void) {
        return this._getOption('onDragEnd');
    }
    set onDragEnd(value: ((e: DragEndEvent) => void)) {
        this._setOption('onDragEnd', value);
    }

    get onDragMove(): ((e: DragMoveEvent) => void) {
        return this._getOption('onDragMove');
    }
    set onDragMove(value: ((e: DragMoveEvent) => void)) {
        this._setOption('onDragMove', value);
    }

    get onDragStart(): ((e: DragStartEvent) => void) {
        return this._getOption('onDragStart');
    }
    set onDragStart(value: ((e: DragStartEvent) => void)) {
        this._setOption('onDragStart', value);
    }

    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    get onRemove(): ((e: RemoveEvent) => void) {
        return this._getOption('onRemove');
    }
    set onRemove(value: ((e: RemoveEvent) => void)) {
        this._setOption('onRemove', value);
    }

    get onReorder(): ((e: ReorderEvent) => void) {
        return this._getOption('onReorder');
    }
    set onReorder(value: ((e: ReorderEvent) => void)) {
        this._setOption('onReorder', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get scrollSensitivity(): number {
        return this._getOption('scrollSensitivity');
    }
    set scrollSensitivity(value: number) {
        this._setOption('scrollSensitivity', value);
    }

    get scrollSpeed(): number {
        return this._getOption('scrollSpeed');
    }
    set scrollSpeed(value: number) {
        this._setOption('scrollSpeed', value);
    }

    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }
}
