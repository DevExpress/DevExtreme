import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    ApplyValueMode,
    SelectAllMode,
} from '../common';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import {
    SelectionChangeInfo,
} from './collection/ui.collection_widget.base';

import {
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxSelectBox, {
    dxSelectBoxOptions,
    CustomItemCreatingInfo,
} from './select_box';

/**
 * @docid _ui_tag_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxTagBox, Event>;

/**
 * @docid _ui_tag_box_ClosedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ClosedEvent = EventInfo<dxTagBox>;

/**
 * @docid _ui_tag_box_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxTagBox>;

/**
 * @docid _ui_tag_box_CustomItemCreatingEvent
 * @public
 * @type object
 * @inherits EventInfo,CustomItemCreatingInfo
 */
export type CustomItemCreatingEvent = EventInfo<dxTagBox> & CustomItemCreatingInfo;

/**
 * @docid _ui_tag_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxTagBox>;

/**
 * @docid _ui_tag_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/**
 * @docid _ui_tag_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/**
 * @docid _ui_tag_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/**
 * @docid _ui_tag_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxTagBox>;

/**
 * @docid _ui_tag_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxTagBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_tag_box_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent = NativeEventInfo<dxTagBox> & ItemInfo;

/**
 * @docid _ui_tag_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/**
 * @docid _ui_tag_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/**
 * @docid _ui_tag_box_MultiTagPreparingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type MultiTagPreparingEvent = Cancelable & EventInfo<dxTagBox> & {
    /** @docid _ui_tag_box_MultiTagPreparingEvent.multiTagElement */
    readonly multiTagElement: DxElement;
    /**
     * @docid _ui_tag_box_MultiTagPreparingEvent.selectedItems
     * @type Array<string,number,Object>
     */
    readonly selectedItems?: Array<string | number | any>;
    /** @docid _ui_tag_box_MultiTagPreparingEvent.text */
    text?: string;
};

/**
 * @docid _ui_tag_box_OpenedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type OpenedEvent = EventInfo<dxTagBox>;

/**
 * @docid _ui_tag_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxTagBox> & ChangedOptionInfo;

/**
 * @docid _ui_tag_box_SelectAllValueChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectAllValueChangedEvent = EventInfo<dxTagBox> & {
    /** @docid _ui_tag_box_SelectAllValueChangedEvent.value */
    readonly value: boolean;
};

/**
 * @docid _ui_tag_box_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent = EventInfo<dxTagBox> & SelectionChangeInfo<string | number | any>;

/**
 * @docid _ui_tag_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxTagBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxTagBoxOptions extends Pick<dxSelectBoxOptions<dxTagBox>, Exclude<keyof dxSelectBoxOptions<dxTagBox>, 'onSelectionChanged'>> {
    /**
     * @docid
     * @default "instantly"
     * @public
     */
    applyValueMode?: ApplyValueMode;
    /**
     * @docid
     * @default false
     * @public
     */
    hideSelectedItems?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxDisplayedTags?: number | undefined;
    /**
     * @docid
     * @default true
     * @public
     */
    multiline?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tag_box:MultiTagPreparingEvent}
     * @action
     * @public
     */
    onMultiTagPreparing?: ((e: MultiTagPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tag_box:SelectAllValueChangedEvent}
     * @action
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tag_box:SelectionChangedEvent}
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default 'page'
     * @public
     */
    selectAllMode?: SelectAllMode;
    /**
     * @docid
     * @readonly
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid
     * @default "Select All"
     * @public
     */
    selectAllText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default 1500
     * @public
     */
    maxFilterQueryLength?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    showMultiTagOnly?: boolean;
    /**
     * @docid
     * @default "tag"
     * @type_function_param1 itemData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    tagTemplate?: template | ((itemData: any, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default []
     * @public
     */
    value?: Array<string | number | any>;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSelectBox
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTagBox extends dxSelectBox<dxTagBoxOptions> { }

/** @public */
export type Properties = dxTagBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxTagBoxOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onCopy' | 'onCut' | 'onPaste'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMultiTagPreparing' | 'onSelectAllValueChanged' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTagBoxOptions.onChange
 * @type_function_param1 e:{ui/tag_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxTagBoxOptions.onClosed
 * @type_function_param1 e:{ui/tag_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @docid dxTagBoxOptions.onContentReady
 * @type_function_param1 e:{ui/tag_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTagBoxOptions.onCustomItemCreating
 * @type_function_param1 e:{ui/tag_box:CustomItemCreatingEvent}
 */
onCustomItemCreating?: ((e: CustomItemCreatingEvent) => void);
/**
 * @docid dxTagBoxOptions.onDisposing
 * @type_function_param1 e:{ui/tag_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTagBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/tag_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxTagBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/tag_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxTagBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/tag_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxTagBoxOptions.onInitialized
 * @type_function_param1 e:{ui/tag_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTagBoxOptions.onInput
 * @type_function_param1 e:{ui/tag_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxTagBoxOptions.onItemClick
 * @type_function_param1 e:{ui/tag_box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxTagBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/tag_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxTagBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/tag_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxTagBoxOptions.onOpened
 * @type_function_param1 e:{ui/tag_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @docid dxTagBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/tag_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTagBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/tag_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
