import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import messageLocalization from '../../localization/message';
import Accordion from '../accordion';
import Form from '../form';
import ScrollView from '../scroll_view';

import DiagramBar from './diagram.bar';
import DiagramFloatingPanel from './ui.diagram.floating_panel';
import DiagramCommandsManager from './diagram.commands_manager';

const DIAGRAM_PROPERTIES_POPUP_WIDTH = 330;
const DIAGRAM_PROPERTIES_POPUP_HEIGHT = 350;
const DIAGRAM_PROPERTIES_POPUP_CLASS = 'dx-diagram-properties-popup';
const DIAGRAM_PROPERTIES_PANEL_CLASS = 'dx-diagram-properties-panel';
const DIAGRAM_PROPERTIES_PANEL_BEGIN_GROUP_CLASS = 'dx-diagram-properties-panel-begin-group';


class DiagramPropertiesPanel extends DiagramFloatingPanel {
    _init() {
        super._init();

        this.bar = new OptionsDiagramBar(this);
        this._valueConverters = {};
        this._createOnVisibilityChangingAction();
    }
    _getPopupClass() {
        return DIAGRAM_PROPERTIES_POPUP_CLASS;
    }
    _getPopupOptions() {
        return extend(super._getPopupOptions(), {
            width: DIAGRAM_PROPERTIES_POPUP_WIDTH,
            height: DIAGRAM_PROPERTIES_POPUP_HEIGHT,
            showTitle: false,
            onShowing: (e) => {
                if(this._inOnShowing === true) return;

                this._inOnShowing = true;
                this._onVisibilityChangingAction({ visible: true, component: this });
                delete this._inOnShowing;
            }
        });
    }
    _renderPopupContent($parent) {
        const $panel = $('<div>')
            .addClass(DIAGRAM_PROPERTIES_PANEL_CLASS)
            .appendTo($parent);
        this._renderScrollView($panel);
    }
    _renderScrollView($parent) {
        const $scrollViewWrapper = $('<div>')
            .appendTo($parent);
        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView);
        const $accordion = $('<div>')
            .appendTo(this._scrollView.content());

        this._renderAccordion($accordion);
    }
    _getAccordionDataSource() {
        return [{
            title: messageLocalization.format('dxDiagram-uiProperties'),
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
        const commands = DiagramCommandsManager.getPropertyPanelCommands(this.option('propertyGroups'));
        this._formInstance = this._createComponent($container, Form, {
            items: commands.map(item => {
                return extend(true, {
                    editorType: item.widget,
                    dataField: item.command.toString(),
                    cssClass: item.beginGroup && DIAGRAM_PROPERTIES_PANEL_BEGIN_GROUP_CLASS,
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
        const editorInstance = this._formInstance.getEditor(key.toString());
        if(editorInstance) {
            editorInstance.option('items', items.map(item => {
                const value = (typeof item.value === 'object') ? JSON.stringify(item.value) : item.value;
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
        const editorInstance = this._formInstance.getEditor(key.toString());
        if(editorInstance) editorInstance.option('disabled', !enabled);
    }
    isVisible() {
        return this._inOnShowing;
    }
    _createOnVisibilityChangingAction() {
        this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onVisibilityChanging':
                this._createOnVisibilityChangingAction();
                break;
            case 'propertyGroups':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

class OptionsDiagramBar extends DiagramBar {
    getCommandKeys() {
        return DiagramCommandsManager.getPropertyPanelCommands().map(c => c.command);
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
    isVisible() {
        return this._owner.isVisible();
    }
}

module.exports = DiagramPropertiesPanel;
