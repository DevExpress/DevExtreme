import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import ScrollView from '../scroll_view';
import TabPanel from '../tab_panel';

import DiagramFloatingPanel from './ui.diagram.floating_panel';
import DiagramCommandsManager from './diagram.commands_manager';

const DIAGRAM_PROPERTIES_POPUP_WIDTH = 420;
const DIAGRAM_PROPERTIES_POPUP_HEIGHT = 340;
const DIAGRAM_PROPERTIES_POPUP_CLASS = 'dx-diagram-properties-popup';
const DIAGRAM_PROPERTIES_PANEL_CLASS = 'dx-diagram-properties-panel';
const DIAGRAM_PROPERTIES_PANEL_NO_TABS_CLASS = 'dx-diagram-properties-panel-no-tabs';
const DIAGRAM_PROPERTIES_PANEL_GROUP_TITLE_CLASS = 'dx-diagram-properties-panel-group-title';
const DIAGRAM_PROPERTIES_PANEL_GROUP_TOOLBAR_CLASS = 'dx-diagram-properties-panel-group-toolbar';

class DiagramPropertiesPanel extends DiagramFloatingPanel {
    _init() {
        super._init();

        this._commandGroups = DiagramCommandsManager.getPropertyPanelCommandGroups(this.option('propertyGroups'));
        this._createOnCreateToolbar();
        this._createOnSelectedGroupChanged();
        this._createOnVisibilityChangingAction();
    }
    _initMarkup() {
        this._toolbars = [];
        this._selectedToolbar = undefined;

        super._initMarkup();
    }
    _getPopupClass() {
        return DIAGRAM_PROPERTIES_POPUP_CLASS;
    }
    _getPopupOptions() {
        return extend(super._getPopupOptions(), {
            width: DIAGRAM_PROPERTIES_POPUP_WIDTH,
            height: DIAGRAM_PROPERTIES_POPUP_HEIGHT,
            showTitle: false,
            resizeEnabled: true,
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
        if(this._commandGroups.length < 2) {
            $panel.addClass(DIAGRAM_PROPERTIES_PANEL_NO_TABS_CLASS);
        }
        this._renderTabPanel($panel);
    }
    _renderTabPanel($parent) {
        const $tabPanel = $('<div>')
            .appendTo($parent);
        this._tabPanel = this._createComponent($tabPanel, TabPanel, {
            focusStateEnabled: false,
            dataSource: this._commandGroups,
            itemTemplate: (data, index, $element) => {
                const $scrollViewWrapper = $('<div>')
                    .appendTo($element);
                this._scrollView = this._createComponent($scrollViewWrapper, ScrollView, {
                    height: this._scrollViewHeight
                });
                this._renderTabPanelItemContent(this._scrollView.content(), data, index);
            },
            onSelectionChanged: (e) => {
                this._onSelectedGroupChangedAction();
            },
            onContentReady: (e) => {
                this._popup.option('height', e.component.$element().height() + this._getVerticalPaddingsAndBorders());
                if(this._scrollView) {
                    this._scrollViewHeight = this._scrollView.$element().outerHeight();
                    this._scrollView.option('height',);
                }
            }
        });
    }
    _renderTabPanelItemContent($parent, group, index) {
        if(group.groups) {
            group.groups.forEach((sg, si) => {
                this._renderTabPanelItemContentGroup($parent, index, sg.title, sg.commands);
            });
        } else if(group.commands) {
            this._renderTabPanelItemContentGroup($parent, index, undefined, group.commands);
        }
    }
    _renderTabPanelItemContentGroup($parent, index, title, commands) {
        if(title) {
            $('<div>')
                .addClass(DIAGRAM_PROPERTIES_PANEL_GROUP_TITLE_CLASS)
                .appendTo($parent)
                .text(title);
        }
        const $toolbar = $('<div>')
            .addClass(DIAGRAM_PROPERTIES_PANEL_GROUP_TOOLBAR_CLASS)
            .appendTo($parent);
        const args = {
            $parent: $toolbar,
            commands: commands
        };
        this._onCreateToolbarAction(args);
        if(!this._toolbars[index]) {
            this._toolbars[index] = [];
        }
        this._toolbars[index].push(args.toolbar);
        this._selectedToolbar = args.toolbar;
    }
    getActiveToolbars() {
        return this._toolbars[this._tabPanel.option('selectedIndex')];
    }

    _createOnCreateToolbar() {
        this._onCreateToolbarAction = this._createActionByOption('onCreateToolbar');
    }
    _createOnSelectedGroupChanged() {
        this._onSelectedGroupChangedAction = this._createActionByOption('onSelectedGroupChanged');
    }
    _createOnVisibilityChangingAction() {
        this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onCreateToolbar':
                this._createOnCreateToolbar();
                break;
            case 'onSelectedGroupChanged':
                this._createOnSelectedGroupChanged();
                break;
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

module.exports = DiagramPropertiesPanel;
