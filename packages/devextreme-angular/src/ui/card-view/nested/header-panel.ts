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
    selector: 'dxo-card-view-header-panel',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewHeaderPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get dragging(): { dropFeedbackMode?: DragHighlight, onDragChange?: ((e: any) => void), onDragEnd?: ((e: any) => void), onDragMove?: ((e: any) => void), onDragStart?: ((e: any) => void), onRemove?: ((e: any) => void), onReorder?: ((e: any) => void), scrollSensitivity?: number, scrollSpeed?: number } {
        return this._getOption('dragging');
    }
    set dragging(value: { dropFeedbackMode?: DragHighlight, onDragChange?: ((e: any) => void), onDragEnd?: ((e: any) => void), onDragMove?: ((e: any) => void), onDragStart?: ((e: any) => void), onRemove?: ((e: any) => void), onReorder?: ((e: any) => void), scrollSensitivity?: number, scrollSpeed?: number }) {
        this._setOption('dragging', value);
    }

    @Input()
    get itemCssClass(): string {
        return this._getOption('itemCssClass');
    }
    set itemCssClass(value: string) {
        this._setOption('itemCssClass', value);
    }

    @Input()
    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'headerPanel';
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
    DxoCardViewHeaderPanelComponent
  ],
  exports: [
    DxoCardViewHeaderPanelComponent
  ],
})
export class DxoCardViewHeaderPanelModule { }
