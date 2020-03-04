import $ from 'jquery';
import 'ui/accordion';
import 'ui/button';

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

            const epsilon = 2;
            const iconRect = $accordion.find('.dx-accordion-item-title-caption .dx-icon').get(0).getBoundingClientRect();
            const textRect = $accordion.find('.dx-accordion-item-title-caption span').get(0).getBoundingClientRect();

            assert.roughEqual(iconRect.top + iconRect.height / 2, textRect.top + textRect.height / 2, epsilon, `correct vertical centering of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);
            assert.roughEqual(textRect.left - iconRect.left - iconRect.width, iconRect.width / 3, 2, `correct horizontal aligment of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);
        });
    });
};
