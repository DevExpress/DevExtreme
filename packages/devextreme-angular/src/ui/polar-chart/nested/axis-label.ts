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




import { Font, LabelOverlap } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-axis-label',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartAxisLabelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeHint(): ((argument: { value: Date | number | string, valueText: string }) => string) {
        return this._getOption('customizeHint');
    }
    set customizeHint(value: ((argument: { value: Date | number | string, valueText: string }) => string)) {
        this._setOption('customizeHint', value);
    }

    @Input()
    get customizeText(): ((argument: { value: Date | number | string, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((argument: { value: Date | number | string, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get format(): Format | undefined {
        return this._getOption('format');
    }
    set format(value: Format | undefined) {
        this._setOption('format', value);
    }

    @Input()
    get indentFromAxis(): number {
        return this._getOption('indentFromAxis');
    }
    set indentFromAxis(value: number) {
        this._setOption('indentFromAxis', value);
    }

    @Input()
    get overlappingBehavior(): LabelOverlap {
        return this._getOption('overlappingBehavior');
    }
    set overlappingBehavior(value: LabelOverlap) {
        this._setOption('overlappingBehavior', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'label';
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
    DxoPolarChartAxisLabelComponent
  ],
  exports: [
    DxoPolarChartAxisLabelComponent
  ],
})
export class DxoPolarChartAxisLabelModule { }
