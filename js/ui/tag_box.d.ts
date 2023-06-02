import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    SelectionChangedInfo,
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

import {
    ApplyValueMode,
    SelectAllMode,
} from '../common';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTagBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxTagBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTagBox>;

/** @public */
export type CustomItemCreatingEvent = EventInfo<dxTagBox> & CustomItemCreatingInfo;

/** @public */
export type DisposingEvent = EventInfo<dxTagBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTagBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxTagBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTagBox> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type MultiTagPreparingEvent = Cancelable & EventInfo<dxTagBox> & {
    readonly multiTagElement: DxElement;
    readonly selectedItems?: Array<string | number | any>;
    text?: string;
};

/** @public */
export type OpenedEvent = EventInfo<dxTagBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTagBox> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent = EventInfo<dxTagBox> & {
    readonly value: boolean;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxTagBox> & SelectionChangedInfo<string | number | any>;

/** @public */
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
    maxDisplayedTags?: number;
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
 * @skip
 * @docid dxTagBoxOptions.onChange
 * @type_function_param1 e:{ui/tag_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onClosed
 * @type_function_param1 e:{ui/tag_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onContentReady
 * @type_function_param1 e:{ui/tag_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onCustomItemCreating
 * @type_function_param1 e:{ui/tag_box:CustomItemCreatingEvent}
 */
onCustomItemCreating?: ((e: CustomItemCreatingEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onDisposing
 * @type_function_param1 e:{ui/tag_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/tag_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/tag_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/tag_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onInitialized
 * @type_function_param1 e:{ui/tag_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onInput
 * @type_function_param1 e:{ui/tag_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onItemClick
 * @type_function_param1 e:{ui/tag_box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/tag_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/tag_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onOpened
 * @type_function_param1 e:{ui/tag_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/tag_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTagBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/tag_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
