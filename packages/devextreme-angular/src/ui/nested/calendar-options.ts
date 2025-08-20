/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Output,
    EventEmitter
} from '@angular/core';




import { CalendarZoomLevel } from 'devextreme/ui/calendar';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoCalendarOptions } from './base/calendar-options';


@Component({
    selector: 'dxo-calendar-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'accessKey',
        'activeStateEnabled',
        'cellTemplate',
        'dateSerializationFormat',
        'disabled',
        'disabledDates',
        'elementAttr',
        'firstDayOfWeek',
        'focusStateEnabled',
        'height',
        'hint',
        'hoverStateEnabled',
        'isDirty',
        'isValid',
        'max',
        'maxZoomLevel',
        'min',
        'minZoomLevel',
        'name',
        'onDisposing',
        'onInitialized',
        'onOptionChanged',
        'onValueChanged',
        'readOnly',
        'rtlEnabled',
        'selectionMode',
        'selectWeekOnClick',
        'showTodayButton',
        'showWeekNumbers',
        'tabIndex',
        'validationError',
        'validationErrors',
        'validationMessageMode',
        'validationMessagePosition',
        'validationStatus',
        'value',
        'visible',
        'weekNumberRule',
        'width',
        'zoomLevel'
    ]
})
export class DxoCalendarOptionsComponent extends DxoCalendarOptions implements OnDestroy, OnInit  {

    

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Date | number | null | string | Array<Date | number | string | null>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomLevelChange: EventEmitter<CalendarZoomLevel>;
    protected get _optionPath() {
        return 'calendarOptions';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        this._createEventEmitters([
            { emit: 'valueChange' },
            { emit: 'zoomLevelChange' }
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
  imports: [
    DxoCalendarOptionsComponent
  ],
  exports: [
    DxoCalendarOptionsComponent
  ],
})
export class DxoCalendarOptionsModule { }
