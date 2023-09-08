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
    selector: 'dxo-min-visual-range-length',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoMinVisualRangeLengthComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get days(): number {
        return this._getOption('days');
    }
    set days(value: number) {
        this._setOption('days', value);
    }

    @Input()
    get hours(): number {
        return this._getOption('hours');
    }
    set hours(value: number) {
        this._setOption('hours', value);
    }

    @Input()
    get milliseconds(): number {
        return this._getOption('milliseconds');
    }
    set milliseconds(value: number) {
        this._setOption('milliseconds', value);
    }

    @Input()
    get minutes(): number {
        return this._getOption('minutes');
    }
    set minutes(value: number) {
        this._setOption('minutes', value);
    }

    @Input()
    get months(): number {
        return this._getOption('months');
    }
    set months(value: number) {
        this._setOption('months', value);
    }

    @Input()
    get quarters(): number {
        return this._getOption('quarters');
    }
    set quarters(value: number) {
        this._setOption('quarters', value);
    }

    @Input()
    get seconds(): number {
        return this._getOption('seconds');
    }
    set seconds(value: number) {
        this._setOption('seconds', value);
    }

    @Input()
    get weeks(): number {
        return this._getOption('weeks');
    }
    set weeks(value: number) {
        this._setOption('weeks', value);
    }

    @Input()
    get years(): number {
        return this._getOption('years');
    }
    set years(value: number) {
        this._setOption('years', value);
    }


    protected get _optionPath() {
        return 'minVisualRangeLength';
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
    DxoMinVisualRangeLengthComponent
  ],
  exports: [
    DxoMinVisualRangeLengthComponent
  ],
})
export class DxoMinVisualRangeLengthModule { }
