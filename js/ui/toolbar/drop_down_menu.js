import { getHeight, setHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import devices from '../../core/devices';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import Widget from '../widget/ui.widget';
import Button from '../button';
import Popover from '../popover';
import ToolbarMenuList from './ui.toolbar.menu.list';
import { isMaterial } from '../themes';
import { ChildDefaultTemplate } from '../../core/templates/child_default_template';
import { toggleItemFocusableElementTabIndex } from './ui.toolbar.utils';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';

class DropDownMenu extends Widget {
    _supportedKeys() {
        let extension = {};

        if(!this.option('opened') || !this._list.option('focusedElement')) {
            extension = this._button._supportedKeys();
        }

        return extend(super._supportedKeys(), extension, {
            tab: function() {
                this._popup && this._popup.hide();
            }
        });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            items: [],
            onItemClick: null,
            dataSource: null,
            itemTemplate: 'item',
            onButtonClick: null,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            opened: false,
            onItemRendered: null,
            closeOnClick: true,
            useInkRipple: false,
            container: undefined,
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    useInkRipple: true,
                    popupAnimation: {
                        show: {
                            type: 'pop',
                            duration: 200,
                            from: { scale: 0 },
                            to: { scale: 1 }
                        },
                        hide: {
                            type: 'pop',
                            duration: 200,
                            from: { scale: 1 },
                            to: { scale: 0 }
                        }
                    }
                }
            },
        ]);
    }

    _init() {
        super._init();

        this.$element().addClass(DROP_DOWN_MENU_CLASS);

        this._initItemClickAction();
        this._initButtonClickAction();
    }

    _initItemClickAction() {
        this._itemClickAction = this._createActionByOption('onItemClick');
    }

    _initButtonClickAction() {
        this._buttonClickAction = this._createActionByOption('onButtonClick');
    }

    _initTemplates() {
        this._templateManager.addDefaultTemplates({
            content: new ChildDefaultTemplate('content')
        });
        super._initTemplates();
    }

    _initMarkup() {
        this._renderButton();
        super._initMarkup();
    }

    _render() {
        super._render();
        this.setAria({
            'role': 'menubar',
            'haspopup': true,
            'expanded': this.option('opened')
        });
    }

    _renderContentImpl() {
        if(this.option('opened')) {
            this._renderPopup();
        }
    }

    _clean() {
        this._cleanFocusState();

        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove();

        delete this._list;
        delete this._popup;
    }

    _renderButton() {
        const $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS);

        this._button = this._createComponent($button, Button, {
            icon: 'overflow',
            template: 'content',
            useInkRipple: this.option('useInkRipple'),
            hoverStateEnabled: false,
            focusStateEnabled: false,
            onClick: (function(e) {
                this.option('opened', !this.option('opened'));
                this._buttonClickAction(e);
            }).bind(this)
        });
    }

    _toggleActiveState($element, value, e) {
        this._button._toggleActiveState($element, value, e);
    }

    _toggleMenuVisibility(opened) {
        const state = opened ?? !this._popup.option('visible');

        if(opened) {
            this._renderPopup();
        }

        this._popup.toggle(state);
        this.setAria('expanded', state);
    }

    _renderPopup() {
        if(this._$popup) {
            return;
        }

        const $popup = this._$popup = $('<div>').appendTo(this.$element());

        this._popup = this._createComponent($popup, Popover, {
            onInitialized(args) {
                args.component.$wrapper()
                    .addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS)
                    .addClass(DROP_DOWN_MENU_POPUP_CLASS);
            },
            visible: this.option('opened'),
            deferRendering: false,
            contentTemplate: (function(contentElement) {
                this._renderList(contentElement);
            }).bind(this),
            position: {
                my: `top ${this.option('rtlEnabled') ? 'left' : 'right'}`,
                at: `bottom ${this.option('rtlEnabled') ? 'left' : 'right'}`,
                collision: 'fit flip',
                offset: { v: 4 }
            },
            animation: this.option('popupAnimation'),
            onOptionChanged: (function(args) {
                if(args.name === 'visible') {
                    this.option('opened', args.value);
                }
            }).bind(this),
            target: this.$element(),
            height: 'auto',
            width: 'auto',
            container: this.option('container'),
            autoResizeEnabled: false
        });
    }

    _renderList(contentElement) {
        const $content = $(contentElement);
        $content.addClass(DROP_DOWN_MENU_LIST_CLASS);

        this._list = this._createComponent($content, ToolbarMenuList, {
            dataSource: this._getListDataSource(),
            pageLoadMode: 'scrollBottom',
            indicateLoading: false,
            noDataText: '',
            itemTemplate: this.option('itemTemplate'),
            onItemClick: (function(e) {
                if(this.option('closeOnClick')) {
                    this.option('opened', false);
                }
                this._itemClickAction(e);
            }).bind(this),
            tabIndex: -1,
            focusStateEnabled: this.option('focusStateEnabled'),
            activeStateEnabled: true,
            onItemRendered: this.option('onItemRendered'),
            _areaTarget: this.$element(),
            _itemAttributes: { role: 'menuitem' }
        });

        const listMaxHeight = getHeight(getWindow()) * 0.5;
        if(getHeight($content) > listMaxHeight) {
            setHeight($content, listMaxHeight);
        }
    }

    _itemOptionChanged(item, property, value) {
        this._list?._itemOptionChanged(item, property, value);
        toggleItemFocusableElementTabIndex(this._list, item);
    }

    _getListDataSource() {
        return this.option('dataSource') ?? this.option('items');
    }

    _setListDataSource() {
        this._list?.option('dataSource', this._getListDataSource());

        delete this._deferRendering;
    }

    _getKeyboardListeners() {
        return super._getKeyboardListeners().concat([this._list]);
    }

    _toggleVisibility(visible) {
        super._toggleVisibility(visible);
        this._button.option('visible', visible);
    }

    _optionChanged(args) {
        const { name, value } = args;

        switch(name) {
            case 'items':
            case 'dataSource':
                if(!this.option('opened')) {
                    this._deferRendering = true;
                } else {
                    this._setListDataSource();
                }
                break;
            case 'itemTemplate':
                this._list?.option(name, this._getTemplate(value));
                break;
            case 'onItemClick':
                this._initItemClickAction();
                break;
            case 'onButtonClick':
                this._buttonClickAction();
                break;
            case 'useInkRipple':
                this._invalidate();
                break;
            case 'focusStateEnabled':
                this._list?.option(name, value);
                super._optionChanged(args);
                break;
            case 'onItemRendered':
                this._list?.option(name, value);
                break;
            case 'opened':
                if(this._deferRendering) {
                    this._setListDataSource();
                }

                this._toggleMenuVisibility(value);
                this._updateFocusableItemsTabIndex();
                break;
            case 'closeOnClick':
                break;
            case 'container':
                this._popup && this._popup.option(args.name, args.value);
                break;
            case 'disabled':
                if(this._list) {
                    this._updateFocusableItemsTabIndex();
                }
                break;
            default:
                super._optionChanged(args);
        }
    }

    _updateFocusableItemsTabIndex() {
        this.option('items').forEach(item => toggleItemFocusableElementTabIndex(this._list, item));
    }

    open() {
        this.option('opened', true);
    }

    close() {
        this.option('opened', false);
    }
}

registerComponent('dxDropDownMenu', DropDownMenu);

export default DropDownMenu;
