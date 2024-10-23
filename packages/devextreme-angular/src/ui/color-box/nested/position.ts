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
    selector: 'dxo-color-box-position',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoColorBoxPositionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get at(): "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" } {
        return this._getOption('at');
    }
    set at(value: "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" }) {
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
    get boundaryOffset(): string | { x?: number, y?: number } {
        return this._getOption('boundaryOffset');
    }
    set boundaryOffset(value: string | { x?: number, y?: number }) {
        this._setOption('boundaryOffset', value);
    }

    @Input()
    get collision(): "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | { x?: "fit" | "flip" | "flipfit" | "none", y?: "fit" | "flip" | "flipfit" | "none" } {
        return this._getOption('collision');
    }
    set collision(value: "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | { x?: "fit" | "flip" | "flipfit" | "none", y?: "fit" | "flip" | "flipfit" | "none" }) {
        this._setOption('collision', value);
    }

    @Input()
    get my(): "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" } {
        return this._getOption('my');
    }
    set my(value: "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | { x?: "center" | "left" | "right", y?: "bottom" | "center" | "top" }) {
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
    DxoColorBoxPositionComponent
  ],
  exports: [
    DxoColorBoxPositionComponent
  ],
})
export class DxoColorBoxPositionModule { }
