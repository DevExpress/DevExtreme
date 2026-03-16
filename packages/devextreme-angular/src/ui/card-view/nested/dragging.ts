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




import type { DragHighlight } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-card-view-dragging',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewDraggingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get dropFeedbackMode(): DragHighlight {
        return this._getOption('dropFeedbackMode');
    }
    set dropFeedbackMode(value: DragHighlight) {
        this._setOption('dropFeedbackMode', value);
    }

    @Input()
    get onDragChange(): ((e: any) => void) {
        return this._getOption('onDragChange');
    }
    set onDragChange(value: ((e: any) => void)) {
        this._setOption('onDragChange', value);
    }

    @Input()
    get onDragEnd(): ((e: any) => void) {
        return this._getOption('onDragEnd');
    }
    set onDragEnd(value: ((e: any) => void)) {
        this._setOption('onDragEnd', value);
    }

    @Input()
    get onDragMove(): ((e: any) => void) {
        return this._getOption('onDragMove');
    }
    set onDragMove(value: ((e: any) => void)) {
        this._setOption('onDragMove', value);
    }

    @Input()
    get onDragStart(): ((e: any) => void) {
        return this._getOption('onDragStart');
    }
    set onDragStart(value: ((e: any) => void)) {
        this._setOption('onDragStart', value);
    }

    @Input()
    get onRemove(): ((e: any) => void) {
        return this._getOption('onRemove');
    }
    set onRemove(value: ((e: any) => void)) {
        this._setOption('onRemove', value);
    }

    @Input()
    get onReorder(): ((e: any) => void) {
        return this._getOption('onReorder');
    }
    set onReorder(value: ((e: any) => void)) {
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


    protected get _optionPath() {
        return 'dragging';
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
    DxoCardViewDraggingComponent
  ],
  exports: [
    DxoCardViewDraggingComponent
  ],
})
export class DxoCardViewDraggingModule { }
