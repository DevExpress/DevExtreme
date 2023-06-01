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

            const iconRect = $('.dx-icon-myIcon').get(0).getBoundingClientRect();
            const iconParentRect = $('.dx-icon-myIcon').get(0).parentElement.getBoundingClientRect();

            assert.roughEqual(iconRect.left - iconParentRect.left, iconParentRect.right - iconRect.right, 0.1, `correct horizontal centering ${JSON.stringify(iconRect)} in ${JSON.stringify(iconParentRect)}`);
            assert.roughEqual(iconRect.top - iconParentRect.top, iconParentRect.bottom - iconRect.bottom, 0.1, `correct vertical centering ${JSON.stringify(iconRect)} in ${JSON.stringify(iconParentRect)}`);
        });
    });
};
