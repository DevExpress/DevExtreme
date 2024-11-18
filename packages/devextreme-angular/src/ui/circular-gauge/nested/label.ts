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
import { CircularGaugeLabelOverlap } from 'devextreme/viz/circular_gauge';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-circular-gauge-label',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCircularGaugeLabelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeText(): ((scaleValue: { value: number, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((scaleValue: { value: number, valueText: string }) => string)) {
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
    get hideFirstOrLast(): CircularGaugeLabelOverlap {
        return this._getOption('hideFirstOrLast');
    }
    set hideFirstOrLast(value: CircularGaugeLabelOverlap) {
        this._setOption('hideFirstOrLast', value);
    }

    @Input()
    get indentFromTick(): number {
        return this._getOption('indentFromTick');
    }
    set indentFromTick(value: number) {
        this._setOption('indentFromTick', value);
    }

    @Input()
    get overlappingBehavior(): LabelOverlap {
        return this._getOption('overlappingBehavior');
    }
    set overlappingBehavior(value: LabelOverlap) {
        this._setOption('overlappingBehavior', value);
    }

    @Input()
    get useRangeColors(): boolean {
        return this._getOption('useRangeColors');
    }
    set useRangeColors(value: boolean) {
        this._setOption('useRangeColors', value);
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
    DxoCircularGaugeLabelComponent
  ],
  exports: [
    DxoCircularGaugeLabelComponent
  ],
})
export class DxoCircularGaugeLabelModule { }
