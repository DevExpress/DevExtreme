import $ from 'jquery';
import config from 'core/config';
import fx from 'common/core/animation/fx';
import SpeedDialItem from '__internal/ui/speed_dial_action/m_speed_dial_item';
import { logger } from 'core/utils/console';

import 'ui/speed_dial_action';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="fab-one"></div>\
        <div id="fab-two"></div>\
        <div id="fabs"></div>';

    $('#qunit-fixture').html(markup);
});

const FAB_SELECTOR = '.dx-fa-button';
const FAB_MAIN_SELECTOR = '.dx-fa-button-main';
const FAB_LABEL_SELECTOR = '.dx-fa-button-label';
const FAB_CONTENT_REVERSE_CLASS = 'dx-fa-button-content-reverse';
const FAB_INVISIBLE_SELECTOR = '.dx-fa-button.dx-state-invisible';

QUnit.module('create one action', () => {
    QUnit.test('check rendering', function(assert) {
        this.instance = $('#fab-one')
            .dxSpeedDialAction()
            .dxSpeedDialAction('instance');

        const $fabElement = $(FAB_SELECTOR);
        const $fabContent = $fabElement.find('.dx-overlay-content');
        const clickHandler = sinon.spy();

        assert.strictEqual($fabElement.length, 1, 'one action button created');
        assert.ok($fabElement.hasClass(FAB_MAIN_SELECTOR.substr(1)), 'it is main action button');
        assert.equal($fabContent.find('.dx-fa-button-icon').length, 1, 'icon container created');
        assert.equal($fabContent.find('.dx-icon-close').length, 1, 'default close icon created');

        this.instance.option('icon', 'preferences');
        assert.equal($fabContent.find('.dx-icon-preferences').length, 1, 'icon changed');

        this.instance.option('onClick', clickHandler);
        $fabContent.trigger('dxclick');

        assert.ok(clickHandler.calledOnce, 'Handler should be called');
        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, 'Event params should be passed');
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.element, 'Element should be passed');
        assert.ok(params.component, 'Component should be passed');
    });
});

QUnit.module('maxSpeedDialActionCount option', () => {
    QUnit.test('check action buttons count', function(assert) {
        const $container = $('#fabs');
        const fabInstances = [];

        for(let i = 0; i < 8; i++) {
            try {
                fabInstances.push($('<div>')
                    .appendTo($container)
                    .dxSpeedDialAction({ icon: 'favorites' })
                    .dxSpeedDialAction('instance'));
            } catch(error) { }
        }

        assert.equal($(FAB_MAIN_SELECTOR).length, 1, 'one main fab is created');
        assert.equal($(FAB_SELECTOR).length - 1, 5, 'five actions is created');
    });
});

QUnit.module('create multiple actions', {
    afterEach: function() {
        fx.off = false;
    },

    beforeEach: function() {
        const firstElement = $('#fab-one').dxSpeedDialAction({
            icon: 'arrowdown',
            hint: 'Arrow down'
        });
        const secondElement = $('#fab-two').dxSpeedDialAction({
            icon: 'arrowup',
            hint: 'Arrow up'
        });
        this.firstInstance = firstElement.dxSpeedDialAction('instance');
        this.secondInstance = secondElement.dxSpeedDialAction('instance');

        fx.off = true;
    }
}, () => {
    QUnit.test('check rendering', function(assert) {
        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        let $fabElement = $(FAB_SELECTOR);
        let $fabContent = $fabElement.find('.dx-overlay-content');

        assert.strictEqual($fabMainElement.length, 1, 'create one main fab');
        assert.strictEqual($fabElement.length, 3, 'create two actions');

        assert.equal($fabMainElement.attr('title'), undefined, 'default hint empty');
        assert.equal($fabMainContent.find('.dx-icon-add').length, 1, 'default icon is applied');
        assert.equal($fabMainContent.find('.dx-icon-close').length, 1, 'default close is applied');
        assert.equal($fabMainContent.css('zIndex'), 1500, 'right content zIndex');
        assert.equal($fabMainContent.closest('.dx-overlay-wrapper').css('zIndex'), 1500, 'right wrapper zIndex');

        assert.equal($fabElement.eq(1).attr('title'), 'Arrow down', 'first action with right hint');
        assert.equal($fabElement.eq(2).attr('title'), 'Arrow up', 'second action with right hint');
        assert.equal($fabContent.eq(1).find('.dx-icon-arrowdown').length, 1, 'first action with arrowdown icon');
        assert.equal($fabContent.eq(2).find('.dx-icon-arrowup').length, 1, 'second action with arrowup icon');

        this.firstInstance.option('icon', 'find');
        this.secondInstance.option('icon', 'filter');

        $fabElement = $(FAB_SELECTOR);
        $fabContent = $fabElement.find('.dx-overlay-content');

        assert.equal($fabContent.eq(1).find('.dx-icon-find').length, 1, 'first action icon changed on icon find');
        assert.equal($fabContent.eq(2).find('.dx-icon-filter').length, 1, 'second action icon changed on icon filter');

        const fabDimensions = 30;

        $fabMainContent.trigger('dxclick');

        assert.equal($fabContent.eq(1).css('zIndex'), 1500, 'right first action content zIndex');
        assert.equal($fabContent.eq(1).closest('.dx-overlay-wrapper').css('zIndex'), 1500, 'right first action wrapper zIndex');
        assert.equal($fabContent.eq(2).css('zIndex'), 1500, 'right second action content zIndex');
        assert.equal($fabContent.eq(2).closest('.dx-overlay-wrapper').css('zIndex'), 1500, 'right second action wrapper zIndex');

        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabDimensions, 80, 'right first action position');
        assert.equal($(window).height() - $fabContent.eq(2).offset().top - fabDimensions, 120, 'right second action position');

        this.secondInstance.dispose();

        assert.equal($fabMainElement.attr('title'), 'Arrow down', 'hint by first action option');
    });
});

