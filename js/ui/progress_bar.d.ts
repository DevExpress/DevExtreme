import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions,
} from './track_bar';

/** @public */
export type CompleteEvent = NativeEventInfo<dxProgressBar>;

/** @public */
export type ContentReadyEvent = EventInfo<dxProgressBar>;

/** @public */
export type DisposingEvent = EventInfo<dxProgressBar>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxProgressBar>;

/** @public */
export type OptionChangedEvent = EventInfo<dxProgressBar> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxProgressBar> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:dxProgressBar
     * @action
     * @public
     */
    onComplete?: ((e: CompleteEvent) => void);
    /**
     * @docid
     * @default true
     * @public
     */
    showStatus?: boolean;
    /**
     * @docid
     * @default function(ratio, value) { return "Progress: " + Math.round(ratio * 100) + "%" }
     * @public
     */
    statusFormat?: string | ((ratio: number, value: number) => string);
    /**
     * @docid
     * @default 0
     * @public
     */
    value?: number | false;
}
/**
 * @docid
 * @inherits dxTrackBar
 * @namespace DevExpress.ui
 * @public
 */
export default class dxProgressBar extends dxTrackBar<dxProgressBarOptions> { }

/** @public */
export type Properties = dxProgressBarOptions;

/** @deprecated use Properties instead */
export type Options = dxProgressBarOptions;
