import $ from 'jquery';
import fx from 'common/core/animation/fx';
import Toolbar from 'ui/toolbar';

const BUTTON_CLASS = 'dx-button';
const BUTTON_CONTENT_CLASS = 'dx-button-content';
const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';

export const runThemesSharedTests = function(moduleNamePostfix) {
    QUnit.module('Scenarios.' + moduleNamePostfix, {
        beforeEach: function() {
            $('#qunit-fixture').html('<div id="toolbar"></div>');
            fx.off = true;
        },
        afterEach: function() {
            fx.off = false;
        }
    }, function() {
        const configs = [];
        [false, true].forEach((rtlEnabled) => {
            ['before', 'center', 'after'].forEach((location) => {
                ['always', 'inMenu'].forEach((showText) => {
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
            QUnit.test(`Buttons in menu: - config ${config.message} width: 50`, function(assert) {
                const toolbarOptions = {
                    items: [{
                        location: config.location,
                        widget: 'dxButton',
                        locateInMenu: config.locateInMenu,
                        showText: config.showText,
                        options: { icon: 'home', text: `text(${config.locateInMenu})` }
                    }]
                };

                const toolbarElement = $('#toolbar').get(0);
                new Toolbar(toolbarElement, {
                    ...toolbarOptions,
                    width: 50,
                    rtlEnabled: config.rtlEnabled
                });

                const dropDownMenuElement = toolbarElement.querySelector(`.${DROP_DOWN_MENU_CLASS}`);
                if(config.locateInMenu === 'never') {
                    assert.strictEqual(dropDownMenuElement, null, 'dropDownMenuElement not rendered in menu');
                } else {
                    $(dropDownMenuElement).trigger('dxclick');

                    const dropDownMenuListElement = $(`.${DROP_DOWN_MENU_LIST_CLASS}`).get(0);
                    const dropDownMenuRect = dropDownMenuListElement.getBoundingClientRect();
                    const menuButtonElement = dropDownMenuListElement.querySelector(`.${BUTTON_CLASS}`);

                    const expectedItemWidth = dropDownMenuRect.width - 2;

                    const buttonRect = menuButtonElement.getBoundingClientRect();
                    assert.strictEqual(buttonRect.width, expectedItemWidth, `button.width ${expectedItemWidth}`);
                    assert.strictEqual(window.getComputedStyle(menuButtonElement.querySelector(`.${BUTTON_CONTENT_CLASS}`)).justifyContent, 'flex-start', 'buttonContent.justifyContent');
                }
            });
        });
    });
};