QUnit.module('modify global action button config', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        $('#fab-one').dxSpeedDialAction('instance').dispose();
        $('#fab-two').dxSpeedDialAction('instance').dispose();

        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        fx.off = false;
    }
}, () => {
    QUnit.test('check main fab rendering', function(assert) {
        config({
            floatingActionButtonConfig: {
                icon: 'favorites',
                closeIcon: 'cancel',
                position: 'left top'
            }
        });

        $('#fab-one').dxSpeedDialAction();
        $('#fab-two').dxSpeedDialAction();

        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');

        assert.equal($fabMainContent.find('.dx-icon-favorites').length, 1, 'default icon is changed');
        assert.equal($fabMainContent.find('.dx-icon-cancel').length, 1, 'default close icon is changed');
        assert.equal($fabMainContent.offset().top, 0, 'default position top is changed');
        assert.equal($fabMainContent.offset().left, 0, 'default position left is changed');
    });

    QUnit.test('main button has default icon if config has no icon', function(assert) {
        config({
            floatingActionButtonConfig: { }
        });

        $('#fab-one').dxSpeedDialAction({ icon: 'home' });
        $('#fab-two').dxSpeedDialAction({ icon: 'square' });

        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabMainContentIcons = $fabMainElement.find('.dx-icon');
        assert.equal($fabMainContent.find('.dx-icon-add').length, 1, 'default icon is \'add\'');
        assert.equal($fabMainContentIcons.length, 2, 'only two icons rendered on the main button');
    });

    QUnit.test('check main fab position after change', function(assert) {
        const firstSDA = $('#fab-one').dxSpeedDialAction().dxSpeedDialAction('instance');

        let $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');
        const fabDimensions = 64;

        assert.equal($fabMainContent.offset().top, $(window).height() - fabDimensions, 'one action - default position top');
        assert.equal($fabMainContent.offset().left, $(window).width() - fabDimensions, 'one action - default position left');

        config({
            floatingActionButtonConfig: {
                position: 'left top'
            }
        });

        firstSDA.repaint();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.offset().top, 0, 'one action - correct position top after config change');
        assert.equal($fabMainContent.offset().left, 0, 'one action - correct position left after config change');

        $('#fab-two').dxSpeedDialAction();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.offset().top, 0, 'multiple actions - default position top');
        assert.equal($fabMainContent.offset().left, 0, 'multiple actions - default position left');

        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        firstSDA.repaint();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.offset().top, $(window).height() - fabDimensions, 'multiple actions - correct position top after config change');
        assert.equal($fabMainContent.offset().left, $(window).width() - fabDimensions, 'multiple actions - correct position left after config change');

    });
});

