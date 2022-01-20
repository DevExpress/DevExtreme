import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { name as clickEventName } from '../../../events/click';
import { getPublicElement } from '../../../core/element';
import { captionize } from '../../../core/utils/inflector';
import { format } from '../../../core/utils/string';
import { isMaterial } from '../../themes';
import errors from '../../widget/ui.errors';

import Validator from '../../validator';

import {
    FIELD_ITEM_CONTENT_CLASS,
} from '../constants';

export const FLEX_LAYOUT_CLASS = 'dx-flex-layout';
export const FIELD_ITEM_OPTIONAL_CLASS = 'dx-field-item-optional';
export const FIELD_ITEM_REQUIRED_CLASS = 'dx-field-item-required';
export const FIELD_ITEM_CONTENT_WRAPPER_CLASS = 'dx-field-item-content-wrapper';
export const FIELD_ITEM_CONTENT_LOCATION_CLASS = 'dx-field-item-content-location-';
export const FIELD_ITEM_LABEL_ALIGN_CLASS = 'dx-field-item-label-align';
export const FIELD_ITEM_HELP_TEXT_CLASS = 'dx-field-item-help-text';
export const LABEL_VERTICAL_ALIGNMENT_CLASS = 'dx-label-v-align';
export const LABEL_HORIZONTAL_ALIGNMENT_CLASS = 'dx-label-h-align';

import { renderLabel } from './label';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const INVALID_CLASS = 'dx-invalid';

export function renderFieldItem({
    $parent,
    rootElementCssClassList,
    formOrLayoutManager,
    createComponentCallback,
    useFlexLayout,

    labelOptions, // TODO: move to 'item' ?
    labelNeedBaselineAlign, labelLocation, needRenderLabel, // TODO: move to 'labelOptions' ?
    formLabelLocation, // TODO: use 'labelOptions.location' insted ?

    item, // TODO: pass simple values instead of complex object
    editorOptions, isSimpleItem, isRequired, template, helpID, labelID, name, helpText, // TODO: move to 'item' ?

    requiredMessageTemplate,
    validationGroup
}) {

    const $rootElement = $('<div>')
        .addClass(rootElementCssClassList.join(' '))
        .appendTo($parent);

    $rootElement.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);
    if(isSimpleItem && useFlexLayout) {
        $rootElement.addClass(FLEX_LAYOUT_CLASS);
    }
    if(isSimpleItem && labelNeedBaselineAlign) {
        // TODO: label related code, execute ony if needRenderLabel ?
        $rootElement.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
    }

    //
    // Setup field editor container:
    //

    const $fieldEditorContainer = $('<div>');
    $fieldEditorContainer.data('dx-form-item', item);
    const locationClassSuffix = { right: 'left', left: 'right', top: 'bottom' };
    $fieldEditorContainer.
        addClass(FIELD_ITEM_CONTENT_CLASS).
        addClass(FIELD_ITEM_CONTENT_LOCATION_CLASS + locationClassSuffix[formLabelLocation]);

    //
    // Setup $label:
    //

    const $label = needRenderLabel ? renderLabel(labelOptions) : null;
    if($label) {
        $rootElement.append($label);
        if(labelLocation === 'top' || labelLocation === 'left') {
            $rootElement.append($fieldEditorContainer);
        }
        if(labelLocation === 'right') {
            $rootElement.prepend($fieldEditorContainer);
        }

        if(labelLocation === 'top') {
            $rootElement.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
        } else {
            $rootElement.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
        }

        if(item.editorType === 'dxCheckBox' || item.editorType === 'dxSwitch') {
            eventsEngine.on($label, clickEventName, function() {
                eventsEngine.trigger($fieldEditorContainer.children(), clickEventName);
            });
        }
    } else {
        $rootElement.append($fieldEditorContainer);
    }

    //
    // Append field editor:
    //

    let widgetInstance;
    if(template) {
        template.render({
            container: getPublicElement($fieldEditorContainer),
            model: {
                dataField: item.dataField,
                editorType: item.editorType,
                editorOptions,
                component: formOrLayoutManager,
                name: item.name
            },
        });
    } else {
        const $div = $('<div>').appendTo($fieldEditorContainer);

        try {
            widgetInstance = createComponentCallback($div, item.editorType, editorOptions);
            widgetInstance.setAria('describedby', helpID);
            if(labelID) widgetInstance.setAria('labelledby', labelID);
            widgetInstance.setAria('required', isRequired);
        } catch(e) {
            errors.log('E1035', e.message);
        }
    }

    //
    // Setup $validation:
    //

    const editorElem = $fieldEditorContainer.children().first();
    const $validationTarget = editorElem.hasClass(TEMPLATE_WRAPPER_CLASS) ? editorElem.children().first() : editorElem;
    const validationTargetInstance = $validationTarget && $validationTarget.data('dx-validation-target');

    if(validationTargetInstance) {
        const isItemHaveCustomLabel = item.label && item.label.text;
        const itemName = isItemHaveCustomLabel ? null : name;
        const fieldName = isItemHaveCustomLabel ? item.label.text : itemName && captionize(itemName);
        let validationRules;

        if(isSimpleItem) {
            if(item.validationRules) {
                validationRules = item.validationRules;
            } else {
                const requiredMessage = format(requiredMessageTemplate, fieldName || '');
                validationRules = item.isRequired ? [{ type: 'required', message: requiredMessage }] : null;
            }
        }

        if(Array.isArray(validationRules) && validationRules.length) {
            createComponentCallback($validationTarget, Validator, {
                validationRules: validationRules,
                validationGroup: validationGroup,
                dataGetter: function() {
                    return {
                        formItem: item
                    };
                }
            });
        }

        if(isMaterial()) {
            const wrapperClass = '.' + FIELD_ITEM_CONTENT_WRAPPER_CLASS;
            const toggleInvalidClass = function(e) {
                $(e.element).parents(wrapperClass)
                    .toggleClass(
                        INVALID_CLASS,
                        e.component.option('isValid') === false &&
                        (e.component._isFocused() || e.component.option('validationMessageMode') === 'always')
                    );
            };

            validationTargetInstance.on('optionChanged', (e) => {
                if(e.name !== 'isValid') return;
                toggleInvalidClass(e);
            });

            validationTargetInstance
                .on('focusIn', toggleInvalidClass)
                .on('focusOut', toggleInvalidClass)
                .on('enterKey', toggleInvalidClass);
        }
    }

    //
    // Append help text elements:
    //

    if(helpText && isSimpleItem) {
        const $editorParent = $fieldEditorContainer.parent();

        // TODO: DOM hierarchy is changed here: new node is added between $editor and $editor.parent()
        $editorParent.append(
            $('<div>')
                .addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS)
                .append($fieldEditorContainer)
                .append(
                    $('<div>')
                        .addClass(FIELD_ITEM_HELP_TEXT_CLASS)
                        .attr('id', helpID)
                        .text(helpText))
        );
    }

    return { $fieldEditorContainer, $rootElement, widgetInstance };
}
