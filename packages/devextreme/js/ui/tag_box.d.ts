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
 * The type of the change event handler&apos;s argument.
 */
export type ChangeEvent = NativeEventInfo<dxTagBox, Event>;

/**
 * The type of the closed event handler&apos;s argument.
 */
export type ClosedEvent = EventInfo<dxTagBox>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxTagBox>;

/**
 * The type of the customItemCreating event handler&apos;s argument.
 */
export type CustomItemCreatingEvent = EventInfo<dxTagBox> & CustomItemCreatingInfo;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxTagBox>;

/**
 * The type of the enterKey event handler&apos;s argument.
 */
export type EnterKeyEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxTagBox>;

/**
 * The type of the input event handler&apos;s argument.
 */
export type InputEvent = NativeEventInfo<dxTagBox, UIEvent & { target: HTMLInputElement }>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = NativeEventInfo<dxTagBox> & ItemInfo;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

export type KeyPressEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/**
 * The type of the keyUp event handler&apos;s argument.
 */
export type KeyUpEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/**
 * The type of the multiTagPreparing event handler&apos;s argument.
 */
export type MultiTagPreparingEvent = Cancelable & EventInfo<dxTagBox> & {
    /**
     * 
     */
    readonly multiTagElement: DxElement;
    /**
     * 
     */
    readonly selectedItems?: Array<string | number | any>;
    /**
     * 
     */
    text?: string;
};

/**
 * The type of the opened event handler&apos;s argument.
 */
export type OpenedEvent = EventInfo<dxTagBox>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxTagBox> & ChangedOptionInfo;

/**
 * The type of the selectAllValueChanged event handler&apos;s argument.
 */
export type SelectAllValueChangedEvent = EventInfo<dxTagBox> & {
    /**
     * 
     */
    readonly value: boolean;
};

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxTagBox> & SelectionChangeInfo<string | number | any>;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxTagBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTagBoxOptions extends Pick<dxSelectBoxOptions<dxTagBox>, Exclude<keyof dxSelectBoxOptions<dxTagBox>, 'onSelectionChanged'>> {
    /**
     * Specifies how the UI component applies values.
     */
    applyValueMode?: ApplyValueMode;
    /**
     * A Boolean value specifying whether or not to hide selected items.
     */
    hideSelectedItems?: boolean;
    /**
     * Specifies the limit on displayed tags. On exceeding it, the UI component replaces all tags with a single multi-tag that displays the number of selected items.
     */
    maxDisplayedTags?: number | undefined;
    /**
     * A Boolean value specifying whether or not the UI component is multiline.
     */
    multiline?: boolean;
    /**
     * A function that is executed before the multi-tag is rendered.
     */
    onMultiTagPreparing?: ((e: MultiTagPreparingEvent) => void);
    /**
     * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if showSelectionControls is true.
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * A function that is executed when a list item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * Specifies the mode in which all items are selected.
     */
    selectAllMode?: SelectAllMode;
    /**
     * Gets the currently selected items.
     */
    selectedItems?: Array<string | number | any>;
    /**
     * Specifies the text displayed at the &apos;Select All&apos; check box.
     */
    selectAllText?: string;
    /**
     * Specifies whether the drop-down button is visible.
     */
    showDropDownButton?: boolean;
    /**
     * Specifies the maximum filter query length in characters.
     */
    maxFilterQueryLength?: number;
    /**
     * Specifies whether the multi-tag is shown without ordinary tags.
     */
    showMultiTagOnly?: boolean;
    /**
     * Specifies a custom template for tags.
     */
    tagTemplate?: template | ((itemData: any, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the selected items.
     */
    value?: Array<string | number | any>;
}
/**
 * The TagBox UI component is an editor that allows an end user to select multiple items from a drop-down list.
 */
export default class dxTagBox extends dxSelectBox<dxTagBoxOptions> { }

export type Properties = dxTagBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxTagBoxOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onCopy' | 'onCut' | 'onPaste'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMultiTagPreparing' | 'onSelectAllValueChanged' | 'onSelectionChanged'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component loses focus after the text field&apos;s content was changed using the keyboard.
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * A function that is executed once the drop-down editor is closed.
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed when a user adds a custom item. Requires acceptCustomValue to be set to true.
 */
onCustomItemCreating?: ((e: CustomItemCreatingEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function that is executed when the Enter key has been pressed while the UI component is focused.
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * A function that is executed when the UI component gets focus.
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * A function that is executed when the UI component loses focus.
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed each time the UI component&apos;s input is changed while the UI component is focused.
 */
onInput?: ((e: InputEvent) => void);
/**
 * A function that is executed when a list item is clicked or tapped.
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * A function that is executed when a user is pressing a key on the keyboard.
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * A function that is executed when a user releases a key on the keyboard.
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * A function that is executed once the drop-down editor is opened.
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed after the UI component&apos;s value is changed.
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