QUnit.module('add or remove action buttons', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        $('#fab-one').dxSpeedDialAction('instance').dispose();
        $('#fab-two').dxSpeedDialAction('instance').dispose();

        fx.off = false;
    }
}, () => {
    QUnit.test('check main fab rendering', function(assert) {
        $('#fab-one').dxSpeedDialAction({
            icon: 'plus',
            hint: 'Add a Row'
        });

        $('#fab-two').dxSpeedDialAction({
            icon: 'trash',
            hint: 'Delete Selected Rows'
        });

        $('#fab-two').dxSpeedDialAction('instance').dispose();

        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabElement = $(FAB_SELECTOR);
        const fabMainOffsetY = 16;

        assert.equal($fabMainContent.parent('.dx-overlay-wrapper').length, 1, 'main action button contain overlay wrapper');
        assert.equal($fabElement.length, 1, 'one action button');
        assert.equal($fabMainContent.find('.dx-icon-plus').length, 1, 'use icon by option');

        $('#fab-one').dxSpeedDialAction('instance').option('icon', 'favorites');

        assert.equal($fabMainContent.find('.dx-icon-favorites').length, 1, 'use icon after change icon option');
        assert.equal($fabMainContent.offset().top, $(window).height() - fabMainOffsetY - $fabMainContent.height(), 'use dafault position after change icon option');

        $('#fab-two').dxSpeedDialAction({
            icon: 'trash',
            hint: 'Delete Selected Rows'
        });

        assert.equal($fabMainContent.offset().top, $(window).height() - fabMainOffsetY - $fabMainContent.height(), 'use dafault position');
    });
});

QUnit.module('check action buttons position', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        $('#fab-one').dxSpeedDialAction('instance').dispose();
        $('#fab-two').dxSpeedDialAction('instance').dispose();

        fx.off = false;
    }
}, () => {
    QUnit.test('position should be absolute if position.of is specified', function(assert) {
        config({
            floatingActionButtonConfig: {
                position: {
                    of: $('#fabs')
                }
            }
        });

        $('#fab-one').dxSpeedDialAction({
            icon: 'plus'
        });

        $('#fab-two').dxSpeedDialAction({
            icon: 'trash'
        });

        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainWrapper = $fabMainElement.find('.dx-overlay-wrapper');
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabElement = $(`${FAB_SELECTOR}:not(${FAB_MAIN_SELECTOR})`);

        $fabMainContent.trigger('dxclick');

        const $fabWrapper = $fabElement.find('.dx-overlay-wrapper');
        const expectedPosition = 'absolute';

        assert.equal($fabMainWrapper.css('position'), expectedPosition, 'position is absolute');
        assert.equal($fabWrapper.eq(0).css('position'), expectedPosition, 'first action has the same position with main fab');
        assert.equal($fabWrapper.eq(1).css('position'), expectedPosition, 'second action has the same position with main fab');
    });

    QUnit.test('position should be fixed if position.of is not specified', function(assert) {
        config({
            floatingActionButtonConfig: {}
        });

        $('#fab-one').dxSpeedDialAction({
            icon: 'plus'
        });

        $('#fab-two').dxSpeedDialAction({
            icon: 'trash'
        });

        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainWrapper = $fabMainElement.find('.dx-overlay-wrapper');
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabElement = $(`${FAB_SELECTOR}:not(${FAB_MAIN_SELECTOR})`);

        $fabMainContent.trigger('dxclick');

        const $fabWrapper = $fabElement.find('.dx-overlay-wrapper');
        const expectedPosition = 'fixed';

        assert.equal($fabMainWrapper.css('position'), expectedPosition, 'position is fixed');
        assert.equal($fabWrapper.eq(0).css('position'), expectedPosition, 'first action has the same position with main fab');
        assert.equal($fabWrapper.eq(1).css('position'), expectedPosition, 'second action has the same position with main fab');
    });
});

QUnit.module('check action buttons click args', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        $('#fab-one').dxSpeedDialAction('instance').dispose();
        $('#fab-two').dxSpeedDialAction('instance').dispose();

        fx.off = false;
    }
}, () => {
    QUnit.test('component', function(assert) {
        const firstSDA = $('#fab-one').dxSpeedDialAction({
            onClick: function(e) {
                assert.equal(e.component, firstSDA, 'component in args matches with first SDA instance');
            }
        }).dxSpeedDialAction('instance');

        const $fabMainElement = $(FAB_MAIN_SELECTOR);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        const secondSDA = $('#fab-two').dxSpeedDialAction({
            icon: 'edit',
            onClick: function(e) {
                assert.equal(e.component, secondSDA, 'component in args matches with second SDA instance');
            }
        }).dxSpeedDialAction('instance');

        const $fabElement = $(FAB_SELECTOR);
        const $fabContent = $fabElement.find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');
        $fabContent.eq(2).trigger('dxclick');
    });
});

