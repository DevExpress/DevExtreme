/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import Popup from '@js/ui/popup/ui.popup';
import EditorFactoryMixin from '@js/ui/shared/ui.editor_factory_mixin';
import TreeView from '@js/ui/tree_view';
import Widget from '@js/ui/widget/ui.widget';
import { getElementMaxHeightByWindow } from '@ts/ui/overlay/m_utils';

import {
  addItem, convertToInnerStructure,
  createCondition, createEmptyGroup,
  getAvailableOperations, getCaptionWithParents, getCurrentLookupValueText, getCurrentValueText,
  getCustomOperation, getDefaultOperation, getField, getFilterExpression, getGroupCriteria, getGroupMenuItem, getGroupValue,
  getItems,
  getMergedOperations, getNormalizedFields, getNormalizedFilter,
  getOperationFromAvailable,
  getOperationValue, isCondition, isGroup, removeItem, renderValueText, setGroupValue,
  updateConditionByOperation,
} from './m_utils';

const FILTER_BUILDER_CLASS = 'dx-filterbuilder';
const FILTER_BUILDER_GROUP_CLASS = `${FILTER_BUILDER_CLASS}-group`;
const FILTER_BUILDER_GROUP_ITEM_CLASS = `${FILTER_BUILDER_GROUP_CLASS}-item`;
const FILTER_BUILDER_GROUP_CONTENT_CLASS = `${FILTER_BUILDER_GROUP_CLASS}-content`;
const FILTER_BUILDER_GROUP_OPERATIONS_CLASS = `${FILTER_BUILDER_GROUP_CLASS}-operations`;
const FILTER_BUILDER_GROUP_OPERATION_CLASS = `${FILTER_BUILDER_GROUP_CLASS}-operation`;
const FILTER_BUILDER_ACTION_CLASS = `${FILTER_BUILDER_CLASS}-action`;
const FILTER_BUILDER_IMAGE_CLASS = `${FILTER_BUILDER_ACTION_CLASS}-icon`;
const FILTER_BUILDER_IMAGE_ADD_CLASS = 'dx-icon-plus';
const FILTER_BUILDER_IMAGE_REMOVE_CLASS = 'dx-icon-remove';
const FILTER_BUILDER_ITEM_TEXT_CLASS = `${FILTER_BUILDER_CLASS}-text`;
const FILTER_BUILDER_ITEM_FIELD_CLASS = `${FILTER_BUILDER_CLASS}-item-field`;
const FILTER_BUILDER_ITEM_OPERATION_CLASS = `${FILTER_BUILDER_CLASS}-item-operation`;
const FILTER_BUILDER_ITEM_VALUE_CLASS = `${FILTER_BUILDER_CLASS}-item-value`;
const FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = `${FILTER_BUILDER_CLASS}-item-value-text`;
const FILTER_BUILDER_OVERLAY_CLASS = `${FILTER_BUILDER_CLASS}-overlay`;
const FILTER_BUILDER_FILTER_OPERATIONS_CLASS = `${FILTER_BUILDER_CLASS}-operations`;
const FILTER_BUILDER_FIELDS_CLASS = `${FILTER_BUILDER_CLASS}-fields`;
const FILTER_BUILDER_ADD_CONDITION_CLASS = `${FILTER_BUILDER_CLASS}-add-condition`;
const ACTIVE_CLASS = 'dx-state-active';
const FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS = `${FILTER_BUILDER_CLASS}-menu-custom-operation`;
const SOURCE = 'filterBuilder';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const TAB_KEY = 'tab';
const ENTER_KEY = 'enter';
const ESCAPE_KEY = 'escape';

