import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../events/index';

import {
  DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import dxDateBox, { dxDateBoxOptions } from './date_box';

import {
  ValueChangedInfo,
} from './editor/editor';

/** @public */
export type DatePickerType = 'calendar' | 'list' | 'native' | 'rollers';

/** @public */
export type ChangeEvent = NativeEventInfo<dxDateRangeBox>;

/** @public */
export type ClosedEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxDateRangeBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxDateRangeBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDateRangeBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxDateRangeBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDateRangeBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent =
    NativeEventInfo<dxDateRangeBox, KeyboardEvent | MouseEvent | PointerEvent | Event>
    & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDateRangeBoxOptions extends Omit<dxDateBoxOptions<dxDateRangeBox>, 'value'> {
  /**
     * @docid
     * @default null
     * @public
     */
  endDate?: Date | number | string;
  /**
     * @docid
     * @default 'calendar'
     * @default 'native' &for(iOS)
     * @default 'native' &for(Android)
     * @public
     */
  pickerType?: DatePickerType;
  /**
     * @docid
     * @default false
     * @public
     */
  showAnalogClock?: boolean;
  /**
     * @docid
     * @default null
     * @public
     */
  startDate?: Date | number | string;
  /**
     * @docid
     * @default [null, null]
     * @public
     */
  value?: Array<Date | number | string>;
}

/**
 * @docid
 * @isEditor
 * @inherits dxDateBox
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDateRangeBox extends dxDateBox<dxDateRangeBoxOptions> { }

/** @public */
export type Properties = dxDateRangeBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxDateRangeBoxOptions;