QUnit.module('add label option', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        this.firstSDA && this.firstSDA.dispose();
        this.secondSDA && this.secondSDA.dispose();

        fx.off = false;
    }
}, () => {
    QUnit.test('check rendering if one action', function(assert) {
        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        this.firstSDA = $('#fab-one').dxSpeedDialAction({
            label: 'first action'
        }).dxSpeedDialAction('instance');

        assert.equal($(FAB_MAIN_SELECTOR).find(FAB_LABEL_SELECTOR).text(), 'first action', 'FAB has label');
        assert.ok($(FAB_MAIN_SELECTOR).hasClass('dx-fa-button-with-label'), 'FAB has class');

        const $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.offset().top, $(window).height() - ($fabMainContent.outerHeight() + 16), 'default position top doesn\'t change if FAB has label');
        assert.roughEqual($fabMainContent.offset().left, $(window).width() - ($fabMainContent.outerWidth() + 16), 1, 'default position left doesn\'t change if FAB has label');
    }),

    QUnit.test('check rendering if multiple actions', function(assert) {
        this.firstSDA = $('#fab-one').dxSpeedDialAction({
            label: 'first action'
        }).dxSpeedDialAction('instance');

        this.secondSDA = $('#fab-two').dxSpeedDialAction({
            label: 'second action'
        }).dxSpeedDialAction('instance');

        const $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($(FAB_MAIN_SELECTOR).find(FAB_LABEL_SELECTOR).length, 0, 'FAB hasn\'t label if create second SDA');
        assert.ok(!$(FAB_MAIN_SELECTOR).hasClass('dx-fa-button-with-label'), 'FAB hasn\'t class if create second SDA');
        assert.equal($(FAB_SELECTOR).find(FAB_LABEL_SELECTOR).eq(0).text(), 'first action', 'first SDA has label');
        assert.equal($(FAB_SELECTOR).find(FAB_LABEL_SELECTOR).eq(1).text(), 'second action', 'second SDA has label');
        assert.ok(!$(FAB_SELECTOR).find('.dx-overlay-content').eq(0).hasClass(FAB_CONTENT_REVERSE_CLASS), 'first SDA has label on the left');
        assert.ok(!$(FAB_SELECTOR).find('.dx-overlay-content').eq(1).hasClass(FAB_CONTENT_REVERSE_CLASS), 'second SDA has label on the left');
        assert.equal($fabMainContent.offset().top, $(window).height() - ($fabMainContent.outerHeight() + 16), 'position top doesn\'t change if FAB has lost label');
        assert.equal($fabMainContent.offset().left, $(window).width() - ($fabMainContent.outerWidth() + 16), 'position left doesn\'t change if FAB has lost label');
    }),

    QUnit.test('check rendering if change position in config', function(assert) {
        this.firstSDA = $('#fab-one').dxSpeedDialAction({
            label: 'first action'
        }).dxSpeedDialAction('instance');

        this.secondSDA = $('#fab-two').dxSpeedDialAction({
            label: 'second action'
        }).dxSpeedDialAction('instance');

        config({
            floatingActionButtonConfig: {
                label: 'fab',
                position: {
                    at: 'left bottom',
                    my: 'left bottom',
                    offset: '16 16'
                }
            }
        });

        this.firstSDA.repaint();

        assert.equal($(FAB_MAIN_SELECTOR).find(FAB_LABEL_SELECTOR).text(), 'fab', 'FAB has label if set it in config');
        assert.ok($(FAB_SELECTOR).find('.dx-overlay-content').eq(1).hasClass(FAB_CONTENT_REVERSE_CLASS), 'first SDA has label on the right');
        assert.ok($(FAB_SELECTOR).find('.dx-overlay-content').eq(2).hasClass(FAB_CONTENT_REVERSE_CLASS), 'second SDA has label on the right');
    });
});

