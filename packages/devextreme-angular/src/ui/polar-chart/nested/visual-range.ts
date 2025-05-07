/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter
} from '@angular/core';




import { TimeInterval } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-visual-range',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartVisualRangeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get endValue(): Date | number | string | undefined {
        return this._getOption('endValue');
    }
    set endValue(value: Date | number | string | undefined) {
        this._setOption('endValue', value);
    }

    @Input()
    get length(): number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('length');
    }
    set length(value: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('length', value);
    }

    @Input()
    get startValue(): Date | number | string | undefined {
        return this._getOption('startValue');
    }
    set startValue(value: Date | number | string | undefined) {
        this._setOption('startValue', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() endValueChange: EventEmitter<Date | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startValueChange: EventEmitter<Date | number | string | undefined>;
    protected get _optionPath() {
        return 'visualRange';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'endValueChange' },
            { emit: 'startValueChange' }
        ]);

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
    DxoPolarChartVisualRangeComponent
  ],
  exports: [
    DxoPolarChartVisualRangeComponent
  ],
})
export class DxoPolarChartVisualRangeModule { }
