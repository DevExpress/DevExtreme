import $ from 'jquery';
import fx from 'animation/fx';
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
            $('#qunit-fixture').html('<div id="toolbar"></div>');
            fx.off = true;
        },
        afterEach: function() {
            fx.off = false;
        }
    }, function() {
        [false, true].forEach((rtlEnabled) => {
            // T886693
            QUnit.test(`Buttons in menu: - rtlEnabled: ${rtlEnabled} width: 50`, function(assert) {
                const toolbarOptions = {
                    items: [{
                        widget: 'dxButton',
                        locateInMenu: 'always',
                        options: { icon: 'plus', text: 'button text' }
                    }]
                };

                const toolbarElement = document.getElementById('toolbar');
                new Toolbar(toolbarElement, {
                    ...toolbarOptions,
                    width: 50,
                    rtlEnabled: rtlEnabled
                });

                const dropDownMenuElement = toolbarElement.querySelector(`.${DROP_DOWN_MENU_CLASS}`);

                const dropDown = DropDownMenu.getInstance(dropDownMenuElement);
                dropDown.open();

                const dropDownMenuListElement = document.querySelector(`.${DROP_DOWN_MENU_LIST_CLASS}`);
                const dropDownMenuRect = dropDownMenuListElement.getBoundingClientRect();
                const menuButtonElement = dropDownMenuListElement.querySelector(`.${BUTTON_CLASS}`);

                const expectedItemWidth = dropDownMenuRect.width - 2;

                const buttonRect = menuButtonElement.getBoundingClientRect();
                assert.strictEqual(buttonRect.width, expectedItemWidth, `button.width ${expectedItemWidth}`);
                assert.strictEqual(window.getComputedStyle(menuButtonElement.querySelector(`.${BUTTON_CONTENT_CLASS}`)).textAlign, rtlEnabled ? 'right' : 'left', 'buttonContent.textAlign');
            });
        });
    });
};