QUnit.module('add visible option', {
    beforeEach: function() {
        fx.off = true;

        config({
            floatingActionButtonConfig: {
                icon: 'menu',
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });
    },

    afterEach: function() {
        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        this.firstSDA.dispose();
        this.secondSDA.dispose();

        fx.off = false;
    }
}, () => {
    QUnit.test('check rendering', function(assert) {
        const clickHandler = sinon.spy();

        this.firstSDA = $('#fab-one').dxSpeedDialAction({
            icon: 'edit',
            label: 'Edit row',
            visible: false,
            onClick: clickHandler
        }).dxSpeedDialAction('instance');

        assert.equal($(FAB_INVISIBLE_SELECTOR).length, 1, 'one invisible action');

        this.secondSDA = $('#fab-two').dxSpeedDialAction({
            icon: 'trash',
            visible: false
        }).dxSpeedDialAction('instance');

        assert.equal($(FAB_INVISIBLE_SELECTOR).length, 3, 'all actions are invisible');

        this.firstSDA.option('visible', true);

        let $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.find('.dx-icon-edit').length, 1, 'action icon is applied if action visible');
        assert.equal($fabMainContent.find('.dx-fa-button-label').text(), 'Edit row', 'action label is applied if action visible');

        this.secondSDA.option('visible', true);

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        assert.equal($(FAB_SELECTOR).not(FAB_MAIN_SELECTOR).length, 2, 'two visible actions');

        this.secondSDA.option('visible', false);

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        assert.ok(clickHandler.calledOnce, 'Handler should be called');
        assert.equal($(FAB_INVISIBLE_SELECTOR).length, 2, 'only FAB visible');
        assert.ok($(FAB_MAIN_SELECTOR).find('.dx-icon-edit'), 'FAB has action icon if second SDA invisible');

        this.secondSDA.option('visible', true);

        assert.ok($(FAB_MAIN_SELECTOR).find('.dx-icon-add'), 'FAB return default icon if second SDA visible');

        const $fabContent = $(FAB_SELECTOR).not(FAB_MAIN_SELECTOR).find('.dx-overlay-content');
        const fabDimensions = 30;
        const fabOffsetY = 10;

        $fabMainContent.trigger('dxclick');

        assert.equal($(window).height() - $fabContent.eq(0).offset().top - fabDimensions, 80, 'right edit action position');
        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabDimensions - fabOffsetY, 110, 'right trash action position');
    });

    QUnit.test('check multiple value changes', function(assert) {
        this.firstSDA = $('#fab-one').dxSpeedDialAction({
            icon: 'edit',
            label: 'Edit row'
        }).dxSpeedDialAction('instance');

        this.secondSDA = $('#fab-two').dxSpeedDialAction({
            icon: 'trash',
            visible: false
        }).dxSpeedDialAction('instance');

        this.firstSDA.option('visible', false);
        this.firstSDA.option('visible', true);
        this.firstSDA.option('visible', false);

        assert.equal($(FAB_INVISIBLE_SELECTOR).length, 3, 'all actions are invisible');

        this.firstSDA.option('visible', true);
        this.secondSDA.option('visible', true);

        this.firstSDA.option('visible', false);
        this.secondSDA.option('visible', false);

        assert.equal($(FAB_INVISIBLE_SELECTOR).length, 3, 'all actions are invisible');
    });
});


QUnit.test('Overlay element should contain attrs provided with "elementAttr" from SpeedDialAction (T1140620)', function(assert) {
    this.firstSDA = $('#fab-one').dxSpeedDialAction({
        icon: 'add',
        elementAttr: {
            class: 'custom-class',
            'data-test': true,
        },
    }).dxSpeedDialAction('instance');

    const $fabElement = this.firstSDA.$element();
    const $overlayElement = $(FAB_MAIN_SELECTOR);

    assert.ok($fabElement.hasClass('custom-class'), 'FAB element has correct custom class');
    assert.ok($overlayElement.hasClass('custom-class'), 'Overlay element has correct custom class');

    assert.ok($fabElement.attr('data-test'), 'FAB element has correct data-test attribute');
    assert.ok($overlayElement.attr('data-test'), 'Overlay element has correct data-test attribute');
});


QUnit.test('check label rendering before/after toggling visibility (T985992)', function(assert) {
    this.firstSDA = $('#fab-one').dxSpeedDialAction({
        icon: 'add',
        index: 1,
        visible: false,
    }).dxSpeedDialAction('instance');

    this.firstSDA.option('label', 'Add row');
    this.firstSDA.option('visible', true);

    assert.equal($(FAB_MAIN_SELECTOR).find(FAB_LABEL_SELECTOR).text(), 'Add row', 'FAB has label');

    this.firstSDA.option('visible', false);
    this.firstSDA.option('visible', true);
    this.firstSDA.option('label', 'Add row');

    assert.equal($(FAB_MAIN_SELECTOR).find(FAB_LABEL_SELECTOR).text(), 'Add row', 'FAB has label');

});


