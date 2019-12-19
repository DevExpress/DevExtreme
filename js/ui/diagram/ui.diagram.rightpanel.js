import $ from '../../core/renderer';
import DiagramPanel from './diagram.panel';
import Accordion from '../accordion';
import Form from '../form';
import DiagramCommands from './ui.diagram.commands';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../localization/message';
import DiagramBar from './diagram_bar';
import ScrollView from '../scroll_view';
import { Deferred } from '../../core/utils/deferred';

const DIAGRAM_RIGHT_PANEL_CLASS = 'dx-diagram-right-panel';
const DIAGRAM_RIGHT_PANEL_BEGIN_GROUP_CLASS = 'dx-diagram-right-panel-begin-group';

class DiagramRightPanel extends DiagramPanel {
    _init() {
        super._init();
        this.bar = new OptionsDiagramBar(this);
        this._valueConverters = {};
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_RIGHT_PANEL_CLASS);
        const $scrollViewWrapper = $('<div>')
            .appendTo(this.$element());
        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView);
        const $accordion = $('<div>')
            .appendTo(this._scrollView.content());

        this._renderAccordion($accordion);
    }
    _getAccordionDataSource() {
        return [{
            title: messageLocalization.format('dxDiagram-commandProperties'),
            onTemplate: (widget, $element) => widget._renderOptions($element)
        }];
    }
    _renderAccordion($container) {
        this._accordionInstance = this._createComponent($container, Accordion, {
            multiple: true,
            collapsible: true,
            displayExpr: 'title',
            dataSource: this._getAccordionDataSource(),
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element),
            onContentReady: (e) => {
                this._updateScrollAnimateSubscription(e.component);
            }
        });
    }
    _updateScrollAnimateSubscription(component) {
        component._deferredAnimate = new Deferred();
        component._deferredAnimate.done(() => {
            this._scrollView.update();
            this._updateScrollAnimateSubscription(component);
        });
    }
    _renderOptions($container) {
        var commands = DiagramCommands.getPropertyPanelCommands(this.option('propertyGroups'));
        this._formInstance = this._createComponent($container, Form, {
            items: commands.map(item => {
                return extend(true, {
                    editorType: item.widget,
                    dataField: item.command.toString(),
                    cssClass: item.beginGroup && DIAGRAM_RIGHT_PANEL_BEGIN_GROUP_CLASS,
                    label: {
                        text: item.text
                    },
                    options: {
                        text: item.text,
                        hint: item.hint,
                        icon: item.icon,
                        onInitialized: (e) => this._onToolbarItemInitialized(e.component, item.command)
                    }
                }, this._createWidgetOptions(item));
            }),
            onFieldDataChanged: (e) => this._onDiagramOptionChanged(e.dataField, e.value)
        });
    }
    _createWidgetOptions(item) {
        if(item.getValue && item.setValue) {
            this._valueConverters[item.command] = { getValue: item.getValue, setValue: item.setValue };
        }
        if(item.widget === 'dxSelectBox') {
            return {
                editorOptions: {
                    dataSource: item.items,
                    displayExpr: 'title',
                    valueExpr: 'value'
                }
            };
        }
    }
    _onDiagramOptionChanged(key, value) {
        if(!this._updateLocked && value !== undefined) {
            const valueConverter = this._valueConverters[key];
            if(valueConverter) {
                value = valueConverter.getValue(value);
            }
            this.bar.raiseBarCommandExecuted(parseInt(key), value);
        }
    }
    _setItemValue(key, value) {
        const valueConverter = this._valueConverters[key];
        if(valueConverter) {
            value = valueConverter.setValue(value);
        }
        this._updateLocked = true;
        this._formInstance.updateData(key.toString(), value);
        this._updateLocked = false;
    }
    _setItemSubItems(key, items) {
        this._updateLocked = true;
        var editorInstance = this._formInstance.getEditor(key.toString());
        if(editorInstance) {
            editorInstance.option('items', items.map(item => {
                var value = (typeof item.value === 'object') ? JSON.stringify(item.value) : item.value;
                return {
                    'value': value,
                    'title': item.text
                };
            }));
        }
        this._updateLocked = false;
    }
    _setEnabled(enabled) {
        this._formInstance.option('disabled', !enabled);
    }
    _setItemEnabled(key, enabled) {
        var editorInstance = this._formInstance.getEditor(key.toString());
        if(editorInstance) editorInstance.option('disabled', !enabled);
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'propertyGroups':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            container: null
        });
    }
}

class OptionsDiagramBar extends DiagramBar {
    getCommandKeys() {
        return DiagramCommands.getPropertyPanelCommands().map(c => c.command);
    }
    setItemValue(key, value) {
        this._owner._setItemValue(key, value);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setItemSubItems(key, items) {
        this._owner._setItemSubItems(key, items);
    }
}

module.exports = DiagramRightPanel;
