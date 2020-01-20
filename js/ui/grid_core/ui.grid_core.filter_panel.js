import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import modules from './ui.grid_core.modules';
import gridUtils from './ui.grid_core.utils';
import eventsEngine from '../../events/core/events_engine';
import messageLocalization from '../../localization/message';
import CheckBox from '../check_box';
import utils from '../filter_builder/utils';
import { when, Deferred } from '../../core/utils/deferred';
import inflector from '../../core/utils/inflector';
import { registerKeyboardAction } from './ui.grid_core.accessibility';

const FILTER_PANEL_CLASS = 'filter-panel';
const FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + '-text';
const FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + '-checkbox';
const FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + '-clear-filter';
const FILTER_PANEL_LEFT_CONTAINER = FILTER_PANEL_CLASS + '-left';

const FILTER_PANEL_TARGET = 'filterPanel';

const FilterPanelView = modules.View.inherit({
    isVisible: function() {
        return this.option('filterPanel.visible') && this.getController('data').dataSource();
    },

    init: function() {
        this.getController('data').dataSourceChanged.add(() => this.render());
    },

    _renderCore: function() {
        const that = this;
        const $element = that.element();
        let $leftContainer;

        $element
            .empty()
            .addClass(that.addWidgetPrefix(FILTER_PANEL_CLASS));
        $leftContainer = $('<div>')
            .addClass(that.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER))
            .appendTo($element);

        if(that.option('filterValue') || that._filterValueBuffer) {
            $leftContainer.append(that._getCheckElement())
                .append(that._getFilterElement())
                .append(that._getTextElement());
            $element.append(that._getRemoveButtonElement());
        } else {
            $leftContainer.append(that._getFilterElement())
                .append(that._getTextElement());
        }
    },

    _getCheckElement: function() {
        const that = this;
        const $element = $('<div>')
            .addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

        that._createComponent($element, CheckBox, {
            value: that.option('filterPanel.filterEnabled'),
            onValueChanged: function(e) {
                that.option('filterPanel.filterEnabled', e.value);
            }
        });
        $element.attr('title', this.option('filterPanel.texts.filterEnabledHint'));
        return $element;
    },

    _getFilterElement: function() {
        const that = this;
        const $element = $('<div>').addClass('dx-icon-filter');

        eventsEngine.on($element, 'click', () => that._showFilterBuilder());

        registerKeyboardAction('filterPanel', that, $element, undefined, () => that._showFilterBuilder());

        that._addTabIndexToElement($element);

        return $element;
    },

    _getTextElement: function() {
        const that = this;
        const $textElement = $('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS));
        let filterText;
        const filterValue = that.option('filterValue');
        if(filterValue) {
            when(that.getFilterText(filterValue, that.getController('filterSync').getCustomFilterOperations())).done(function(filterText) {
                const customizeText = that.option('filterPanel.customizeText');
                if(customizeText) {
                    const customText = customizeText({
                        component: that.component,
                        filterValue: filterValue,
                        text: filterText
                    });
                    if(typeof customText === 'string') {
                        filterText = customText;
                    }
                }
                $textElement.text(filterText);
            });
        } else {
            filterText = that.option('filterPanel.texts.createFilter');
            $textElement.text(filterText);
        }

        eventsEngine.on($textElement, 'click', () => that._showFilterBuilder());

        registerKeyboardAction('filterPanel', that, $textElement, undefined, () => that._showFilterBuilder());

        that._addTabIndexToElement($textElement);

        return $textElement;
    },

    _showFilterBuilder: function() {
        this.option('filterBuilderPopup.visible', true);
    },

    _getRemoveButtonElement: function() {
        const that = this;
        const clearFilterValue = () => that.option('filterValue', null);
        const $element = $('<div>')
            .addClass(that.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS))
            .text(that.option('filterPanel.texts.clearFilter'));

        eventsEngine.on($element, 'click', clearFilterValue);

        registerKeyboardAction('filterPanel', this, $element, undefined, clearFilterValue);

        that._addTabIndexToElement($element);

        return $element;
    },

    _addTabIndexToElement: function($element) {
        if(!this.option('useLegacyKeyboardNavigation')) {
            const tabindex = this.option('tabindex') || 0;
            $element.attr('tabindex', tabindex);
        }
    },

    optionChanged: function(args) {
        switch(args.name) {
            case 'filterValue':
                this._invalidate();
                this.option('filterPanel.filterEnabled', true);
                args.handled = true;
                break;
            case 'filterPanel':
                this._invalidate();
                args.handled = true;
                break;
            default:
                this.callBase(args);
        }
    },

    _getConditionText: function(fieldText, operationText, valueText) {
        let result = `[${fieldText}] ${operationText}`;
        if(isDefined(valueText)) {
            result += valueText;
        }
        return result;
    },

    _getValueMaskedText: function(value) {
        return Array.isArray(value) ? `('${value.join('\', \'')}')` : ` '${value}'`;
    },

    _getValueText: function(field, customOperation, value) {
        const deferred = new Deferred();
        const hasCustomOperation = customOperation && customOperation.customizeText;
        if(isDefined(value) || hasCustomOperation) {
            if(!hasCustomOperation && field.lookup) {
                utils.getCurrentLookupValueText(field, value, data => {
                    deferred.resolve(this._getValueMaskedText(data));
                });
            } else {
                const displayValue = Array.isArray(value) ? value : gridUtils.getDisplayValue(field, value);
                when(utils.getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET)).done(data => {
                    deferred.resolve(this._getValueMaskedText(data));
                });
            }
        } else {
            deferred.resolve('');
        }
        return deferred.promise();
    },

    getConditionText: function(filterValue, options) {
        const that = this;
        const operation = filterValue[1];
        const deferred = new Deferred();
        const customOperation = utils.getCustomOperation(options.customOperations, operation);
        let operationText;
        const field = utils.getField(filterValue[0], options.columns);
        const fieldText = field.caption || '';
        const value = filterValue[2];

        if(customOperation) {
            operationText = customOperation.caption || inflector.captionize(customOperation.name);
        } else if(value === null) {
            operationText = utils.getCaptionByOperation(operation === '=' ? 'isblank' : 'isnotblank', options.filterOperationDescriptions);
        } else {
            operationText = utils.getCaptionByOperation(operation, options.filterOperationDescriptions);
        }
        this._getValueText(field, customOperation, value).done((valueText) => {
            deferred.resolve(that._getConditionText(fieldText, operationText, valueText));
        });
        return deferred;
    },

    getGroupText: function(filterValue, options, isInnerGroup) {
        const that = this;
        const result = new Deferred();
        const textParts = [];
        const groupValue = utils.getGroupValue(filterValue);

        filterValue.forEach(item => {
            if(utils.isCondition(item)) {
                textParts.push(that.getConditionText(item, options));
            } else if(utils.isGroup(item)) {
                textParts.push(that.getGroupText(item, options, true));
            }
        });

        when.apply(this, textParts).done((...args) => {
            let text;
            if(groupValue[0] === '!') {
                const groupText = options.groupOperationDescriptions['not' + groupValue.substring(1, 2).toUpperCase() + groupValue.substring(2)].split(' ');
                text = `${groupText[0]} ${args[0]}`;
            } else {
                text = args.join(` ${options.groupOperationDescriptions[groupValue]} `);
            }
            if(isInnerGroup) {
                text = `(${text})`;
            }
            result.resolve(text);
        });
        return result;
    },

    getFilterText: function(filterValue, customOperations) {
        const that = this;
        const options = {
            customOperations: customOperations,
            columns: that.getController('columns').getFilteringColumns(),
            filterOperationDescriptions: that.option('filterBuilder.filterOperationDescriptions'),
            groupOperationDescriptions: that.option('filterBuilder.groupOperationDescriptions')
        };
        return utils.isCondition(filterValue) ? that.getConditionText(filterValue, options) : that.getGroupText(filterValue, options);
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            filterPanel: {
                /**
                 * @name GridBaseOptions.filterPanel.visible
                 * @type boolean
                 * @default false
                 */
                visible: false,

                /**
                 * @name GridBaseOptions.filterPanel.filterEnabled
                 * @type boolean
                 * @default true
                 * @fires GridBaseOptions.onOptionChanged
                 */
                filterEnabled: true,

                /**
                 * @name GridBaseOptions.filterPanel.customizeText
                 * @type function
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 component:this
                 * @type_function_param1_field2 filterValue:object
                 * @type_function_param1_field3 text:string
                 * @type_function_return string
                 */

                /**
                 * @name GridBaseOptions.filterPanel.texts
                 * @type object
                 * @default {}
                 */
                texts: {
                    /**
                     * @name GridBaseOptions.filterPanel.texts.createFilter
                     * @type string
                     * @default "Create Filter"
                     */
                    createFilter: messageLocalization.format('dxDataGrid-filterPanelCreateFilter'),

                    /**
                     * @name GridBaseOptions.filterPanel.texts.clearFilter
                     * @type string
                     * @default "Clear"
                     */
                    clearFilter: messageLocalization.format('dxDataGrid-filterPanelClearFilter'),

                    /**
                     * @name GridBaseOptions.filterPanel.texts.filterEnabledHint
                     * @type string
                     * @default "Enable the filter"
                     */
                    filterEnabledHint: messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint'),
                }
            },
        };
    },
    views: {
        filterPanelView: FilterPanelView
    },
    extenders: {
        controllers: {
            data: {
                optionChanged: function(args) {
                    switch(args.name) {
                        case 'filterPanel':
                            this._applyFilter();
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args);
                    }
                }
            }
        }
    }
};