QUnit.test('check onClick handler after toggling visibility (T933671)', function(assert) {
    const firstClickStub = sinon.stub();
    const secondClickStub = sinon.stub();

    this.firstSDA = $('#fab-one').dxSpeedDialAction({
        icon: 'edit',
        label: 'Edit row',
        onClick: firstClickStub
    }).dxSpeedDialAction('instance');

    this.secondSDA = $('#fab-two').dxSpeedDialAction({
        icon: 'trash',
        visible: false,
        onClick: secondClickStub
    }).dxSpeedDialAction('instance');

    this.firstSDA.option('visible', false);
    this.secondSDA.option('visible', true);
    this.firstSDA.option('visible', true);
    this.secondSDA.option('visible', false);

    let $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

    $fabMainContent.trigger('dxclick');

    let clickArgs = firstClickStub.getCall(0).args;

    assert.equal($(clickArgs[0].element).attr('id'), 'fab-one', 'right first SDA click on FAB element after toggling SDA visibility');

    this.firstSDA.option('visible', false);
    this.secondSDA.option('visible', true);

    $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

    $fabMainContent.trigger('dxclick');

    clickArgs = secondClickStub.getCall(0).args;

    assert.equal($(clickArgs[0].element).attr('id'), 'fab-two', 'right second SDA click on FAB element after toggling SDA visibility');
});

QUnit.module('add shading option', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        fx.off = false;
    }
}, () => {
    QUnit.test('check rendering', function(assert) {
        let firstClickHandler = sinon.spy();
        let secondClickHandler = sinon.spy();

        const firstSDA = $('#fab-one').dxSpeedDialAction({
            onClick: firstClickHandler
        }).dxSpeedDialAction('instance');
        const secondSDA = $('#fab-two').dxSpeedDialAction({
            onClick: secondClickHandler
        }).dxSpeedDialAction('instance');

        let $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 0, 'there is not shading by default before FAB click');

        $fabMainContent.trigger('dxclick');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 0, 'there is not shading by default after FAB click');

        config({
            floatingActionButtonConfig: {
                shading: true
            }
        });

        firstSDA.repaint();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 0, 'there is not shading if set value in true before FAB click');

        $fabMainContent.trigger('dxclick');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 1, 'there is shading after FAB click');

        let $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        $fabContent.eq(1).trigger('dxclick');

        assert.ok(firstClickHandler.calledOnce, 'first action handler should be called when there is shading');

        $fabContent.eq(2).trigger('dxclick');

        assert.ok(secondClickHandler.calledOnce, 'second action handler should be called when there is shading');

        $('.dx-overlay-shader').trigger('dxpointerdown');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 0, 'there is not shading if set value in true before outside click');

        config({
            floatingActionButtonConfig: {
                shading: false
            }
        });

        firstSDA.repaint();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        assert.equal($fabMainContent.closest('.dx-overlay-shader').length, 0, 'there is not shading if set value in false after repaint');

        firstClickHandler = sinon.spy();
        secondClickHandler = sinon.spy();

        firstSDA.option('onClick', firstClickHandler);
        secondSDA.option('onClick', secondClickHandler);

        $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        $fabContent.eq(1).trigger('dxclick');

        assert.ok(firstClickHandler.calledOnce, 'first action handler should be called when there is not shading');

        $fabContent.eq(2).trigger('dxclick');

        assert.ok(secondClickHandler.calledOnce, 'second action handler should be called when there is not shading');

        firstSDA.dispose();
        secondSDA.dispose();
    });
});

