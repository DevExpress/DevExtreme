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
    selector: 'dxo-tree-list-cursor-offset',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListCursorOffsetComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get x(): number {
        return this._getOption('x');
    }
    set x(value: number) {
        this._setOption('x', value);
    }

    @Input()
    get y(): number {
        return this._getOption('y');
    }
    set y(value: number) {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'cursorOffset';
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
    DxoTreeListCursorOffsetComponent
  ],
  exports: [
    DxoTreeListCursorOffsetComponent
  ],
})
export class DxoTreeListCursorOffsetModule { }
