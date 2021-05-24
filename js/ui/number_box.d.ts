import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxTextEditor, {
    dxTextEditorButton,
    dxTextEditorOptions
} from './text_box/ui.text_editor.base';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    format
} from './widget/ui.widget';

/** @public */
export type ChangeEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxNumberBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type CutEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type DisposingEvent = EventInfo<dxNumberBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxNumberBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxNumberBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxNumberBox>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxNumberBox> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
    /**
     * @docid
     * @type Array<Enums.NumberBoxButtonName,dxTextEditorButton>
     * @default undefined
     * @public
     */
    buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
    /**
     * @docid
     * @default ""
     * @public
     */
    format?: format;
    /**
     * @docid
     * @default "Value must be a number"
     * @public
     */
    invalidValueMessage?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    min?: number;
    /**
     * @docid
     * @type Enums.NumberBoxMode
     * @default "text"
     * @default 'number' [for](mobile_devices)
     * @public
     */
    mode?: 'number' | 'text' | 'tel';
    /**
     * @docid
     * @default false
     * @public
     */
    showSpinButtons?: boolean;
    /**
     * @docid
     * @default 1
     * @public
     */
    step?: number;
    /**
     * @docid
     * @default true
     * @default false [for](desktop)
     * @public
     */
    useLargeSpinButtons?: boolean;
    /**
     * @docid
     * @default 0
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextEditor
 * @module ui/number_box
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxNumberBox extends dxTextEditor<dxNumberBoxOptions> { }

/** @public */
export type Properties = dxNumberBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxNumberBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxNumberBoxOptions;