QUnit.module('add direction option', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'right bottom',
                    my: 'right bottom',
                    offset: '-16 -16'
                }
            }
        });

        fx.off = false;
    },
}, () => {
    QUnit.test('check rendering', function(assert) {
        const firstSDA = $('#fab-one').dxSpeedDialAction().dxSpeedDialAction('instance');
        const secondSDA = $('#fab-two').dxSpeedDialAction().dxSpeedDialAction('instance');

        let $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');
        let $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        const fabDimensions = 30;

        $fabMainContent.trigger('dxclick');

        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabDimensions, 80, 'right first action position');
        assert.equal($(window).height() - $fabContent.eq(2).offset().top - fabDimensions, 120, 'right second action position');

        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'left top',
                    my: 'left top',
                    offset: '16 16'
                },
                direction: 'down'
            }
        });

        firstSDA.repaint();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');
        $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        assert.equal($fabContent.eq(1).offset().top, 80, 'right first action position');
        assert.equal($fabContent.eq(2).offset().top, 120, 'right second action position');

        config({
            floatingActionButtonConfig: {
                position: {
                    at: 'left top',
                    my: 'left top',
                    offset: '16 16'
                }
            }
        });

        firstSDA.repaint();

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');
        $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        assert.equal($fabContent.eq(1).offset().top, 80, 'right first action position');
        assert.equal($fabContent.eq(2).offset().top, 120, 'right second action position');


        firstSDA.dispose();
        secondSDA.dispose();
    });
});

QUnit.module('add index option', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        fx.off = false;
    },
}, () => {
    QUnit.test('check rendering', function(assert) {
        const firstSDA = $('#fab-one').dxSpeedDialAction({
            index: 1,
            icon: 'add'
        }).dxSpeedDialAction('instance');
        const secondSDA = $('#fab-two').dxSpeedDialAction({
            index: 2,
            icon: 'trash'
        }).dxSpeedDialAction('instance');

        const $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');
        let $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        const fabDimensions = 30;

        $fabMainContent.trigger('dxclick');

        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabDimensions, 80, 'add action is first');
        assert.equal($(window).height() - $fabContent.eq(2).offset().top - fabDimensions, 120, 'trash action is second');


        firstSDA.option('index', 2);
        secondSDA.option('index', 1);

        $fabMainContent.trigger('dxclick');

        $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabDimensions, 120, 'trash action is first');
        assert.equal($(window).height() - $fabContent.eq(2).offset().top - fabDimensions, 80, 'add action is second');

        firstSDA.option('index', 5);
        secondSDA.option('index', -1);

        $fabMainContent.trigger('dxclick');

        $fabContent = $(FAB_SELECTOR).find('.dx-overlay-content');

        assert.equal($(window).height() - $fabContent.eq(1).offset().top - fabDimensions, 120, 'trash action is first');
        assert.equal($(window).height() - $fabContent.eq(2).offset().top - fabDimensions, 80, 'add action is second');


        firstSDA.dispose();
        secondSDA.dispose();
    });
});

