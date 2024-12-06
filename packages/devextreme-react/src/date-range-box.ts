"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDateRangeBox, {
    Properties
} from "devextreme/ui/date_range_box";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ChangeEvent, ClosedEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, OpenedEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/date_range_box";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, OptionChangedEvent as ButtonOptionChangedEvent, ClickEvent } from "devextreme/ui/button";
import type { DisposingEvent as CalendarDisposingEvent, InitializedEvent as CalendarInitializedEvent, ValueChangedEvent as CalendarValueChangedEvent, DisabledDate, CalendarZoomLevel, OptionChangedEvent, CalendarSelectionMode, WeekNumberRule } from "devextreme/ui/calendar";
import type { AnimationConfig, CollisionResolution, PositionConfig, AnimationState, AnimationType, CollisionResolutionCombination } from "devextreme/common/core/animation";
import type { HorizontalAlignment, VerticalAlignment, TextEditorButtonLocation, template, FirstDayOfWeek, ValidationMessageMode, Position as CommonPosition, ValidationStatus, Format, PositionAlignment, Direction, ButtonStyle, ButtonType, ToolbarItemLocation, ToolbarItemComponent } from "devextreme/common";
import type { event } from "devextreme/events/events.types";
import type { EventInfo } from "devextreme/common/core/events";
import type { Component } from "devextreme/core/component";
import type { dxPopupToolbarItem, ToolbarLocation } from "devextreme/ui/popup";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxOverlay from "devextreme/ui/overlay";
import type DOMComponent from "devextreme/core/dom_component";
import type dxPopup from "devextreme/ui/popup";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDateRangeBoxOptionsNarrowedEvents = {
  onChange?: ((e: ChangeEvent) => void);
  onClosed?: ((e: ClosedEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onCopy?: ((e: CopyEvent) => void);
  onCut?: ((e: CutEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onEnterKey?: ((e: EnterKeyEvent) => void);
  onFocusIn?: ((e: FocusInEvent) => void);
  onFocusOut?: ((e: FocusOutEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onInput?: ((e: InputEvent) => void);
  onKeyDown?: ((e: KeyDownEvent) => void);
  onKeyUp?: ((e: KeyUpEvent) => void);
  onOpened?: ((e: OpenedEvent) => void);
  onPaste?: ((e: PasteEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IDateRangeBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IDateRangeBoxOptionsNarrowedEvents> & IHtmlOptions & {
  dropDownButtonRender?: (...params: any) => React.ReactNode;
  dropDownButtonComponent?: React.ComponentType<any>;
  defaultEndDate?: Date | number | string;
  defaultOpened?: boolean;
  defaultStartDate?: Date | number | string;
  defaultValue?: Array<Date | number | string>;
  onEndDateChange?: (value: Date | number | string) => void;
  onOpenedChange?: (value: boolean) => void;
  onStartDateChange?: (value: Date | number | string) => void;
  onValueChange?: (value: Array<Date | number | string>) => void;
}>

interface DateRangeBoxRef {
  instance: () => dxDateRangeBox;
}

const DateRangeBox = memo(
  forwardRef(
    (props: React.PropsWithChildren<IDateRangeBoxOptions>, ref: ForwardedRef<DateRangeBoxRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["endDate","opened","startDate","value"]), []);
      const independentEvents = useMemo(() => (["onChange","onClosed","onContentReady","onCopy","onCut","onDisposing","onEnterKey","onFocusIn","onFocusOut","onInitialized","onInput","onKeyDown","onKeyUp","onOpened","onPaste","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultEndDate: "endDate",
        defaultOpened: "opened",
        defaultStartDate: "startDate",
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        button: { optionName: "buttons", isCollectionItem: true },
        calendarOptions: { optionName: "calendarOptions", isCollectionItem: false },
        displayFormat: { optionName: "displayFormat", isCollectionItem: false },
        dropDownOptions: { optionName: "dropDownOptions", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "dropDownButtonTemplate",
          render: "dropDownButtonRender",
          component: "dropDownButtonComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IDateRangeBoxOptions>>, {
          WidgetClass: dxDateRangeBox,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IDateRangeBoxOptions> & { ref?: Ref<DateRangeBoxRef> }) => ReactElement | null;


// owners:
// DropDownOptions
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
const _componentAnimation = (props: IAnimationProps) => {
  return React.createElement(NestedOption<IAnimationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "animation",
      ExpectedChildren: {
        hide: { optionName: "hide", isCollectionItem: false },
        show: { optionName: "show", isCollectionItem: false }
      },
    },
  });
};

const Animation = Object.assign<typeof _componentAnimation, NestedComponentMeta>(_componentAnimation, {
  componentType: "option",
});

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentAt = (props: IAtProps) => {
  return React.createElement(NestedOption<IAtProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "at",
    },
  });
};

const At = Object.assign<typeof _componentAt, NestedComponentMeta>(_componentAt, {
  componentType: "option",
});

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentBoundaryOffset = (props: IBoundaryOffsetProps) => {
  return React.createElement(NestedOption<IBoundaryOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "boundaryOffset",
    },
  });
};

const BoundaryOffset = Object.assign<typeof _componentBoundaryOffset, NestedComponentMeta>(_componentBoundaryOffset, {
  componentType: "option",
});

// owners:
// DateRangeBox
type IButtonProps = React.PropsWithChildren<{
  location?: TextEditorButtonLocation;
  name?: string | undefined;
  options?: dxButtonOptions | undefined;
}>
const _componentButton = (props: IButtonProps) => {
  return React.createElement(NestedOption<IButtonProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttons",
      IsCollectionItem: true,
      ExpectedChildren: {
        options: { optionName: "options", isCollectionItem: false }
      },
    },
  });
};

const Button = Object.assign<typeof _componentButton, NestedComponentMeta>(_componentButton, {
  componentType: "option",
});

// owners:
// DateRangeBox
type ICalendarOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  cellTemplate?: ((itemData: { date: Date, text: string, view: string }, itemIndex: number, itemElement: any) => string | any) | template;
  dateSerializationFormat?: string | undefined;
  disabled?: boolean;
  disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
  elementAttr?: Record<string, any>;
  firstDayOfWeek?: FirstDayOfWeek | undefined;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  isDirty?: boolean;
  isValid?: boolean;
  max?: Date | number | string;
  maxZoomLevel?: CalendarZoomLevel;
  min?: Date | number | string;
  minZoomLevel?: CalendarZoomLevel;
  name?: string;
  onDisposing?: ((e: CalendarDisposingEvent) => void);
  onInitialized?: ((e: CalendarInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onValueChanged?: ((e: CalendarValueChangedEvent) => void);
  readOnly?: boolean;
  rtlEnabled?: boolean;
  selectionMode?: CalendarSelectionMode;
  selectWeekOnClick?: boolean;
  showTodayButton?: boolean;
  showWeekNumbers?: boolean;
  tabIndex?: number;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: ValidationMessageMode;
  validationMessagePosition?: CommonPosition;
  validationStatus?: ValidationStatus;
  value?: Array<Date | number | string> | Date | number | string;
  visible?: boolean;
  weekNumberRule?: WeekNumberRule;
  width?: (() => number | string) | number | string | undefined;
  zoomLevel?: CalendarZoomLevel;
  defaultValue?: Array<Date | number | string> | Date | number | string;
  onValueChange?: (value: Array<Date | number | string> | Date | number | string) => void;
  defaultZoomLevel?: CalendarZoomLevel;
  onZoomLevelChange?: (value: CalendarZoomLevel) => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
}>
const _componentCalendarOptions = (props: ICalendarOptionsProps) => {
  return React.createElement(NestedOption<ICalendarOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "calendarOptions",
      DefaultsProps: {
        defaultValue: "value",
        defaultZoomLevel: "zoomLevel"
      },
      TemplateProps: [{
        tmplOption: "cellTemplate",
        render: "cellRender",
        component: "cellComponent"
      }],
    },
  });
};

const CalendarOptions = Object.assign<typeof _componentCalendarOptions, NestedComponentMeta>(_componentCalendarOptions, {
  componentType: "option",
});

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: CollisionResolution;
  y?: CollisionResolution;
}>
const _componentCollision = (props: ICollisionProps) => {
  return React.createElement(NestedOption<ICollisionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "collision",
    },
  });
};

const Collision = Object.assign<typeof _componentCollision, NestedComponentMeta>(_componentCollision, {
  componentType: "option",
});

// owners:
// DateRangeBox
type IDisplayFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentDisplayFormat = (props: IDisplayFormatProps) => {
  return React.createElement(NestedOption<IDisplayFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "displayFormat",
    },
  });
};

