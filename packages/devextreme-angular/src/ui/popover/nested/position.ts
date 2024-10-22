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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-popover-position',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPopoverPositionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get at(): Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" } {
        return this._getOption('at');
    }
    set at(value: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" }) {
        this._setOption('at', value);
    }

    @Input()
    get boundary(): any | string {
        return this._getOption('boundary');
    }
    set boundary(value: any | string) {
        this._setOption('boundary', value);
    }

    @Input()
    get boundaryOffset(): Record<string, any> | string | { x?: number, y?: number } {
        return this._getOption('boundaryOffset');
    }
    set boundaryOffset(value: Record<string, any> | string | { x?: number, y?: number }) {
        this._setOption('boundaryOffset', value);
    }

    @Input()
    get collision(): Record<string, any> | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | { x?: "fit" | "flip" | "flipfit" | "none", y?: "fit" | "flip" | "flipfit" | "none" } {
        return this._getOption('collision');
    }
    set collision(value: Record<string, any> | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | { x?: "fit" | "flip" | "flipfit" | "none", y?: "fit" | "flip" | "flipfit" | "none" }) {
        this._setOption('collision', value);
    }

    @Input()
    get my(): Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" } {
        return this._getOption('my');
    }
    set my(value: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" }) {
        this._setOption('my', value);
    }

    @Input()
    get of(): any | string {
        return this._getOption('of');
    }
    set of(value: any | string) {
        this._setOption('of', value);
    }

    @Input()
    get offset(): Record<string, any> | string | { x?: number, y?: number } {
        return this._getOption('offset');
    }
    set offset(value: Record<string, any> | string | { x?: number, y?: number }) {
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
    DxoPopoverPositionComponent
  ],
  exports: [
    DxoPopoverPositionComponent
  ],
})
export class DxoPopoverPositionModule { }
