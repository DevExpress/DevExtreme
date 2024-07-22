/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { FirstDayOfWeek, Orientation } from 'devextreme/common';
import { AllDayPanelMode, CellAppointmentsLimit, dxSchedulerScrolling, ViewType } from 'devextreme/ui/scheduler';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-view',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiViewComponent extends CollectionNestedOption {
    @Input()
    get agendaDuration(): number {
        return this._getOption('agendaDuration');
    }
    set agendaDuration(value: number) {
        this._setOption('agendaDuration', value);
    }

    @Input()
    get allDayPanelMode(): AllDayPanelMode {
        return this._getOption('allDayPanelMode');
    }
    set allDayPanelMode(value: AllDayPanelMode) {
        this._setOption('allDayPanelMode', value);
    }

    @Input()
    get appointmentCollectorTemplate(): any {
        return this._getOption('appointmentCollectorTemplate');
    }
    set appointmentCollectorTemplate(value: any) {
        this._setOption('appointmentCollectorTemplate', value);
    }

    @Input()
    get appointmentTemplate(): any {
        return this._getOption('appointmentTemplate');
    }
    set appointmentTemplate(value: any) {
        this._setOption('appointmentTemplate', value);
    }

    @Input()
    get appointmentTooltipTemplate(): any {
        return this._getOption('appointmentTooltipTemplate');
    }
    set appointmentTooltipTemplate(value: any) {
        this._setOption('appointmentTooltipTemplate', value);
    }

    @Input()
    get cellDuration(): number {
        return this._getOption('cellDuration');
    }
    set cellDuration(value: number) {
        this._setOption('cellDuration', value);
    }

    @Input()
    get dataCellTemplate(): any {
        return this._getOption('dataCellTemplate');
    }
    set dataCellTemplate(value: any) {
        this._setOption('dataCellTemplate', value);
    }

    @Input()
    get dateCellTemplate(): any {
        return this._getOption('dateCellTemplate');
    }
    set dateCellTemplate(value: any) {
        this._setOption('dateCellTemplate', value);
    }

    @Input()
    get dropDownAppointmentTemplate(): any {
        return this._getOption('dropDownAppointmentTemplate');
    }
    set dropDownAppointmentTemplate(value: any) {
        this._setOption('dropDownAppointmentTemplate', value);
    }

    @Input()
    get endDayHour(): number {
        return this._getOption('endDayHour');
    }
    set endDayHour(value: number) {
        this._setOption('endDayHour', value);
    }

    @Input()
    get firstDayOfWeek(): FirstDayOfWeek | undefined {
        return this._getOption('firstDayOfWeek');
    }
    set firstDayOfWeek(value: FirstDayOfWeek | undefined) {
        this._setOption('firstDayOfWeek', value);
    }

    @Input()
    get groupByDate(): boolean {
        return this._getOption('groupByDate');
    }
    set groupByDate(value: boolean) {
        this._setOption('groupByDate', value);
    }

    @Input()
    get groupOrientation(): Orientation {
        return this._getOption('groupOrientation');
    }
    set groupOrientation(value: Orientation) {
        this._setOption('groupOrientation', value);
    }

    @Input()
    get groups(): Array<string> {
        return this._getOption('groups');
    }
    set groups(value: Array<string>) {
        this._setOption('groups', value);
    }

    @Input()
    get intervalCount(): number {
        return this._getOption('intervalCount');
    }
    set intervalCount(value: number) {
        this._setOption('intervalCount', value);
    }

    @Input()
    get maxAppointmentsPerCell(): CellAppointmentsLimit | number {
        return this._getOption('maxAppointmentsPerCell');
    }
    set maxAppointmentsPerCell(value: CellAppointmentsLimit | number) {
        this._setOption('maxAppointmentsPerCell', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
    }

    @Input()
    get resourceCellTemplate(): any {
        return this._getOption('resourceCellTemplate');
    }
    set resourceCellTemplate(value: any) {
        this._setOption('resourceCellTemplate', value);
    }

    @Input()
    get scrolling(): dxSchedulerScrolling {
        return this._getOption('scrolling');
    }
    set scrolling(value: dxSchedulerScrolling) {
        this._setOption('scrolling', value);
    }

    @Input()
    get startDate(): Date | number | string | undefined {
        return this._getOption('startDate');
    }
    set startDate(value: Date | number | string | undefined) {
        this._setOption('startDate', value);
    }

    @Input()
    get startDayHour(): number {
        return this._getOption('startDayHour');
    }
    set startDayHour(value: number) {
        this._setOption('startDayHour', value);
    }

    @Input()
    get timeCellTemplate(): any {
        return this._getOption('timeCellTemplate');
    }
    set timeCellTemplate(value: any) {
        this._setOption('timeCellTemplate', value);
    }

    @Input()
    get type(): ViewType | undefined {
        return this._getOption('type');
    }
    set type(value: ViewType | undefined) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'views';
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
    DxiViewComponent
  ],
  exports: [
    DxiViewComponent
  ],
})
export class DxiViewModule { }