QUnit.module('check action buttons events', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        fx.off = false;
    },
}, () => {
    QUnit.test('trigger and args', function(assert) {
        const contentReadyStub = sinon.stub();
        const contentReadyHandlerStub = sinon.stub();
        const disposingHandlerStub = sinon.stub();
        const initializedHandlerStub = sinon.stub();
        const disposingStub = sinon.stub();
        const clickStub = sinon.stub();

        $('#fab-one')
            .dxSpeedDialAction({
                onContentReady: contentReadyHandlerStub,
                onInitialized: initializedHandlerStub,
                onDisposing: disposingHandlerStub
            })
            .dxSpeedDialAction('instance')
            .on('contentReady', contentReadyStub)
            .on('disposing', disposingStub)
            .on('click', clickStub);

        assert.equal(contentReadyHandlerStub.callCount, 1, 'first action content ready handler calls once');
        assert.equal(initializedHandlerStub.callCount, 1, 'first action initialized handler calls once');
        assert.equal(disposingHandlerStub.callCount, 0, 'first action disposing handler calls once');

        const contentReadyHandlerArgs = contentReadyHandlerStub.getCall(0).args;
        assert.equal(contentReadyHandlerArgs[0].component.NAME, 'dxSpeedDialAction', 'right first SDA content ready component in args');
        assert.ok(contentReadyHandlerArgs[0].actionElement.hasClass('dx-overlay'), 'right first SDA content ready actionElement in args');
        assert.equal($(contentReadyHandlerArgs[0].element).attr('id'), 'fab-one', 'right first SDA content ready element in args');

        let $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        const clickArgs = clickStub.getCall(0).args;

        assert.equal(clickArgs[0].component.NAME, 'dxSpeedDialAction', 'right first SDA click component in args');
        assert.ok($(clickArgs[0].actionElement).hasClass('dx-overlay'), 'right first SDA click actionElement in args');
        assert.equal($(clickArgs[0].element).attr('id'), 'fab-one', 'right first SDA click element in args');
        assert.ok(clickArgs[0].event, 'first SDA click event in args');


        const contentReadyTwoStub = sinon.stub();
        const contentReadyTwoHandlerStub = sinon.stub();
        const disposingTwoHandlerStub = sinon.stub();
        const initializedTwoHandlerStub = sinon.stub();
        const disposingTwoStub = sinon.stub();

        $('#fab-two')
            .dxSpeedDialAction({
                onContentReady: contentReadyTwoHandlerStub,
                onInitialized: initializedTwoHandlerStub,
                onDisposing: disposingTwoHandlerStub
            })
            .dxSpeedDialAction('instance')
            .on('contentReady', contentReadyTwoStub)
            .on('disposing', disposingTwoStub);


        assert.equal(initializedHandlerStub.callCount, 1, 'first action initialized handler calls once');
        assert.equal(disposingHandlerStub.callCount, 0, 'first action disposing handler calls once');

        $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');


        assert.equal(contentReadyHandlerStub.callCount, 2, 'first action content ready handler calls twice');
        assert.equal(contentReadyStub.callCount, 1, 'first action content ready event triggers once');

        const contentReadyArgs = contentReadyStub.getCall(0).args;
        assert.equal(contentReadyArgs[0].component.NAME, 'dxSpeedDialAction', 'right first SDA content ready component in args');
        assert.ok(contentReadyArgs[0].actionElement.hasClass('dx-overlay'), 'right first SDA content ready actionElement in args');
        assert.equal($(contentReadyArgs[0].element).attr('id'), 'fab-one', 'right first SDA content ready element in args');

        assert.equal(contentReadyTwoHandlerStub.callCount, 1, 'second action content ready handler calls once');
        assert.equal(contentReadyStub.callCount, 1, 'second action content ready event triggers once');

        const contentReadyTwoArgs = contentReadyTwoStub.getCall(0).args;
        assert.equal(contentReadyTwoArgs[0].component.NAME, 'dxSpeedDialAction', 'right second SDA content ready component in args');
        assert.ok(contentReadyTwoArgs[0].actionElement.hasClass('dx-overlay'), 'right second SDA content ready actionElement in args');
        assert.equal($(contentReadyTwoArgs[0].element).attr('id'), 'fab-two', 'right second SDA content ready element in args');

        $('#fab-one').dxSpeedDialAction('instance').dispose();
        assert.equal(disposingHandlerStub.callCount, 1, 'first action disposing handler calls once');
        assert.equal(disposingStub.callCount, 1, 'first action disposing event calls once');


        $('#fab-two').dxSpeedDialAction('instance').dispose();
        assert.equal(disposingTwoHandlerStub.callCount, 1, 'second action disposing handler calls once');
        assert.equal(disposingTwoStub.callCount, 1, 'second action disposing event calls once');
    });
});


QUnit.module('T850271 (one action)', {}, () => {
    QUnit.test('check peventDefault in _outsideClickHandler method', function(assert) {
        const instance = $('#fab-one').dxSpeedDialAction().dxSpeedDialAction('instance');

        const preventDefaultStub = sinon.stub();
        const event = { preventDefault: preventDefaultStub };

        const speedDialItem = instance._createComponent($('<div>'), SpeedDialItem, {
            actions: [instance],
            shading: true
        });

        speedDialItem._outsideClickHandler(event);

        assert.equal(preventDefaultStub.callCount, 1, 'there is peventDefault in outsideClickHandler when shading is true');

        instance.dispose();
    });
});

QUnit.module('T959764 (multiple actions)', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        fx.off = false;
    },
}, () => {
    QUnit.test('check peventDefault in _outsideClickHandler method', function(assert) {

        config({
            floatingActionButtonConfig: {
                shading: true
            }
        });

        const preventDefaultStub = sinon.stub();
        const event = $.Event('dxpointerdown');

        event.preventDefault = preventDefaultStub;

        $('#fab-one').dxSpeedDialAction({ icon: 'add' }).dxSpeedDialAction('instance');
        $('#fab-two').dxSpeedDialAction({ icon: 'remove' }).dxSpeedDialAction('instance');

        const $fabMainContent = $(FAB_MAIN_SELECTOR).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        $fabMainContent.closest('.dx-overlay-shader').trigger(event);

        assert.equal(preventDefaultStub.callCount, 1, 'there is peventDefault in outsideClickHandler when shading is true');
    });
});
