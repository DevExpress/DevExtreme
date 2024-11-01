import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    DataExpressionMixinOptions,
} from './editor/ui.data_expression';

import {
    Properties as PopupProperties,
} from './popup';

/**
 * @docid _ui_drop_down_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxDropDownBox, Event>;

/**
 * @docid _ui_drop_down_box_ClosedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ClosedEvent = EventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/**
 * @docid _ui_drop_down_box_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/**
 * @docid _ui_drop_down_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/**
 * @docid _ui_drop_down_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxDropDownBox, FocusEvent>;

/**
 * @docid _ui_drop_down_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxDropDownBox, FocusEvent>;

/**
 * @docid _ui_drop_down_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxDropDownBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_drop_down_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/**
 * @docid _ui_drop_down_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/**
 * @docid _ui_drop_down_box_OpenedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type OpenedEvent = EventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxDropDownBox> & ChangedOptionInfo;

/**
 * @docid _ui_drop_down_box_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/**
 * @docid _ui_drop_down_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type ContentTemplateData = {
    component: dxDropDownBox;
    readonly value?: any;
};

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * @docid
     * @default false
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((templateData: ContentTemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * @docid
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 value:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    items?: Array<any>;
    /**
     * @docid
     * @default true
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "change"
     * @public
     */
    valueChangeEvent?: string;

    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDropDownBox extends dxDropDownEditor<dxDropDownBoxOptions> {
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxDropDownBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxDropDownBoxOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxDropDownBoxOptions.onChange
 * @type_function_param1 e:{ui/drop_down_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onClosed
 * @type_function_param1 e:{ui/drop_down_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onCopy
 * @type_function_param1 e:{ui/drop_down_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onCut
 * @type_function_param1 e:{ui/drop_down_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onDisposing
 * @type_function_param1 e:{ui/drop_down_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/drop_down_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/drop_down_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/drop_down_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onInitialized
 * @type_function_param1 e:{ui/drop_down_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onInput
 * @type_function_param1 e:{ui/drop_down_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/drop_down_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/drop_down_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onOpened
 * @type_function_param1 e:{ui/drop_down_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/drop_down_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onPaste
 * @type_function_param1 e:{ui/drop_down_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @docid dxDropDownBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/drop_down_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
