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
    selector: 'dxo-indent-range-selector',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoIndentRangeSelectorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get left(): number | undefined {
        return this._getOption('left');
    }
    set left(value: number | undefined) {
        this._setOption('left', value);
    }

    @Input()
    get right(): number | undefined {
        return this._getOption('right');
    }
    set right(value: number | undefined) {
        this._setOption('right', value);
    }


    protected get _optionPath() {
        return 'indent';
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
    DxoIndentRangeSelectorComponent
  ],
  exports: [
    DxoIndentRangeSelectorComponent
  ],
})
export class DxoIndentRangeSelectorModule { }
