import $ from 'jquery';
import config from 'core/config';
import repaintFloatingActionButton from 'ui/speed_dial_action/repaint_floating_action_button';
import fx from 'common/core/animation/fx';

import 'ui/speed_dial_action';
import 'generic_light.css!';

const { test } = QUnit;

QUnit.testStart(() => {
    const markup =
        '<div id="fab-one"></div>\
        <div id="fab-two"></div>';

    $('#qunit-fixture').html(markup);
});

const FAB_MAIN_CLASS = 'dx-fa-button-main';
const FAB_SELECTOR = '.dx-fa-button';
const FAB_LABEL_SELECTOR = '.dx-fa-button-label';

QUnit.module('apply current config options', (hooks) => {
    hooks.beforeEach(() => {
        fx.off = true;
    }),
    hooks.afterEach(() => {
        config({
            floatingActionButtonConfig: {
                direction: 'top',
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        fx.off = false;
    }),

    test('repaint with multiple actions', function(assert) {
        $('#fab-one').dxSpeedDialAction();
        $('#fab-two').dxSpeedDialAction();

        let $fabMainContent = $('.' + FAB_MAIN_CLASS).find('.dx-overlay-content');
        let $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');
        const fabMainDimensions = 64;

        assert.equal($fabMainContent.offset().top, $(window).height() - fabMainDimensions, 'default position top');
        assert.equal($fabMainContent.offset().left, $(window).width() - fabMainDimensions, 'default position left');
        assert.equal($fabMainContent.find('.dx-icon-add').length, 1, 'default icon');
        assert.equal($fabMainContent.find('.dx-icon-close').length, 1, 'default close icon');

        const fabItemDimensions = 30;

        $fabMainContent.trigger('dxclick');

        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabItemDimensions, 80, 'right first action position');
        assert.equal($(window).height() - $fabContent.eq(2).offset().top - fabItemDimensions, 120, 'right second action position');

        config({
            floatingActionButtonConfig: {
                shading: true,
                direction: 'down',
                position: 'left top',
                icon: 'edit',
                closeIcon: 'cancel'
            }
        });

        repaintFloatingActionButton();

        $fabMainContent = $('.' + FAB_MAIN_CLASS).find('.dx-overlay-content');

        assert.equal($fabMainContent.find('.dx-icon-edit').length, 1, 'default icon is changed');
        assert.equal($fabMainContent.find('.dx-icon-cancel').length, 1, 'default close icon is changed');
        assert.equal($fabMainContent.offset().top, 0, 'default position top is changed');
        assert.equal($fabMainContent.offset().left, 0, 'default position left is changed');
        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 0, 'there is not shading before FAB click');

        $fabMainContent.trigger('dxclick');

        $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 1, 'there is shading after FAB click');

        assert.equal($fabContent.eq(1).offset().top, 64, 'right first action position');
        assert.equal($fabContent.eq(2).offset().top, 104, 'right second action position');
    });

    test('repaint with one action', function(assert) {
        $('#fab-one').dxSpeedDialAction({ icon: 'trash', label: 'Delete' });
        $('#fab-two').dxSpeedDialAction({ visible: false });

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const fabOffset = 16;

        assert.equal($fabMainContent.offset().top, $(window).height() - $fabMainContent.height() - fabOffset, 'default position top');
        assert.equal($fabMainContent.offset().left, Math.round($(window).width() - $fabMainContent.width() - fabOffset), 'default position left');
        assert.equal($fabMainContent.find('.dx-icon-trash').length, 1, 'icon is from SDA options');
        assert.equal($fabMainContent.find(FAB_LABEL_SELECTOR).eq(0).text(), 'Delete', 'label is from SDA options');

        config({
            floatingActionButtonConfig: {
                position: 'left top',
                icon: 'edit',
                closeIcon: 'cancel'
            }
        });

        repaintFloatingActionButton();

        assert.equal($fabMainContent.find(FAB_LABEL_SELECTOR).eq(0).text(), 'Delete', 'label is also from SDA options');
        assert.equal($fabMainContent.find('.dx-icon-trash').length, 1, 'icon is also from SDA options');
        assert.equal($fabMainContent.find('.dx-icon-cancel').length, 1, 'close icon is changed');
        assert.equal($fabMainContent.offset().top, 0, 'position top is changed');
        assert.equal($fabMainContent.offset().left, 0, 'position left is changed');
    });
});
