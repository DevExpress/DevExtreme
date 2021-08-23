import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { name as clickEventName } from '../../../events/click';
import { getPublicElement } from '../../../core/element';
import { captionize } from '../../../core/utils/inflector';
import { format } from '../../../core/utils/string';
import { isDefined } from '../../../core/utils/type';
import { isMaterial } from '../../themes';
import errors from '../../widget/ui.errors';

import Validator from '../../validator';

import {
    FLEX_LAYOUT_CLASS,
    FIELD_ITEM_CLASS,
    FIELD_ITEM_OPTIONAL_CLASS,
    FIELD_ITEM_REQUIRED_CLASS,
    FIELD_ITEM_CONTENT_CLASS,
    FIELD_ITEM_CONTENT_WRAPPER_CLASS,
    FIELD_ITEM_CONTENT_LOCATION_CLASS,
    FIELD_ITEM_LABEL_ALIGN_CLASS,
    FIELD_ITEM_HELP_TEXT_CLASS,
    LABEL_VERTICAL_ALIGNMENT_CLASS,
    LABEL_HORIZONTAL_ALIGNMENT_CLASS,
} from '../constants';

import { renderLabel } from './label';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const INVALID_CLASS = 'dx-invalid';

export function renderFieldItem({
    $container,
    containerCssClass,
    parentComponent,
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

    //
    // Setup the root $element:
    //

    $container
        .addClass(FIELD_ITEM_CLASS)
        .addClass(containerCssClass)
        .addClass(isDefined(item.col) ? 'dx-col-' + item.col : '');// TODO: this is a part of Form markup settings, move it to form.js

    $container.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);
    if(isSimpleItem && useFlexLayout) {
        $container.addClass(FLEX_LAYOUT_CLASS);
    }
    if(isSimpleItem && labelNeedBaselineAlign) {
        // TODO: label related code, execute ony if needRenderLabel ?
        $container.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
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
        $container.append($label);
        if(labelLocation === 'top' || labelLocation === 'left') {
            $container.append($fieldEditorContainer);
        }
        if(labelLocation === 'right') {
            $container.prepend($fieldEditorContainer);
        }

        if(labelLocation === 'top') {
            $container.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
        } else {
            $container.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
        }

        if(item.editorType === 'dxCheckBox' || item.editorType === 'dxSwitch') {
            eventsEngine.on($label, clickEventName, function() {
                eventsEngine.trigger($fieldEditorContainer.children(), clickEventName);
            });
        }
    } else {
        $container.append($fieldEditorContainer);
    }

    //
    // Append field editor:
    //

    let instance;
    if(template) {
        template.render({
            container: getPublicElement($fieldEditorContainer),
            model: {
                dataField: item.dataField,
                editorType: item.editorType,
                editorOptions,
                component: parentComponent,
                name: item.name
            },
        });
    } else {
        const $div = $('<div>').appendTo($fieldEditorContainer);

        try {
            instance = createComponentCallback($div, item.editorType, editorOptions);
            instance.setAria('describedby', helpID);
            instance.setAria('labelledby', labelID);
            instance.setAria('required', isRequired);
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
                    .toggleClass(INVALID_CLASS, e.component._isFocused() && e.component.option('isValid') === false);
            };

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

    return { $fieldEditorContainer, instance };
}
