import $ from 'jquery';
import 'ui/accordion';
import 'ui/button';

const ACCORDION_ITEM_TITLE_CAPTION_CLASS = 'dx-accordion-item-title-caption';
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

        [true, false].forEach(rtlEnabled => {
            QUnit.test(`rtlEnabled: ${rtlEnabled}, dataSource: { title, icon }`, function(assert) {
                const $accordion = $('#accordion').dxAccordion({
                    rtlEnabled,
                    dataSource: [{ title: 'Caption', icon: 'remove' }],
                });
                const $accordionTitle = $accordion.find(`.${ACCORDION_ITEM_TITLE_CAPTION_CLASS}`);

                const TEXT_NODE_TYPE = 3;
                $accordionTitle.contents()
                    .filter((index, node) => { return node.nodeType === TEXT_NODE_TYPE; })
                    .wrap('<span/>');

                const iconRect = $accordionTitle.find(`.${ICON_CLASS}`).get(0).getBoundingClientRect();
                const textRect = $accordionTitle.find('span').get(0).getBoundingClientRect();

                const epsilon = 0.6;
                const icon_inner_shift = 1;
                assert.roughEqual((iconRect.top + iconRect.height / 2) - icon_inner_shift, textRect.top + textRect.height / 2, epsilon, `correct vertical centering of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);

                const horizontalMargin = rtlEnabled
                    ? iconRect.right - textRect.right - iconRect.width
                    : textRect.left - iconRect.left - iconRect.width;
                assert.roughEqual(horizontalMargin, iconRect.width / 3, epsilon, `correct horizontal alignment of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);
            });
        });
    });
};
