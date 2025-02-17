import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import {
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo,
} from './drop_down_editor/ui.drop_down_list';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Properties as PopupProperties,
} from './popup';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface CustomItemCreatingInfo {
    /**
     * 
     */
    readonly text?: string;
    /**
     * 
     */
    customItem?: string | any | PromiseLike<any>;
}

/**
 * The type of the change event handler&apos;s argument.
 */
export type ChangeEvent = NativeEventInfo<dxSelectBox, Event>;

/**
 * The type of the closed event handler&apos;s argument.
 */
export type ClosedEvent = EventInfo<dxSelectBox>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxSelectBox>;

/**
 * The type of the copy event handler&apos;s argument.
 */
export type CopyEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/**
 * The type of the customItemCreating event handler&apos;s argument.
 */
export type CustomItemCreatingEvent = EventInfo<dxSelectBox> & CustomItemCreatingInfo;

/**
 * The type of the cut event handler&apos;s argument.
 */
export type CutEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSelectBox>;

/**
 * The type of the enterKey event handler&apos;s argument.
 */
export type EnterKeyEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxSelectBox, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxSelectBox, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSelectBox>;

/**
 * The type of the input event handler&apos;s argument.
 */
export type InputEvent = NativeEventInfo<dxSelectBox, UIEvent & { target: HTMLInputElement }>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = NativeEventInfo<dxSelectBox, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

export type KeyPressEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/**
 * The type of the keyUp event handler&apos;s argument.
 */
export type KeyUpEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/**
 * The type of the opened event handler&apos;s argument.
 */
export type OpenedEvent = EventInfo<dxSelectBox>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSelectBox> & ChangedOptionInfo;

/**
 * The type of the paste event handler&apos;s argument.
 */
export type PasteEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxSelectBox> & SelectionChangedInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxSelectBox, KeyboardEvent | MouseEvent | Event> & ValueChangedInfo;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSelectBoxOptions<TComponent> extends dxDropDownListOptions<TComponent> {
    /**
     * Specifies whether the UI component allows a user to enter a custom value. Requires the onCustomItemCreating handler implementation.
     */
    acceptCustomValue?: boolean;
    /**
     * Specifies a custom template for the text field. Must contain the TextBox UI component.
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * A function that is executed when a user adds a custom item. Requires acceptCustomValue to be set to true.
     */
    onCustomItemCreating?: ((e: EventInfo<TComponent> & CustomItemCreatingInfo) => void);
    /**
     * Specifies whether a user can open the drop-down list by clicking a text field.
     */
    openOnFieldClick?: boolean;
    /**
     * The text that is provided as a hint in the select box editor.
     */
    placeholder?: string;
    /**
     * Specifies whether the drop-down button is visible.
     */
    showDropDownButton?: boolean;
    /**
     * Specifies whether or not to display selection controls.
     */
    showSelectionControls?: boolean;
    /**
     * Specifies the DOM events after which the UI component&apos;s value should be updated. Applies only if acceptCustomValue is set to true.
     * @deprecated Use the customItemCreateEvent option instead.
     */
    valueChangeEvent?: string;

    /**
     * Specifies the DOM event after which the custom item should be created. Applies only if acceptCustomValue is enabled.
     */
    customItemCreateEvent?: string;

    /**
     * Configures the drop-down field which holds the content.
     */
    dropDownOptions?: PopupProperties;
}
/**
 * The SelectBox UI component is an editor that allows an end user to select an item from a drop-down list.
 */
export default class dxSelectBox<TProperties = Properties> extends dxDropDownList<TProperties> { }

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface SelectBoxInstance extends dxSelectBox<Properties> { }

export type Properties = dxSelectBoxOptions<SelectBoxInstance>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onCustomItemCreating'>;

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
 * A function that is executed when the UI component&apos;s input has been copied.
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * A function that is executed when the UI component&apos;s input has been cut.
 */
onCut?: ((e: CutEvent) => void);
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
 * A function that is executed when the UI component&apos;s input has been pasted.
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * A function that is executed when a list item is selected or selection is canceled.
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * A function that is executed after the UI component&apos;s value is changed.
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
