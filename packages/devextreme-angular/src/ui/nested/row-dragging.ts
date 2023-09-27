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




import { DragDirection, DragHighlight } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-row-dragging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRowDraggingComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get boundary(): string | UserDefinedElement | undefined {
        return this._getOption('boundary');
    }
    set boundary(value: string | UserDefinedElement | undefined) {
        this._setOption('boundary', value);
    }

    @Input()
    get container(): string | UserDefinedElement | undefined {
        return this._getOption('container');
    }
    set container(value: string | UserDefinedElement | undefined) {
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
    get onAdd(): Function {
        return this._getOption('onAdd');
    }
    set onAdd(value: Function) {
        this._setOption('onAdd', value);
    }

    @Input()
    get onDragChange(): Function {
        return this._getOption('onDragChange');
    }
    set onDragChange(value: Function) {
        this._setOption('onDragChange', value);
    }

    @Input()
    get onDragEnd(): Function {
        return this._getOption('onDragEnd');
    }
    set onDragEnd(value: Function) {
        this._setOption('onDragEnd', value);
    }

    @Input()
    get onDragMove(): Function {
        return this._getOption('onDragMove');
    }
    set onDragMove(value: Function) {
        this._setOption('onDragMove', value);
    }

    @Input()
    get onDragStart(): Function {
        return this._getOption('onDragStart');
    }
    set onDragStart(value: Function) {
        this._setOption('onDragStart', value);
    }

    @Input()
    get onRemove(): Function {
        return this._getOption('onRemove');
    }
    set onRemove(value: Function) {
        this._setOption('onRemove', value);
    }

    @Input()
    get onReorder(): Function {
        return this._getOption('onReorder');
    }
    set onReorder(value: Function) {
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
    DxoRowDraggingComponent
  ],
  exports: [
    DxoRowDraggingComponent
  ],
})
export class DxoRowDraggingModule { }