const ACTIONS = [{
  name: 'onEditorPreparing',
  config: { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' },
}, {
  name: 'onEditorPrepared',
  config: { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' },
}, {
  name: 'onValueChanged',
  config: { excludeValidators: ['disabled', 'readOnly'] },
}];
const OPERATORS = {
  and: 'and',
  or: 'or',
  notAnd: '!and',
  notOr: '!or',
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
const EditorFactory = EditorFactoryMixin(class {});

class FilterBuilder extends Widget<any> {
  _disableInvalidateForValue!: boolean;

  _model!: any;

  _customOperations!: any;

  _editorFactory!: any;

  _actions!: any;

  _documentKeyUpHandler!: any;

  _documentClickHandler!: any;

  _getDefaultOptions() {
    // @ts-expect-error
    return extend(super._getDefaultOptions(), {
      onEditorPreparing: null,

      onEditorPrepared: null,

      onValueChanged: null,

      fields: [],

      groupOperations: ['and', 'or', 'notAnd', 'notOr'],

      maxGroupLevel: undefined,

      value: null,

      allowHierarchicalFields: false,

      groupOperationDescriptions: {
        and: messageLocalization.format('dxFilterBuilder-and'),
        or: messageLocalization.format('dxFilterBuilder-or'),
        notAnd: messageLocalization.format('dxFilterBuilder-notAnd'),
        notOr: messageLocalization.format('dxFilterBuilder-notOr'),
      },

      customOperations: [],

      closePopupOnTargetScroll: true,

      filterOperationDescriptions: {
        between: messageLocalization.format('dxFilterBuilder-filterOperationBetween'),
        equal: messageLocalization.format('dxFilterBuilder-filterOperationEquals'),
        notEqual: messageLocalization.format('dxFilterBuilder-filterOperationNotEquals'),
        lessThan: messageLocalization.format('dxFilterBuilder-filterOperationLess'),
        lessThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationLessOrEquals'),
        greaterThan: messageLocalization.format('dxFilterBuilder-filterOperationGreater'),
        greaterThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
        startsWith: messageLocalization.format('dxFilterBuilder-filterOperationStartsWith'),
        contains: messageLocalization.format('dxFilterBuilder-filterOperationContains'),
        notContains: messageLocalization.format('dxFilterBuilder-filterOperationNotContains'),
        endsWith: messageLocalization.format('dxFilterBuilder-filterOperationEndsWith'),
        isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
        isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
      },
    });
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'closePopupOnTargetScroll':
        break;
      case 'onEditorPreparing':
      case 'onEditorPrepared':
      case 'onValueChanged':
        this._initActions();
        break;
      case 'customOperations':
        this._initCustomOperations();
        this._invalidate();
        break;
      case 'fields':
      case 'maxGroupLevel':
      case 'groupOperations':
      case 'allowHierarchicalFields':
      case 'groupOperationDescriptions':
      case 'filterOperationDescriptions':
        this._invalidate();
        break;
      case 'value':
        if (args.value !== args.previousValue) {
          const disableInvalidateForValue = this._disableInvalidateForValue;
          if (!disableInvalidateForValue) {
            this._initModel();
            this._invalidate();
          }
          this._disableInvalidateForValue = false;
          this.executeAction('onValueChanged', {
            value: args.value,
            previousValue: args.previousValue,
          });
          this._disableInvalidateForValue = disableInvalidateForValue;
        }
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  getFilterExpression() {
    const fields = this._getNormalizedFields();
    const value = extend(true, [], this._model);
    return getFilterExpression(getNormalizedFilter(value), fields, this._customOperations, SOURCE);
  }

  _getNormalizedFields() {
    return getNormalizedFields(this.option('fields'));
  }

  _updateFilter() {
    this._disableInvalidateForValue = true;
    const value = extend(true, [], this._model);
    const normalizedValue = getNormalizedFilter(value);
    const oldValue = getNormalizedFilter(this._getModel(this.option('value')));
    if (JSON.stringify(oldValue) !== JSON.stringify(normalizedValue)) {
      this.option('value', normalizedValue);
    }
    this._disableInvalidateForValue = false;
    // @ts-expect-error
    this._fireContentReadyAction();
  }

  _init() {
    this._initCustomOperations();
    this._initModel();
    this._initEditorFactory();
    this._initActions();
    // @ts-expect-error
    super._init();
  }

  _initEditorFactory() {
    this._editorFactory = new EditorFactory();
  }

  _initCustomOperations() {
    this._customOperations = getMergedOperations(this.option('customOperations'), this.option('filterOperationDescriptions.between'), this);
  }

  _getDefaultGroupOperation() {
    return this.option('groupOperations')?.[0] ?? OPERATORS.and;
  }

  _getModel(value) {
    return convertToInnerStructure(value, this._customOperations, this._getDefaultGroupOperation());
  }

  _initModel() {
    this._model = this._getModel(this.option('value'));
  }

  _initActions() {
    const that = this;

    that._actions = {};

    ACTIONS.forEach((action) => {
      const actionConfig = extend({}, action.config);
      // @ts-expect-error
      that._actions[action.name] = that._createActionByOption(action.name, actionConfig);
    });
  }

  executeAction(actionName, options) {
    const action = this._actions[actionName];

    return action && action(options);
  }

  _initMarkup() {
    // @ts-expect-error
    this.$element().addClass(FILTER_BUILDER_CLASS);
    // @ts-expect-error
    super._initMarkup();

    this._addAriaAttributes(this.$element(), messageLocalization.format('dxFilterBuilder-filterAriaRootElement'), 'tree');
    this._createGroupElementByCriteria(this._model)
      .appendTo(this.$element());
  }

  _addAriaAttributes($element, ariaLabel, role, hasPopup?, hasExpanded?, ariaLevel?) {
    if (!$element || !$element.length) return;

    const attributes = { role };

    if (ariaLabel) {
      if ($element.text().length > 0) {
        // @ts-expect-error title attr
        attributes.title = ariaLabel;
      } else {
        attributes['aria-label'] = ariaLabel;
      }
    }

    if (isDefined(hasPopup)) {
      attributes['aria-haspopup'] = `${hasPopup}`;
    }

    if (isDefined(hasExpanded)) {
      attributes['aria-expanded'] = `${hasExpanded}`;
    }

    if (isDefined(ariaLevel)) {
      attributes['aria-level'] = `${ariaLevel}`;
    }

    $element.attr(attributes);
  }

  _createConditionElement(condition, parent, groupLevel?) {
    return $('<div>')
      .addClass(FILTER_BUILDER_GROUP_CLASS)
      .append(this._createConditionItem(condition, parent, groupLevel));
  }

  _createGroupElementByCriteria(criteria, parent?, groupLevel = 0) {
    const $group = this._createGroupElement(criteria, parent, groupLevel);
    const $groupContent = $group.find(`.${FILTER_BUILDER_GROUP_CONTENT_CLASS}`);
    const groupCriteria = getGroupCriteria(criteria);

    for (let i = 0; i < groupCriteria.length; i++) {
      const innerCriteria = groupCriteria[i];
      if (isGroup(innerCriteria)) {
        this._createGroupElementByCriteria(innerCriteria, criteria, groupLevel + 1)
          .appendTo($groupContent);
      } else if (isCondition(innerCriteria)) {
        this._createConditionElement(innerCriteria, criteria, `${groupLevel + 1}`)
          .appendTo($groupContent);
      }
    }
    return $group;
  }

  _createGroupElement(criteria, parent, groupLevel) {
    const $guid = new Guid();
    const $groupItem = $('<div>').addClass(FILTER_BUILDER_GROUP_ITEM_CLASS);
    const $groupContent = $('<div>').addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS).attr('id', `${$guid}`);
    const $group = $('<div>').addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

    if (parent != null) {
      this._createRemoveButton(() => {
        removeItem(parent, criteria);
        $group.remove();
        this._updateFilter();
      }, 'group').appendTo($groupItem);
    }

    this._addAriaAttributes($groupItem, messageLocalization.format('dxFilterBuilder-filterAriaGroupItem'), 'treeitem', null, null, `${groupLevel + 1}`);
    this._addAriaAttributes($groupContent, '', 'group');
    $groupItem.attr('aria-owns', `${$guid}`);

    this._createGroupOperationButton(criteria).appendTo($groupItem);

    this._createAddButton(() => {
      const newGroup = createEmptyGroup(this._getDefaultGroupOperation());
      addItem(newGroup, criteria);
      this._createGroupElement(newGroup, criteria, groupLevel + 1).appendTo($groupContent);
      this._updateFilter();
    }, () => {
      const field = this.option('fields')[0];
      const newCondition = createCondition(field, this._customOperations);
      addItem(newCondition, criteria);
      this._createConditionElement(newCondition, criteria, groupLevel + 1).appendTo($groupContent);
      this._updateFilter();
    }, groupLevel).appendTo($groupItem);

    return $group;
  }

  _createButton(caption?) {
    return $('<div>').text(caption);
  }

  _createGroupOperationButton(criteria) {
    const groupOperations = this._getGroupOperations(criteria);
    let groupMenuItem = getGroupMenuItem(criteria, groupOperations);
    const caption = groupMenuItem.text;
    const $operationButton = groupOperations && groupOperations.length < 2
      ? this._createButton(caption).addClass(DISABLED_STATE_CLASS)
      : this._createButtonWithMenu({
        caption,
        menu: {
          items: groupOperations,
          displayExpr: 'text',
          keyExpr: 'value',
          onItemClick: (e) => {
            if (groupMenuItem !== e.itemData) {
              setGroupValue(criteria, e.itemData.value);
              $operationButton.text(e.itemData.text);
              groupMenuItem = e.itemData;
              this._updateFilter();
            }
          },
          onContentReady(e) {
            e.component.selectItem(groupMenuItem);
          },
          cssClass: FILTER_BUILDER_GROUP_OPERATIONS_CLASS,
        },
      });

    this._addAriaAttributes($operationButton, messageLocalization.format('dxFilterBuilder-filterAriaOperationButton'), 'combobox', true, false);

    return $operationButton.addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
      .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
      .attr('tabindex', 0);
  }

  _createButtonWithMenu(options) {
    const that = this;
    const removeMenu = function () {
      // @ts-expect-error
      that.$element().find(`.${ACTIVE_CLASS}`).removeClass(ACTIVE_CLASS).attr('aria-expanded', 'false');
      // @ts-expect-error
      that.$element().find('.dx-overlay .dx-treeview').remove();
      // @ts-expect-error
      that.$element().find('.dx-overlay').remove();
    };
    const rtlEnabled = this.option('rtlEnabled');
    const menuOnItemClickWrapper = function (handler) {
      return function (e) {
        handler(e);
        if (e.event.type === 'dxclick') {
          removeMenu();
        }
      };
    };
    const position = rtlEnabled ? 'right' : 'left';
    const $button = this._createButton(options.caption);

    extend(options.menu, {
      focusStateEnabled: true,
      selectionMode: 'single',
      onItemClick: menuOnItemClickWrapper(options.menu.onItemClick),
      onHiding() {
        $button.removeClass(ACTIVE_CLASS).attr('aria-expanded', 'false');
      },
      position: {
        my: `${position} top`, at: `${position} bottom`, offset: '0 1', of: $button, collision: 'flip',
      },
      animation: null,
      onHidden() {
        removeMenu();
      },
      cssClass: `${FILTER_BUILDER_OVERLAY_CLASS} ${options.menu.cssClass}`,
      rtlEnabled,
    });

    options.popup = {
      onShown(info) {
        const treeViewElement = $(info.component.content()).find('.dx-treeview');
        // @ts-expect-error dxElementWrapper doesn't contain widget creation methods types
        const treeView = treeViewElement.dxTreeView('instance');
        eventsEngine.on(treeViewElement, 'keyup keydown', (e) => {
          const keyName = normalizeKeyName(e);

          if ((e.type === 'keydown' && keyName === TAB_KEY)
                            || (e.type === 'keyup' && (keyName === ESCAPE_KEY || keyName === ENTER_KEY))) {
            info.component.hide();
            // @ts-expect-error eventsEngine is badly typed
            eventsEngine.trigger(options.menu.position.of, 'focus');
          }
        });

        treeView.focus();
        treeView.option('focusedElement', null);
      },
    };

    this._subscribeOnClickAndEnterKey($button, () => {
      removeMenu();
      that._createPopupWithTreeView(options, that.$element());
      $button.addClass(ACTIVE_CLASS).attr('aria-expanded', 'true');
    });
    return $button;
  }

  _hasValueButton(condition) {
    const customOperation = getCustomOperation(this._customOperations, condition[1]);
    return customOperation
      ? customOperation.hasValue !== false
      : condition[2] !== null;
  }

  _createOperationButtonWithMenu(condition, field) {
    const that = this;
    const availableOperations = getAvailableOperations(field, this.option('filterOperationDescriptions'), this._customOperations);
    let currentOperation = getOperationFromAvailable(getOperationValue(condition), availableOperations);
    const $operationButton = this._createButtonWithMenu({
      caption: currentOperation.text,
      menu: {
        items: availableOperations,
        displayExpr: 'text',
        onItemRendered(e) {
          e.itemData.isCustom && $(e.itemElement).addClass(FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS);
        },
        onContentReady(e) {
          e.component.selectItem(currentOperation);
        },
        onItemClick: (e) => {
          if (currentOperation !== e.itemData) {
            currentOperation = e.itemData;
            updateConditionByOperation(condition, currentOperation.value, that._customOperations);
            const $valueButton = $operationButton.siblings().filter(`.${FILTER_BUILDER_ITEM_VALUE_CLASS}`);
            if (that._hasValueButton(condition)) {
              if ($valueButton.length !== 0) {
                $valueButton.remove();
              }
              that._createValueButton(condition, field).appendTo($operationButton.parent());
            } else {
              $valueButton.remove();
            }
            $operationButton.text(currentOperation.text);
            this._updateFilter();
          }
        },
        cssClass: FILTER_BUILDER_FILTER_OPERATIONS_CLASS,
      },
    }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
      .addClass(FILTER_BUILDER_ITEM_OPERATION_CLASS)
      .attr('tabindex', 0);
    this._addAriaAttributes($operationButton, messageLocalization.format('dxFilterBuilder-filterAriaItemOperation'), 'combobox', true, false);

    return $operationButton;
  }

  _createOperationAndValueButtons(condition, field, $item) {
    this._createOperationButtonWithMenu(condition, field)
      .appendTo($item);

    if (this._hasValueButton(condition)) {
      this._createValueButton(condition, field)
        .appendTo($item);
    }
  }

  _createFieldButtonWithMenu(fields, condition, field) {
    const that = this;
    const allowHierarchicalFields = this.option('allowHierarchicalFields');
    const items = getItems(fields, allowHierarchicalFields);
    let item = getField(field.name || field.dataField, items);
    const getFullCaption = function (item, items) {
      return allowHierarchicalFields ? getCaptionWithParents(item, items) : item.caption;
    };
    condition[0] = item.name || item.dataField;

    const $fieldButton = this._createButtonWithMenu({
      caption: getFullCaption(item, items),
      menu: {
        items,
        dataStructure: 'plain',
        keyExpr: 'id',
        parentId: 'parentId',
        displayExpr: 'caption',
        onItemClick: (e) => {
          if (item !== e.itemData) {
            item = e.itemData;
            condition[0] = item.name || item.dataField;
            condition[2] = item.dataType === 'object' ? null : '';
            updateConditionByOperation(condition, getDefaultOperation(item), that._customOperations);
            $fieldButton.siblings().filter(`.${FILTER_BUILDER_ITEM_TEXT_CLASS}`).remove();
            that._createOperationAndValueButtons(condition, item, $fieldButton.parent());

            const caption = getFullCaption(item, e.component.option('items'));
            $fieldButton.text(caption);
            this._updateFilter();
          }
        },
        onContentReady(e) {
          e.component.selectItem(item);
        },
        cssClass: FILTER_BUILDER_FIELDS_CLASS,
      },
    }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
      .addClass(FILTER_BUILDER_ITEM_FIELD_CLASS)
      .attr('tabindex', 0);

    this._addAriaAttributes($fieldButton, messageLocalization.format('dxFilterBuilder-filterAriaItemField'), 'combobox', true, false);

    return $fieldButton;
  }

  _createConditionItem(condition, parent, groupLevel?) {
    const $item = $('<div>').addClass(FILTER_BUILDER_GROUP_ITEM_CLASS);
    const fields = this._getNormalizedFields();
    const field = getField(condition[0], fields);

    this._addAriaAttributes($item, '', 'treeitem', null, null, groupLevel);

    this._createRemoveButton(() => {
      removeItem(parent, condition);
      const isSingleChild = $item.parent().children().length === 1;
      if (isSingleChild) {
        $item.parent().remove();
      } else {
        $item.remove();
      }
      this._updateFilter();
    }, 'condition').appendTo($item);
    this._createFieldButtonWithMenu(fields, condition, field).appendTo($item);
    this._createOperationAndValueButtons(condition, field, $item);
    return $item;
  }

  _getGroupOperations(criteria) {
    let groupOperations = this.option('groupOperations');
    const groupOperationDescriptions = this.option('groupOperationDescriptions');

    if (!groupOperations || !groupOperations.length) {
      groupOperations = [getGroupValue(criteria).replace('!', 'not')];
    }

    return groupOperations.map((operation) => ({
      text: groupOperationDescriptions[operation],
      value: OPERATORS[operation],
    }));
  }

  _createRemoveButton(handler, type?) {
    const $removeButton = $('<div>')
      .addClass(FILTER_BUILDER_IMAGE_CLASS)
      .addClass(FILTER_BUILDER_IMAGE_REMOVE_CLASS)
      .addClass(FILTER_BUILDER_ACTION_CLASS)
      .attr('tabindex', 0);
    if (type) {
      const removeMessage = (messageLocalization.format as any)('dxFilterBuilder-filterAriaRemoveButton', type);
      this._addAriaAttributes($removeButton, removeMessage, 'button');
    }
    this._subscribeOnClickAndEnterKey($removeButton, handler);
    return $removeButton;
  }

  _createAddButton(addGroupHandler, addConditionHandler, groupLevel) {
    let $button;
    const maxGroupLevel = this.option('maxGroupLevel');
    if (isDefined(maxGroupLevel) && groupLevel >= maxGroupLevel) {
      $button = this._createButton();
      this._subscribeOnClickAndEnterKey($button, addConditionHandler);
    } else {
      $button = this._createButtonWithMenu({
        menu: {
          items: [{
            caption: messageLocalization.format('dxFilterBuilder-addCondition'),
            click: addConditionHandler,
          }, {
            caption: messageLocalization.format('dxFilterBuilder-addGroup'),
            click: addGroupHandler,
          }],
          displayExpr: 'caption',
          onItemClick(e) {
            e.itemData.click();
          },
          cssClass: FILTER_BUILDER_ADD_CONDITION_CLASS,
        },
      });
    }

    this._addAriaAttributes($button, messageLocalization.format('dxFilterBuilder-filterAriaAddButton'), 'combobox', true, false);

    return $button.addClass(FILTER_BUILDER_IMAGE_CLASS)
      .addClass(FILTER_BUILDER_IMAGE_ADD_CLASS)
      .addClass(FILTER_BUILDER_ACTION_CLASS)
      .attr('tabindex', 0);
  }

  _createValueText(item, field, $container) {
    const that = this;
    const $text = $('<div>')
      .html('&nbsp;')
      .addClass(FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS)
      .attr('tabindex', 0)
      .appendTo($container);
    this._addAriaAttributes($text, messageLocalization.format('dxFilterBuilder-filterAriaItemValue'), 'button', true);
    const value = item[2];

    const customOperation = getCustomOperation(that._customOperations, item[1]);
    if (!customOperation && field.lookup) {
      getCurrentLookupValueText(field, value, (result) => {
        renderValueText($text, result);
      });
    } else {
      when(getCurrentValueText(field, value, customOperation)).done((result) => {
        renderValueText($text, result, customOperation);
      });
    }

    that._subscribeOnClickAndEnterKey($text, (e) => {
      if (e.type === 'keyup') {
        e.stopPropagation();
      }
      that._createValueEditorWithEvents(item, field, $container);
    });

    return $text;
  }

  _updateConditionValue(item, value, callback) {
    const areValuesDifferent = item[2] !== value;
    if (areValuesDifferent) {
      item[2] = value;
    }
    callback();
    this._updateFilter();
  }

  _addDocumentKeyUp($editor, handler) {
    let isComposing = false; // IME Composing going on
    let hasCompositionJustEnded = false; // Used to swallow keyup event related to compositionend
    const document = domAdapter.getDocument();
    const documentKeyUpHandler = (e) => {
      if (isComposing || hasCompositionJustEnded) {
        // IME composing fires
        hasCompositionJustEnded = false;
        return;
      }
      handler(e);
    };
    eventsEngine.on(document, 'keyup', documentKeyUpHandler);

    const input = $editor.find('input');
    eventsEngine.on(input, 'compositionstart', () => {
      isComposing = true;
    });

    eventsEngine.on(input, 'compositionend', () => {
      isComposing = false;
      // some browsers (IE, Firefox, Safari) send a keyup event after
      // compositionend, some (Chrome, Edge) don't. This is to swallow
      // the next keyup event, unless a keydown event happens first
      hasCompositionJustEnded = true;
    });

    // Safari on OS X may send a keydown of 229 after compositionend
    eventsEngine.on(input, 'keydown', (event) => {
      if (event.which !== 229) {
        hasCompositionJustEnded = false;
      }
    });

    this._documentKeyUpHandler = documentKeyUpHandler;
  }

  _addDocumentClick($editor, closeEditorFunc) {
    const document = domAdapter.getDocument();
    const documentClickHandler = (e) => {
      if (!this._isFocusOnEditorParts($editor, e.target)) {
        // @ts-expect-error eventsEngine is badly typed
        eventsEngine.trigger($editor.find('input'), 'change');
        closeEditorFunc();
      }
    };
    eventsEngine.on(document, 'dxpointerdown', documentClickHandler);

    this._documentClickHandler = documentClickHandler;
  }

  _isFocusOnEditorParts($editor, target?) {
    const activeElement = target || domAdapter.getActiveElement();
    return $(activeElement).closest($editor.children()).length
            || $(activeElement).closest('.dx-dropdowneditor-overlay').length;
  }

  _removeEvents() {
    const document = domAdapter.getDocument();
    isDefined(this._documentKeyUpHandler) && eventsEngine.off(document, 'keyup', this._documentKeyUpHandler);
    isDefined(this._documentClickHandler) && eventsEngine.off(document, 'dxpointerdown', this._documentClickHandler);
  }

  _dispose() {
    this._removeEvents();
    // @ts-expect-error
    super._dispose();
  }

  _createValueEditorWithEvents(item, field, $container) {
    let value = item[2];
    const createValueText = () => {
      $container.empty();
      this._removeEvents();
      return this._createValueText(item, field, $container);
    };
    const closeEditor = () => {
      this._updateConditionValue(item, value, () => {
        createValueText();
      });
    };

    const options = {
      value: value === '' ? null : value,
      filterOperation: getOperationValue(item),
      setValue(data) {
        value = data === null ? '' : data;
      },
      closeEditor,
      text: $container.text(),
    };

    $container.empty();

    const $editor = this._createValueEditor($container, field, options);
    // @ts-expect-error eventsEngine is badly typed
    eventsEngine.trigger($editor.find('input').not(':hidden').eq(0), 'focus');

    this._removeEvents();

    this._addDocumentClick($editor, closeEditor);
    this._addDocumentKeyUp($editor, (e) => {
      const keyName = normalizeKeyName(e);

      if (keyName === TAB_KEY) {
        if (this._isFocusOnEditorParts($editor)) {
          return;
        }
        this._updateConditionValue(item, value, () => {
          createValueText();
          if (e.shiftKey) {
            // @ts-expect-error eventsEngine is badly typed
            eventsEngine.trigger($container.prev(), 'focus');
          }
        });
      }
      if (keyName === ESCAPE_KEY) {
        // @ts-expect-error eventsEngine is badly typed
        eventsEngine.trigger(createValueText(), 'focus');
      }
      if (keyName === ENTER_KEY) {
        this._updateConditionValue(item, value, () => {
          // @ts-expect-error eventsEngine is badly typed
          eventsEngine.trigger(createValueText(), 'focus');
        });
      }
    });
    // @ts-expect-error
    this._fireContentReadyAction();
  }

  _createValueButton(item, field) {
    const $valueButton = $('<div>')
      .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
      .addClass(FILTER_BUILDER_ITEM_VALUE_CLASS);
    this._createValueText(item, field, $valueButton);
    return $valueButton;
  }

  _createValueEditor($container, field, options) {
    const $editor = $('<div>').attr('tabindex', 0).appendTo($container);
    const customOperation = getCustomOperation(this._customOperations, options.filterOperation);
    const editorTemplate = customOperation && customOperation.editorTemplate ? customOperation.editorTemplate : field.editorTemplate;

    if (editorTemplate) {
      const template = this._getTemplate(editorTemplate);

      template.render({
        model: extend({ field }, options),
        container: $editor,
      });
    } else {
      this._editorFactory.createEditor.call(this, $editor, extend({}, field, options, {
        parentType: SOURCE,
      }));
    }
    return $editor;
  }

  _createPopupWithTreeView(options, $container) {
    const that = this;
    const $popup = $('<div>')
      .addClass(options.menu.cssClass).appendTo($container);
    // @ts-expect-error
    this._createComponent($popup, Popup, {
      onHiding: options.menu.onHiding,
      onHidden: options.menu.onHidden,
      rtlEnabled: options.menu.rtlEnabled,
      position: options.menu.position,
      animation: options.menu.animation,
      contentTemplate(contentElement) {
        const $menuContainer = $('<div>').appendTo(contentElement);
        // @ts-expect-error
        that._createComponent($menuContainer, TreeView, options.menu);
        // T852701
        this.repaint();
      },
      _ignoreFunctionValueDeprecation: true,
      maxHeight() {
        return getElementMaxHeightByWindow(options.menu.position.of);
      },
      visible: true,
      focusStateEnabled: false,
      preventScrollEvents: false,
      hideOnParentScroll: this.option('closePopupOnTargetScroll'),
      hideOnOutsideClick: true,
      onShown: options.popup.onShown,
      shading: false,
      width: 'auto',
      height: 'auto',
      showTitle: false,
      _wrapperClassExternal: options.menu.cssClass,
    });
  }

  _subscribeOnClickAndEnterKey($button, handler) {
    eventsEngine.on($button, 'dxclick', handler);
    eventsEngine.on($button, 'keyup', (e) => {
      if (normalizeKeyName(e) === ENTER_KEY) {
        handler(e);
      }
    });
  }
}

registerComponent('dxFilterBuilder', FilterBuilder);

export default FilterBuilder;
