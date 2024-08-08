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




import { CollisionResolution, CollisionResolutionCombination } from 'devextreme/animation/position';
import { HorizontalAlignment, PositionAlignment, VerticalAlignment } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-autocomplete-position',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoAutocompletePositionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get at(): PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment } {
        return this._getOption('at');
    }
    set at(value: PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment }) {
        this._setOption('at', value);
    }

    @Input()
    get boundary(): UserDefinedElement | string | Window {
        return this._getOption('boundary');
    }
    set boundary(value: UserDefinedElement | string | Window) {
        this._setOption('boundary', value);
    }

    @Input()
    get boundaryOffset(): string | { x?: number, y?: number } {
        return this._getOption('boundaryOffset');
    }
    set boundaryOffset(value: string | { x?: number, y?: number }) {
        this._setOption('boundaryOffset', value);
    }

    @Input()
    get collision(): CollisionResolutionCombination | { x?: CollisionResolution, y?: CollisionResolution } {
        return this._getOption('collision');
    }
    set collision(value: CollisionResolutionCombination | { x?: CollisionResolution, y?: CollisionResolution }) {
        this._setOption('collision', value);
    }

    @Input()
    get my(): PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment } {
        return this._getOption('my');
    }
    set my(value: PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment }) {
        this._setOption('my', value);
    }

    @Input()
    get of(): UserDefinedElement | string | Window {
        return this._getOption('of');
    }
    set of(value: UserDefinedElement | string | Window) {
        this._setOption('of', value);
    }

    @Input()
    get offset(): string | { x?: number, y?: number } {
        return this._getOption('offset');
    }
    set offset(value: string | { x?: number, y?: number }) {
        this._setOption('offset', value);
    }


    protected get _optionPath() {
        return 'position';
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
    DxoAutocompletePositionComponent
  ],
  exports: [
    DxoAutocompletePositionComponent
  ],
})
export class DxoAutocompletePositionModule { }
