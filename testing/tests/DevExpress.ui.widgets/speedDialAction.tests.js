import $ from 'jquery';
import config from 'core/config';
import fx from 'animation/fx';

import 'ui/speed_dial_action';
import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="fab-one"></div>\
        <div id="fab-two"></div>\
        <div id="fabs"></div>';

    $('#qunit-fixture').html(markup);
});

const FAB_CLASS = 'dx-fa-button';
const FAB_MAIN_CLASS = 'dx-fa-button-main';

QUnit.module('create one action', () => {
    QUnit.test('check rendering', (assert) => {
        this.instance = $('#fab-one')
            .dxSpeedDialAction()
            .dxSpeedDialAction('instance');

        const $fabElement = $('.' + FAB_CLASS);
        const $fabContent = $fabElement.find('.dx-overlay-content');
        const clickHandler = sinon.spy();

        assert.ok($fabElement.length === 1, 'one action button created');
        assert.ok($fabElement.hasClass(FAB_MAIN_CLASS), 'it is main action button');
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
    QUnit.test('check action buttons count', (assert) => {
        const $container = $('#fabs');
        const fabInstances = [];

        for(let i = 0; i < 8; i++) {
            try {
                fabInstances.push($('<div>')
                    .appendTo($container)
                    .dxSpeedDialAction({ icon: 'favorites' })
                    .dxSpeedDialAction('instance'));
            } catch(error) {}
        }

        assert.equal($('.' + FAB_MAIN_CLASS).length, 1, 'one main fab is created');
        assert.equal($('.' + FAB_CLASS).length - 1, 5, 'five actions is created');
    });
});

QUnit.module('create multiple actions', {
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
    }
}, () => {
    QUnit.test('check rendering', function(assert) {
        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        let $fabElement = $('.' + FAB_CLASS);
        let $fabContent = $fabElement.find('.dx-overlay-content');

        assert.ok($fabMainElement.length === 1, 'create one main fab');
        assert.ok($fabElement.length === 3, 'create two actions');

        assert.equal($fabMainElement.attr('title'), undefined, 'default hint empty');
        assert.equal($fabMainContent.find('.dx-icon-add').length, 1, 'default icon is applied');
        assert.equal($fabMainContent.find('.dx-icon-close').length, 1, 'default close is applied');

        assert.equal($fabElement.eq(1).attr('title'), 'Arrow down', 'first action with right hint');
        assert.equal($fabElement.eq(2).attr('title'), 'Arrow up', 'second action with right hint');
        assert.equal($fabContent.eq(1).find('.dx-icon-arrowdown').length, 1, 'first action with arrowdown icon');
        assert.equal($fabContent.eq(2).find('.dx-icon-arrowup').length, 1, 'second action with arrowup icon');

        assert.equal(this.firstInstance.option('position').offset.y, -56, 'right fist action position');
        assert.equal(this.secondInstance.option('position').offset.y, -96, 'right second action position');

        this.firstInstance.option('icon', 'find');
        this.secondInstance.option('icon', 'filter');

        $fabElement = $('.' + FAB_CLASS);
        $fabContent = $fabElement.find('.dx-overlay-content');

        assert.equal($fabContent.eq(1).find('.dx-icon-find').length, 1, 'first action icon changed on icon find');
        assert.equal($fabContent.eq(2).find('.dx-icon-filter').length, 1, 'second action icon changed on icon filter');

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
    QUnit.test('check main fab rendering', (assert) => {
        config({
            floatingActionButtonConfig: {
                icon: 'favorites',
                closeIcon: 'cancel',
                position: 'left top'
            }
        });

        $('#fab-one').dxSpeedDialAction();
        $('#fab-two').dxSpeedDialAction();

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');

        assert.equal($fabMainContent.find('.dx-icon-favorites').length, 1, 'default icon is changed');
        assert.equal($fabMainContent.find('.dx-icon-cancel').length, 1, 'default close icon is changed');
        assert.equal($fabMainContent.offset().top, 0, 'default position top is changed');
        assert.equal($fabMainContent.offset().left, 0, 'default position left is changed');
    });

    QUnit.test('main button has default icon if config has no icon', (assert) => {
        config({
            floatingActionButtonConfig: { }
        });

        $('#fab-one').dxSpeedDialAction({ icon: 'home' });
        $('#fab-two').dxSpeedDialAction({ icon: 'square' });

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabMainContentIcons = $fabMainElement.find('.dx-icon');
        assert.equal($fabMainContent.find('.dx-icon-add').length, 1, 'default icon is \'add\'');
        assert.equal($fabMainContentIcons.length, 2, 'only two icons rendered on the main button');
    });

    QUnit.test('check main fab position after change', (assert) => {
        var firstSDA = $('#fab-one').dxSpeedDialAction().dxSpeedDialAction('instance');
        $('#fab-two').dxSpeedDialAction();

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const fabDimensions = 64;

        assert.equal($fabMainContent.offset().top, $(window).height() - fabDimensions, 'default position top');
        assert.equal($fabMainContent.offset().left, $(window).width() - fabDimensions, 'default position left');

        config({
            floatingActionButtonConfig: {
                position: 'left top'
            }
        });

        firstSDA.repaint();

        assert.equal($fabMainContent.offset().top, 0, 'default position top is changed');
        assert.equal($fabMainContent.offset().left, 0, 'default position left is changed');
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
    QUnit.test('check main fab rendering', (assert) => {
        $('#fab-one').dxSpeedDialAction({
            icon: 'plus',
            hint: 'Add a Row'
        });

        $('#fab-two').dxSpeedDialAction({
            icon: 'trash',
            hint: 'Delete Selected Rows'
        });

        $('#fab-two').dxSpeedDialAction('instance').dispose();

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabElement = $('.' + FAB_CLASS);
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
    QUnit.test('if container is window', (assert) => {

        $('#fab-one').dxSpeedDialAction({
            icon: 'plus'
        });

        $('#fab-two').dxSpeedDialAction({
            icon: 'trash'
        });

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainWrapper = $fabMainElement.find('.dx-overlay-wrapper');
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabElement = $(`.${FAB_CLASS}:not(.${FAB_MAIN_CLASS})`);

        $fabMainContent.trigger('dxclick');

        const $fabWrapper = $fabElement.find('.dx-overlay-wrapper');
        const expectedPosition = 'fixed';

        assert.equal($fabMainWrapper.css('position'), expectedPosition, 'position is fixed');
        assert.equal($fabWrapper.eq(0).css('position'), expectedPosition, 'first action has the same position with main fab');
        assert.equal($fabWrapper.eq(1).css('position'), expectedPosition, 'second action has the same position with main fab');
    });

    QUnit.test('if random container', (assert) => {
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

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        const $fabMainWrapper = $fabMainElement.find('.dx-overlay-wrapper');
        const $fabMainContent = $fabMainElement.find('.dx-overlay-content');
        const $fabElement = $(`.${FAB_CLASS}:not(.${FAB_MAIN_CLASS})`);

        $fabMainContent.trigger('dxclick');

        const $fabWrapper = $fabElement.find('.dx-overlay-wrapper');
        const expectedPosition = 'absolute';

        assert.equal($fabMainWrapper.css('position'), expectedPosition, 'position is absolute');
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
    QUnit.test('component', (assert) => {
        const firstSDA = $('#fab-one').dxSpeedDialAction({
            onClick: function(e) {
                assert.equal(e.component, firstSDA, 'component in args matches with first SDA instance');
            }
        }).dxSpeedDialAction('instance');

        const $fabMainElement = $('.' + FAB_MAIN_CLASS);
        let $fabMainContent = $fabMainElement.find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        const secondSDA = $('#fab-two').dxSpeedDialAction({
            icon: 'edit',
            onClick: function(e) {
                assert.equal(e.component, secondSDA, 'component in args matches with second SDA instance');
            }
        }).dxSpeedDialAction('instance');

        const $fabElement = $('.' + FAB_CLASS);
        const $fabContent = $fabElement.find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');
        $fabContent.eq(2).trigger('dxclick');
    });
});

QUnit.module('check action buttons events', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        $('#fab-one').dxSpeedDialAction('instance').dispose();
        $('#fab-two').dxSpeedDialAction('instance').dispose();

        fx.off = false;
    }
}, () => {
    QUnit.test('trigger and args', (assert) => {
        const contentReadyStub = sinon.stub();
        const contentReadyHandlerStub = sinon.stub();
        const clickStub = sinon.stub();

        $('#fab-one')
            .dxSpeedDialAction({
                onContentReady: contentReadyHandlerStub
            })
            .dxSpeedDialAction('instance')
            .on('contentReady', contentReadyStub)
            .on('click', clickStub);

        assert.equal(contentReadyHandlerStub.callCount, 1, 'first action content ready handler calls once');

        const contentReadyHandlerArgs = contentReadyHandlerStub.getCall(0).args;
        assert.equal(contentReadyHandlerArgs[0].component.NAME, 'dxSpeedDialAction', 'right first SDA content ready component in args');
        assert.ok(contentReadyHandlerArgs[0].actionElement.hasClass('dx-overlay'), 'right first SDA content ready actionElement in args');
        assert.equal($(contentReadyHandlerArgs[0].element).attr('id'), 'fab-one', 'right first SDA content ready element in args');

        let $fabMainContent = $('.' + FAB_MAIN_CLASS).find('.dx-overlay-content');

        $fabMainContent.trigger('dxclick');

        const clickArgs = clickStub.getCall(0).args;

        assert.equal(clickArgs[0].component.NAME, 'dxSpeedDialAction', 'right first SDA click component in args');
        assert.ok($(clickArgs[0].actionElement).hasClass('dx-overlay'), 'right first SDA click actionElement in args');
        assert.equal($(clickArgs[0].element).attr('id'), 'fab-one', 'right first SDA click element in args');
        assert.ok(clickArgs[0].event, 'first SDA click event in args');


        const contentReadyTwoStub = sinon.stub();
        const contentReadyTwoHandlerStub = sinon.stub();
        $('#fab-two')
            .dxSpeedDialAction({
                onContentReady: contentReadyTwoHandlerStub
            })
            .dxSpeedDialAction('instance')
            .on('contentReady', contentReadyTwoStub);

        $fabMainContent = $('.' + FAB_MAIN_CLASS).find('.dx-overlay-content');

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
    });
});