const DisplayFormat = Object.assign<typeof _componentDisplayFormat, NestedComponentMeta>(_componentDisplayFormat, {
  componentType: "option",
});

// owners:
// DateRangeBox
type IDropDownOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string | undefined;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string | undefined;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number | string) | number | string;
  maxWidth?: (() => number | string) | number | string;
  minHeight?: (() => number | string) | number | string;
  minWidth?: (() => number | string) | number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionAlignment | PositionConfig;
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentDropDownOptions = (props: IDropDownOptionsProps) => {
  return React.createElement(NestedOption<IDropDownOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dropDownOptions",
      DefaultsProps: {
        defaultHeight: "height",
        defaultPosition: "position",
        defaultVisible: "visible",
        defaultWidth: "width"
      },
      ExpectedChildren: {
        animation: { optionName: "animation", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false },
        toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "contentTemplate",
        render: "contentRender",
        component: "contentComponent"
      }, {
        tmplOption: "titleTemplate",
        render: "titleRender",
        component: "titleComponent"
      }],
    },
  });
};

const DropDownOptions = Object.assign<typeof _componentDropDownOptions, NestedComponentMeta>(_componentDropDownOptions, {
  componentType: "option",
});

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentFrom = (props: IFromProps) => {
  return React.createElement(NestedOption<IFromProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "from",
      ExpectedChildren: {
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const From = Object.assign<typeof _componentFrom, NestedComponentMeta>(_componentFrom, {
  componentType: "option",
});

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentHide = (props: IHideProps) => {
  return React.createElement(NestedOption<IHideProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hide",
      ExpectedChildren: {
        from: { optionName: "from", isCollectionItem: false },
        to: { optionName: "to", isCollectionItem: false }
      },
    },
  });
};

const Hide = Object.assign<typeof _componentHide, NestedComponentMeta>(_componentHide, {
  componentType: "option",
});

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentMy = (props: IMyProps) => {
  return React.createElement(NestedOption<IMyProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "my",
    },
  });
};

