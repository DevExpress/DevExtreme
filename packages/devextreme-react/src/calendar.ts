"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCalendar, {
    Properties
} from "devextreme/ui/calendar";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { CalendarZoomLevel, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/calendar";

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
  defaultValue?: Array<Date | number | string> | Date | number | string;
  defaultZoomLevel?: CalendarZoomLevel;
  onValueChange?: (value: Array<Date | number | string> | Date | number | string) => void;
  onZoomLevelChange?: (value: CalendarZoomLevel) => void;
}>

interface CalendarRef {
  instance: () => dxCalendar;
}

const Calendar = memo(
  forwardRef(
    (props: React.PropsWithChildren<ICalendarOptions>, ref: ForwardedRef<CalendarRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value","zoomLevel"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
        defaultZoomLevel: "zoomLevel",
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "cellTemplate",
          render: "cellRender",
          component: "cellComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICalendarOptions>>, {
          WidgetClass: dxCalendar,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ICalendarOptions> & { ref?: Ref<CalendarRef> }) => ReactElement | null;
export default Calendar;
export {
  Calendar,
  ICalendarOptions,
  CalendarRef
};
import type * as CalendarTypes from 'devextreme/ui/calendar_types';
export { CalendarTypes };

