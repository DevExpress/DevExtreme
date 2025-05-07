/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter
} from '@angular/core';


import { DragDirection, DragHighlight, Orientation } from 'devextreme/common';
import { AddEvent, DisposingEvent, DragChangeEvent, DragEndEvent, DragMoveEvent, DragStartEvent, InitializedEvent, OptionChangedEvent, RemoveEvent, ReorderEvent } from 'devextreme/ui/sortable';

import DxSortable from 'devextreme/ui/sortable';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoCursorOffsetModule } from 'devextreme-angular/ui/nested';

import { DxoSortableCursorOffsetModule } from 'devextreme-angular/ui/sortable/nested';




/**
 * [descr:dxSortable]

 */
@Component({
    selector: 'dx-sortable',
    template: '<ng-content></ng-content>',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxSortableComponent extends DxComponent implements OnDestroy {
    instance: DxSortable = null;

    /**
     * [descr:dxSortableOptions.allowDropInsideItem]
    
     */
    @Input()
    get allowDropInsideItem(): boolean {
        return this._getOption('allowDropInsideItem');
    }
    set allowDropInsideItem(value: boolean) {
        this._setOption('allowDropInsideItem', value);
    }


    /**
     * [descr:dxSortableOptions.allowReordering]
    
     */
    @Input()
    get allowReordering(): boolean {
        return this._getOption('allowReordering');
    }
    set allowReordering(value: boolean) {
        this._setOption('allowReordering', value);
    }


    /**
     * [descr:DraggableBaseOptions.autoScroll]
    
     */
    @Input()
    get autoScroll(): boolean {
        return this._getOption('autoScroll');
    }
    set autoScroll(value: boolean) {
        this._setOption('autoScroll', value);
    }


    /**
     * [descr:DraggableBaseOptions.boundary]
    
     */
    @Input()
    get boundary(): any | string | undefined {
        return this._getOption('boundary');
    }
    set boundary(value: any | string | undefined) {
        this._setOption('boundary', value);
    }


    /**
     * [descr:DraggableBaseOptions.container]
    
     */
    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
        this._setOption('container', value);
    }


    /**
     * [descr:DraggableBaseOptions.cursorOffset]
    
     */
    @Input()
    get cursorOffset(): string | { x?: number, y?: number } {
        return this._getOption('cursorOffset');
    }
    set cursorOffset(value: string | { x?: number, y?: number }) {
        this._setOption('cursorOffset', value);
    }


    /**
     * [descr:DraggableBaseOptions.data]
    
     */
    @Input()
    get data(): any | undefined {
        return this._getOption('data');
    }
    set data(value: any | undefined) {
        this._setOption('data', value);
    }


    /**
     * [descr:DraggableBaseOptions.dragDirection]
    
     */
    @Input()
    get dragDirection(): DragDirection {
        return this._getOption('dragDirection');
    }
    set dragDirection(value: DragDirection) {
        this._setOption('dragDirection', value);
    }


    /**
     * [descr:dxSortableOptions.dragTemplate]
    
     */
    @Input()
    get dragTemplate(): any {
        return this._getOption('dragTemplate');
    }
    set dragTemplate(value: any) {
        this._setOption('dragTemplate', value);
    }


    /**
     * [descr:dxSortableOptions.dropFeedbackMode]
    
     */
    @Input()
    get dropFeedbackMode(): DragHighlight {
        return this._getOption('dropFeedbackMode');
    }
    set dropFeedbackMode(value: DragHighlight) {
        this._setOption('dropFeedbackMode', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxSortableOptions.filter]
    
     */
    @Input()
    get filter(): string {
        return this._getOption('filter');
    }
    set filter(value: string) {
        this._setOption('filter', value);
    }


    /**
     * [descr:DraggableBaseOptions.group]
    
     */
    @Input()
    get group(): string | undefined {
        return this._getOption('group');
    }
    set group(value: string | undefined) {
        this._setOption('group', value);
    }


    /**
     * [descr:DraggableBaseOptions.handle]
    
     */
    @Input()
    get handle(): string {
        return this._getOption('handle');
    }
    set handle(value: string) {
        this._setOption('handle', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxSortableOptions.itemOrientation]
    
     */
    @Input()
    get itemOrientation(): Orientation {
        return this._getOption('itemOrientation');
    }
    set itemOrientation(value: Orientation) {
        this._setOption('itemOrientation', value);
    }


    /**
     * [descr:dxSortableOptions.moveItemOnDrop]
    
     */
    @Input()
    get moveItemOnDrop(): boolean {
        return this._getOption('moveItemOnDrop');
    }
    set moveItemOnDrop(value: boolean) {
        this._setOption('moveItemOnDrop', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:DraggableBaseOptions.scrollSensitivity]
    
     */
    @Input()
    get scrollSensitivity(): number {
        return this._getOption('scrollSensitivity');
    }
    set scrollSensitivity(value: number) {
        this._setOption('scrollSensitivity', value);
    }


    /**
     * [descr:DraggableBaseOptions.scrollSpeed]
    
     */
    @Input()
    get scrollSpeed(): number {
        return this._getOption('scrollSpeed');
    }
    set scrollSpeed(value: number) {
        this._setOption('scrollSpeed', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxSortableOptions.onAdd]
    
    
     */
    @Output() onAdd: EventEmitter<AddEvent>;

    /**
    
     * [descr:dxSortableOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxSortableOptions.onDragChange]
    
    
     */
    @Output() onDragChange: EventEmitter<DragChangeEvent>;

    /**
    
     * [descr:dxSortableOptions.onDragEnd]
    
    
     */
    @Output() onDragEnd: EventEmitter<DragEndEvent>;

    /**
    
     * [descr:dxSortableOptions.onDragMove]
    
    
     */
    @Output() onDragMove: EventEmitter<DragMoveEvent>;

    /**
    
     * [descr:dxSortableOptions.onDragStart]
    
    
     */
    @Output() onDragStart: EventEmitter<DragStartEvent>;

    /**
    
     * [descr:dxSortableOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxSortableOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxSortableOptions.onRemove]
    
    
     */
    @Output() onRemove: EventEmitter<RemoveEvent>;

    /**
    
     * [descr:dxSortableOptions.onReorder]
    
    
     */
    @Output() onReorder: EventEmitter<ReorderEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowDropInsideItemChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowReorderingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() autoScrollChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() boundaryChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerChange: EventEmitter<any | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cursorOffsetChange: EventEmitter<string | { x?: number, y?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataChange: EventEmitter<any | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dragDirectionChange: EventEmitter<DragDirection>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dragTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dropFeedbackModeChange: EventEmitter<DragHighlight>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() handleChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemOrientationChange: EventEmitter<Orientation>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() moveItemOnDropChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollSensitivityChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollSpeedChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            _watcherHelper: WatcherHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'add', emit: 'onAdd' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'dragChange', emit: 'onDragChange' },
            { subscribe: 'dragEnd', emit: 'onDragEnd' },
            { subscribe: 'dragMove', emit: 'onDragMove' },
            { subscribe: 'dragStart', emit: 'onDragStart' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'remove', emit: 'onRemove' },
            { subscribe: 'reorder', emit: 'onReorder' },
            { emit: 'allowDropInsideItemChange' },
            { emit: 'allowReorderingChange' },
            { emit: 'autoScrollChange' },
            { emit: 'boundaryChange' },
            { emit: 'containerChange' },
            { emit: 'cursorOffsetChange' },
            { emit: 'dataChange' },
            { emit: 'dragDirectionChange' },
            { emit: 'dragTemplateChange' },
            { emit: 'dropFeedbackModeChange' },
            { emit: 'elementAttrChange' },
            { emit: 'filterChange' },
            { emit: 'groupChange' },
            { emit: 'handleChange' },
            { emit: 'heightChange' },
            { emit: 'itemOrientationChange' },
            { emit: 'moveItemOnDropChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollSensitivityChange' },
            { emit: 'scrollSpeedChange' },
            { emit: 'widthChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxSortable(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

}

@NgModule({
  imports: [
    DxoCursorOffsetModule,
    DxoSortableCursorOffsetModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxSortableComponent
  ],
  exports: [
    DxSortableComponent,
    DxoCursorOffsetModule,
    DxoSortableCursorOffsetModule,
    DxTemplateModule
  ]
})
export class DxSortableModule { }

import type * as DxSortableTypes from "devextreme/ui/sortable_types";
export { DxSortableTypes };


