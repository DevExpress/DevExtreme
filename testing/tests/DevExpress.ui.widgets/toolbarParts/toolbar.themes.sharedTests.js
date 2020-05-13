import $ from 'jquery';
import Toolbar from 'ui/toolbar';
import DropDownMenu from 'ui/drop_down_menu';
import 'ui/button';

const BUTTON_CLASS = 'dx-button';
const BUTTON_CONTENT_CLASS = 'dx-button-content';
const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';

export const runThemesSharedTests = function(moduleNamePostfix) {
    QUnit.module('Scenarios.' + moduleNamePostfix, {
        beforeEach: function() {
            $('#qunit-fixture').css('position', 'initial').html('<div id="toolbar"></div>');
        }
    }, function() {
        const configs = [];
        [false, true].forEach((rtlEnabled) => {
            ['before', 'center', 'after'].forEach((location) => {
                ['inMenu'].forEach((showText) => {
                    ['always', 'auto', 'never'].forEach((locateInMenu) => {
                        const config = { rtlEnabled, location, showText, locateInMenu };
                        config.message = Object.keys(config).reduce((message, key) => message += `${key}: ${config[key]}, `, '');
                        configs.push(config);
                    });
                });
            });
        });

        configs.forEach((config) => {
            // T886693
            QUnit.test(`Button styling in menu: - config ${config.message} width: 50`, function(assert) {
                const toolbarOptions = {
                    items: [{
                        location: config.location,
                        widget: 'dxButton',
                        locateInMenu: config.locateInMenu,
                        showText: config.showText,
                        options: { icon: 'plus', text: `text(${config.locateInMenu})` }
                    }]
                };

                const toolbarElement = document.getElementById('toolbar');
                new Toolbar(toolbarElement, {
                    ...toolbarOptions,
                    width: 50,
                    rtlEnabled: config.rtlEnabled
                });

                const dropDownMenuElement = toolbarElement.querySelector(`.${DROP_DOWN_MENU_CLASS}`);
                if(config.locateInMenu === 'never') {
                    assert.strictEqual(dropDownMenuElement, null, 'dropDownMenuElement not rendered');
                } else {
                    const dropDown = DropDownMenu.getInstance(dropDownMenuElement);
                    dropDown.open();

                    const dropDownMenuList = document.querySelector(`.${DROP_DOWN_MENU_LIST_CLASS}`);
                    const dropDownMenuRect = dropDownMenuList.getBoundingClientRect();
                    const menuButtons = dropDownMenuList.querySelectorAll(`.${BUTTON_CLASS}`);

                    const expectedItemWidth = dropDownMenuRect.width - 2;

                    [...menuButtons].forEach((button) => {
                        const itemRect = button.getBoundingClientRect();
                        assert.strictEqual(itemRect.width, expectedItemWidth, 'button.width');
                        assert.strictEqual(window.getComputedStyle(button.querySelector(`.${BUTTON_CONTENT_CLASS}`)).textAlign, config.rtlEnabled ? 'right' : 'left', 'buttonContent.textAlign');
                    });
                }
            });
        });
    });
};