const My = Object.assign<typeof _componentMy, NestedComponentMeta>(_componentMy, {
  componentType: "option",
});

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentOffset = (props: IOffsetProps) => {
  return React.createElement(NestedOption<IOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "offset",
    },
  });
};

const Offset = Object.assign<typeof _componentOffset, NestedComponentMeta>(_componentOffset, {
  componentType: "option",
});

// owners:
// Button
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: ButtonOptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType | string;
  useSubmitBehavior?: boolean;
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: (() => number | string) | number | string | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentOptions = (props: IOptionsProps) => {
  return React.createElement(NestedOption<IOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "options",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Options = Object.assign<typeof _componentOptions, NestedComponentMeta>(_componentOptions, {
  componentType: "option",
});

// owners:
// From
// DropDownOptions
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: CollisionResolutionCombination | Record<string, any> | {
    x?: CollisionResolution;
    y?: CollisionResolution;
  };
  my?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
const _componentPosition = (props: IPositionProps) => {
  return React.createElement(NestedOption<IPositionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "position",
    },
  });
};

const Position = Object.assign<typeof _componentPosition, NestedComponentMeta>(_componentPosition, {
  componentType: "option",
});

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentShow = (props: IShowProps) => {
  return React.createElement(NestedOption<IShowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "show",
    },
  });
};

const Show = Object.assign<typeof _componentShow, NestedComponentMeta>(_componentShow, {
  componentType: "option",
});

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentTo = (props: IToProps) => {
  return React.createElement(NestedOption<IToProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "to",
    },
  });
};

const To = Object.assign<typeof _componentTo, NestedComponentMeta>(_componentTo, {
  componentType: "option",
});

// owners:
// DropDownOptions
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  toolbar?: ToolbarLocation;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbarItems",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

export default DateRangeBox;
export {
  DateRangeBox,
  IDateRangeBoxOptions,
  DateRangeBoxRef,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Button,
  IButtonProps,
  CalendarOptions,
  ICalendarOptionsProps,
  Collision,
  ICollisionProps,
  DisplayFormat,
  IDisplayFormatProps,
  DropDownOptions,
  IDropDownOptionsProps,
  From,
  IFromProps,
  Hide,
  IHideProps,
  My,
  IMyProps,
  Offset,
  IOffsetProps,
  Options,
  IOptionsProps,
  Position,
  IPositionProps,
  Show,
  IShowProps,
  To,
  IToProps,
  ToolbarItem,
  IToolbarItemProps
};
import type * as DateRangeBoxTypes from 'devextreme/ui/date_range_box_types';
export { DateRangeBoxTypes };

