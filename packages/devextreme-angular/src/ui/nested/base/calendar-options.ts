/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { FirstDayOfWeek, Position, ValidationMessageMode, ValidationStatus } from 'devextreme/common';
import { CalendarSelectionMode, CalendarZoomLevel, DisposingEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent, WeekNumberRule } from 'devextreme/ui/calendar';

@Component({
    template: ''
})
export abstract class DxoCalendarOptions extends NestedOption {
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    get cellTemplate(): any {
        return this._getOption('cellTemplate');
    }
    set cellTemplate(value: any) {
        this._setOption('cellTemplate', value);
    }

    get dateSerializationFormat(): string | undefined {
        return this._getOption('dateSerializationFormat');
    }
    set dateSerializationFormat(value: string | undefined) {
        this._setOption('dateSerializationFormat', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get disabledDates(): Function | Array<Date> {
        return this._getOption('disabledDates');
    }
    set disabledDates(value: Function | Array<Date>) {
        this._setOption('disabledDates', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get firstDayOfWeek(): FirstDayOfWeek | undefined {
        return this._getOption('firstDayOfWeek');
    }
    set firstDayOfWeek(value: FirstDayOfWeek | undefined) {
        this._setOption('firstDayOfWeek', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }

    get max(): Date | number | string {
        return this._getOption('max');
    }
    set max(value: Date | number | string) {
        this._setOption('max', value);
    }

    get maxZoomLevel(): CalendarZoomLevel {
        return this._getOption('maxZoomLevel');
    }
    set maxZoomLevel(value: CalendarZoomLevel) {
        this._setOption('maxZoomLevel', value);
    }

    get min(): Date | number | string {
        return this._getOption('min');
    }
    set min(value: Date | number | string) {
        this._setOption('min', value);
    }

    get minZoomLevel(): CalendarZoomLevel {
        return this._getOption('minZoomLevel');
    }
    set minZoomLevel(value: CalendarZoomLevel) {
        this._setOption('minZoomLevel', value);
    }

    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get selectionMode(): CalendarSelectionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: CalendarSelectionMode) {
        this._setOption('selectionMode', value);
    }

    get selectWeekOnClick(): boolean {
        return this._getOption('selectWeekOnClick');
    }
    set selectWeekOnClick(value: boolean) {
        this._setOption('selectWeekOnClick', value);
    }

    get showTodayButton(): boolean {
        return this._getOption('showTodayButton');
    }
    set showTodayButton(value: boolean) {
        this._setOption('showTodayButton', value);
    }

    get showWeekNumbers(): boolean {
        return this._getOption('showWeekNumbers');
    }
    set showWeekNumbers(value: boolean) {
        this._setOption('showWeekNumbers', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }

    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }

    get validationMessageMode(): ValidationMessageMode {
        return this._getOption('validationMessageMode');
    }
    set validationMessageMode(value: ValidationMessageMode) {
        this._setOption('validationMessageMode', value);
    }

    get validationMessagePosition(): Position {
        return this._getOption('validationMessagePosition');
    }
    set validationMessagePosition(value: Position) {
        this._setOption('validationMessagePosition', value);
    }

    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }

    get value(): Date | number | string | Array<Date | number | string> {
        return this._getOption('value');
    }
    set value(value: Date | number | string | Array<Date | number | string>) {
        this._setOption('value', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get weekNumberRule(): WeekNumberRule {
        return this._getOption('weekNumberRule');
    }
    set weekNumberRule(value: WeekNumberRule) {
        this._setOption('weekNumberRule', value);
    }

    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }

    get zoomLevel(): CalendarZoomLevel {
        return this._getOption('zoomLevel');
    }
    set zoomLevel(value: CalendarZoomLevel) {
        this._setOption('zoomLevel', value);
    }
}
