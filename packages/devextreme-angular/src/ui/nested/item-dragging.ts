/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoSortableOptions } from './base/sortable-options';


@Component({
    selector: 'dxo-item-dragging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'allowDropInsideItem',
        'allowReordering',
        'autoScroll',
        'boundary',
        'container',
        'cursorOffset',
        'data',
        'dragDirection',
        'dragTemplate',
        'dropFeedbackMode',
        'elementAttr',
        'filter',
        'group',
        'handle',
        'height',
        'itemOrientation',
        'moveItemOnDrop',
        'onAdd',
        'onDisposing',
        'onDragChange',
        'onDragEnd',
        'onDragMove',
        'onDragStart',
        'onInitialized',
        'onOptionChanged',
        'onRemove',
        'onReorder',
        'rtlEnabled',
        'scrollSensitivity',
        'scrollSpeed',
        'width'
    ]
})
export class DxoItemDraggingComponent extends DxoSortableOptions implements OnDestroy, OnInit  {

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
    DxoItemDraggingComponent
  ],
  exports: [
    DxoItemDraggingComponent
  ],
})
export class DxoItemDraggingModule { }
