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
    selector: 'dxo-sankey-hover-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSankeyHoverStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): Record<string, any> | { color: string, visible: boolean, width: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color: string, visible: boolean, width: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get hatching(): Record<string, any> | { direction: "left" | "none" | "right", opacity: number, step: number, width: number } {
        return this._getOption('hatching');
    }
    set hatching(value: Record<string, any> | { direction: "left" | "none" | "right", opacity: number, step: number, width: number }) {
        this._setOption('hatching', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }


    protected get _optionPath() {
        return 'hoverStyle';
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
    DxoSankeyHoverStyleComponent
  ],
  exports: [
    DxoSankeyHoverStyleComponent
  ],
})
export class DxoSankeyHoverStyleModule { }
