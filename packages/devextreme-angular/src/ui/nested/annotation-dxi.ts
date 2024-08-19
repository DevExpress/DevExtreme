/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiChartAnnotationConfig } from './base/chart-annotation-config-dxi';


@Component({
    selector: 'dxi-annotation',
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
        'name',
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
export class DxiAnnotationComponent extends DxiChartAnnotationConfig {

    protected get _optionPath() {
        return 'annotations';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiAnnotationComponent
  ],
  exports: [
    DxiAnnotationComponent
  ],
})
export class DxiAnnotationModule { }
