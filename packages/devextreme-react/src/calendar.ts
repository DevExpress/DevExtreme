"use client"
import dxCalendar, {
    Properties
} from "devextreme/ui/calendar";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/calendar";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICalendarOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type ICalendarOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ICalendarOptionsNarrowedEvents> & IHtmlOptions & {
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
  cellKeyFn?: (data: any) => string;
  defaultValue?: Array<Date | number | string> | Date | number | string;
  defaultZoomLevel?: "century" | "decade" | "month" | "year";
  onValueChange?: (value: Array<Date | number | string> | Date | number | string) => void;
  onZoomLevelChange?: (value: "century" | "decade" | "month" | "year") => void;
}>

class Calendar extends BaseComponent<React.PropsWithChildren<ICalendarOptions>> {

  public get instance(): dxCalendar {
    return this._instance;
  }

  protected _WidgetClass = dxCalendar;

  protected subscribableOptions = ["value","zoomLevel"];

  protected independentEvents = ["onDisposing","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value",
    defaultZoomLevel: "zoomLevel"
  };

  protected _templateProps = [{
    tmplOption: "cellTemplate",
    render: "cellRender",
    component: "cellComponent",
    keyFn: "cellKeyFn"
  }];
}
(Calendar as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  dateSerializationFormat: PropTypes.string,
  disabled: PropTypes.bool,
  disabledDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func
  ]),
  elementAttr: PropTypes.object,
  firstDayOfWeek: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      0,
      1,
      2,
      3,
      4,
      5,
      6])
  ]),
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  isDirty: PropTypes.bool,
  isValid: PropTypes.bool,
  max: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.string
  ]),
  maxZoomLevel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "century",
      "decade",
      "month",
      "year"])
  ]),
  min: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.string
  ]),
  minZoomLevel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "century",
      "decade",
      "month",
      "year"])
  ]),
  name: PropTypes.string,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple",
      "range"])
  ]),
  selectWeekOnClick: PropTypes.bool,
  showTodayButton: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  tabIndex: PropTypes.number,
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "auto"])
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.string
  ]),
  visible: PropTypes.bool,
  weekNumberRule: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto",
      "firstDay",
      "fullWeek",
      "firstFourDays"])
  ]),
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  zoomLevel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "century",
      "decade",
      "month",
      "year"])
  ])
};
export default Calendar;
export {
  Calendar,
  ICalendarOptions
};
import type * as CalendarTypes from 'devextreme/ui/calendar_types';
export { CalendarTypes };

