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
    selector: 'dxo-diagram-page-size',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramPageSizeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    @Input()
    get items(): Array<Record<string, any>> | { height?: number, text?: string, width?: number }[] {
        return this._getOption('items');
    }
    set items(value: Array<Record<string, any>> | { height?: number, text?: string, width?: number }[]) {
        this._setOption('items', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'pageSize';
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
    DxoDiagramPageSizeComponent
  ],
  exports: [
    DxoDiagramPageSizeComponent
  ],
})
export class DxoDiagramPageSizeModule { }
