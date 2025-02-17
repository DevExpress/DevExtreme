import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
    ApplyValueMode,
    Mode,
    Position,
    TextEditorButton,
} from '../../common';

import dxTextBox, {
    dxTextBoxOptions,
} from '../text_box';

import {
    Properties as PopoverProperties,
} from '../popover';

import {
    Properties as PopupProperties,
} from '../popup';

import {
    EventInfo,
} from '../../common/core/events';

export type DropDownPredefinedButton = 'clear' | 'dropDown';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface DropDownButtonTemplateDataModel {
    readonly text?: string;
    readonly icon?: string;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDropDownEditorOptions<TComponent> extends Omit<dxTextBoxOptions<TComponent>, 'validationMessagePosition'> {
    /**
     * Specifies whether or not the UI component allows an end user to enter a custom value.
     */
    acceptCustomValue?: boolean;
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies the way an end user applies the selected value.
     */
    applyValueMode?: ApplyValueMode;
    /**
     * Configures the drop-down field which holds the content.
     */
    dropDownOptions?: PopupProperties | PopoverProperties;
    /**
     * Allows you to add custom buttons to the input text field.
     */
    buttons?: Array<DropDownPredefinedButton | TextEditorButton>;
    /**
     * Specifies whether to render the drop-down field&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
    /**
     * Specifies a custom template for the drop-down button.
     */
    dropDownButtonTemplate?: template | ((buttonData: DropDownButtonTemplateDataModel, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * A function that is executed once the drop-down editor is closed.
     */
    onClosed?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed once the drop-down editor is opened.
     */
    onOpened?: ((e: EventInfo<TComponent>) => void);
    /**
     * Specifies whether a user can open the drop-down list by clicking a text field.
     */
    openOnFieldClick?: boolean;
    /**
     * Specifies whether or not the drop-down editor is displayed.
     */
    opened?: boolean;
    /**
     * Specifies whether the drop-down button is visible.
     */
    showDropDownButton?: boolean;
    /**
     * Specifies the position of a validation message relative to the component. The validation message describes the validation rules that this component&apos;s value does not satisfy.
     */
    validationMessagePosition?: Position | Mode;
    /**
     * Specifies the currently selected value.
     */
    value?: any;
}
/**
 * A drop-down editor UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxDropDownEditor<TProperties> extends dxTextBox<TProperties> {
    /**
     * Closes the drop-down editor.
     */
    close(): void;
    /**
     * Gets the popup window&apos;s content.
     */
    content(): DxElement;
    /**
     * Gets the UI component&apos;s `` element.
     */
    field(): DxElement;
    /**
     * Opens the drop-down editor.
     */
    open(): void;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface DropDownEditorInstance extends dxDropDownEditor<Properties> { }
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Properties = dxDropDownEditorOptions<DropDownEditorInstance>;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;
