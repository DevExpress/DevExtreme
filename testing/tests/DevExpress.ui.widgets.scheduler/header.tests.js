import $ from 'jquery';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import themes from 'ui/themes';
import 'ui/drop_down_button';

testStart(() => initTestMarkup());

test('should has navigator and view switcher in basic configuration', function(assert) {
    createWrapper({
        views: ['day'],
        currentView: 'day',
    });

    assert.equal($('.dx-scheduler-navigator').length, 1, 'Navigator is in DOM');
    assert.equal($('.dx-scheduler-view-switcher').length, 1, 'View switcher is in DOM');
});

test('should have correct deafult views', function(assert) {
    const scheduler = createWrapper();

    assert.equal(
        scheduler.header.viewSwitcher.getText(),
        'DayWeek',
        'view switcher should has correct views'
    );
});

test('should rerender after useDropDownViewSwitcher option changes', function(assert) {
    const scheduler = createWrapper({
        currentView: 'month',
        views: ['month'],
    });

    const headerInstance = scheduler.instance._header;

    const stub = sinon.stub(headerInstance, '_render');

    scheduler.option('useDropDownViewSwitcher', []);

    assert.ok(stub.calledOnce, 'Render method is called');
});

module('Interface Interaction', {}, () => {
    test('should call notifyObserver after selecting view', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day',
            views: ['day', 'week'],
            currentDate: new Date(2021, 6, 9),
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, 'notifyObserver').withArgs('currentViewUpdated');

        scheduler.header.viewSwitcher.getButton('Week').click();

        assert.ok(stub.calledOnce, 'Observer is notified');
        const args = stub.getCall(0).args;
        assert.equal(args[1], 'week', 'Arguments are OK');
    });

    test('should call notifyObserver after selecting new date', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day',
            views: ['day', 'week'],
            currentDate: new Date(2021, 6, 9),
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, 'notifyObserver').withArgs('currentDateUpdated');

        scheduler.header.navigator.nextButton.click();

        assert.ok(stub.calledOnce, 'Observer is notified');
        const args = stub.getCall(0).args;
        assert.equal(args[1].toUTCString(), new Date(2021, 6, 10).toUTCString(), 'Arguments are OK');
    });
});

module('Meterial theme', {
    beforeEach: function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        themes.isMaterial = this.origIsMaterial;
    }
}, () => {
    test('should has navigator and dropDown viewSwitcher', function(assert) {
        createWrapper({
            views: ['day'],
            currentView: 'day',
        });

        assert.equal($('.dx-scheduler-navigator').length, 1, 'Navigator is in DOM');
        assert.equal($('.dx-scheduler-view-switcher').length, 1, 'View switcher is in DOM');
        assert.equal($('.dx-scheduler-view-switcher-dropdown-button').length, 1, 'Drop down button is in DOM');
    });
});

module('Toolbar config', {}, () => {
    test('should rerender after items configuration changes', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            views: ['month'],
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, '_render');

        scheduler.option('toolbar', []);

        assert.ok(stub.calledOnce, 'Render method is called');
    });
});
