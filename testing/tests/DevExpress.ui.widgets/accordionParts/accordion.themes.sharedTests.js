import $ from 'jquery';
import 'ui/accordion';
import 'ui/button';

const TITLE_CAPTION_CLASS = 'dx-accordion-item-title-caption';
const ICON_CLASS = 'dx-icon';

export const runThemesSharedTests = function(moduleNamePostfix) {
    QUnit.module('Scenarios.' + moduleNamePostfix, {
        beforeEach: function() {
            $('#qunit-fixture').html('<div id="accordion"></div>');
        }
    }, function() {
        QUnit.test('itemTitleTemplate: dxButton { icon }', function(assert) {
            $('#accordion').dxAccordion({
                dataSource: [{ }],
                itemTitleTemplate: function() {
                    return $('<div>').dxButton({ icon: 'myIcon' });
                }
            });

            const iconRect = document.querySelector('.dx-icon-myIcon').getBoundingClientRect();
            const iconParentRect = document.querySelector('.dx-icon-myIcon').parentElement.getBoundingClientRect();

            assert.roughEqual(iconRect.left - iconParentRect.left, iconParentRect.right - iconRect.right, 0.1, `correct horizontal centering ${JSON.stringify(iconRect)} in ${JSON.stringify(iconParentRect)}`);
            assert.roughEqual(iconRect.top - iconParentRect.top, iconParentRect.bottom - iconRect.bottom, 0.1, `correct vertical centering ${JSON.stringify(iconRect)} in ${JSON.stringify(iconParentRect)}`);
        });

        QUnit.test('dataSource: { title, icon }', function(assert) {
            const $accordion = $('#accordion').dxAccordion({
                dataSource: [{ title: 'Caption', icon: 'remove' }],
            });

            const iconRect = $accordion.find(`.${TITLE_CAPTION_CLASS} .${ICON_CLASS}`).get(0).getBoundingClientRect();
            const textRect = $accordion.find(`.${TITLE_CAPTION_CLASS} span`).get(0).getBoundingClientRect();

            const epsilon = 1.6;
            assert.roughEqual(iconRect.top + iconRect.height / 2, textRect.top + textRect.height / 2, epsilon, `correct vertical centering of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);
            assert.roughEqual(textRect.left - iconRect.left - iconRect.width, iconRect.width / 3, epsilon, `correct horizontal aligment of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);
        });
    });
};
