/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoChartCommonAnnotationConfig } from './base/chart-common-annotation-config';


@Component({
    selector: 'dxo-common-annotation-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'allowDragging',
        'argument',
        'arrowLength',
        'arrowWidth',
        'axis',
        'border',
        'color',
        'customizeTooltip',
        'data',
        'description',
        'font',
        'height',
        'image',
        'offsetX',
        'offsetY',
        'opacity',
        'paddingLeftRight',
        'paddingTopBottom',
        'series',
        'shadow',
        'template',
        'text',
        'textOverflow',
        'tooltipEnabled',
        'tooltipTemplate',
        'type',
        'value',
        'width',
        'wordWrap',
        'x',
        'y',
        'location',
        'angle',
        'radius',
        'coordinates'
    ]
})
export class DxoCommonAnnotationSettingsComponent extends DxoChartCommonAnnotationConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'commonAnnotationSettings';
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
    DxoCommonAnnotationSettingsComponent
  ],
  exports: [
    DxoCommonAnnotationSettingsComponent
  ],
})
export class DxoCommonAnnotationSettingsModule { }
