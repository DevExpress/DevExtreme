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
    selector: 'dxo-diagram-grid-size',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramGridSizeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get items(): Array<number> {
        return this._getOption('items');
    }
    set items(value: Array<number>) {
        this._setOption('items', value);
    }

    @Input()
    get value(): number {
        return this._getOption('value');
    }
    set value(value: number) {
        this._setOption('value', value);
    }


    protected get _optionPath() {
        return 'gridSize';
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
    DxoDiagramGridSizeComponent
  ],
  exports: [
    DxoDiagramGridSizeComponent
  ],
})
export class DxoDiagramGridSizeModule { }
