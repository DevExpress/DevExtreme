const $ = require('jquery');
const angular = require('angular');
const registerEvent = require('events/core/event_registrator');
const dragEvents = require('events/drag');
const swipeEvents = require('events/swipe');

require('integration/angular');

QUnit.module('custom events with Ng approach', {
    beforeEach: function() {
        this.$fixtureElement = $('<div/>').attr('ng-app', 'testApp').appendTo('#qunit-fixture');
        this.testApp = angular.module('testApp', ['dx']);
        this.$container = $('<div/>').appendTo(this.$fixtureElement);
        this.$controller = $('<div ng-controller="my-controller"></div>').appendTo(this.$container);
    },
    afterEach: function() {
        this.$fixtureElement.remove();
    }
});

$.each([
    'dxpointerdown',
    'dxpointermove',
    'dxpointerup',
    'dxpointercancel',
    swipeEvents.start,
    swipeEvents.swipe,
    swipeEvents.end,
    'dxclick',
    'dxhold',
    dragEvents.start,
    dragEvents.move,
    dragEvents.end,
    dragEvents.enter,
    dragEvents.leave,
    dragEvents.drop
], function(_, eventName) {
    const ngEventName = eventName.slice(0, 2) + '-' + eventName.slice(2);
    QUnit.test('\'' + eventName + '\' event triggers on \'' + ngEventName + '\' attribute', function(assert) {
        let triggered = 0;
        const $markup = $('<div ' + ngEventName + '="handler($event)"></div>').appendTo(this.$controller);

        this.testApp.controller('my-controller', function($scope) {
            $scope.handler = function($event) {
                triggered++;
                assert.ok($event instanceof $.Event, '$event present');
            };
        });

        angular.bootstrap(this.$container, ['testApp']);

        $markup.trigger(eventName);
        assert.equal(triggered, 1);
    });
});

QUnit.test('event with option binding', function(assert) {
    assert.expect(3);

    const $markup = $('<div dx-testevent="{ execute: \'handler($event)\', option1: option1Value }"></div>').appendTo(this.$controller);

    registerEvent('dxtestevent', {
        setup: function(element, data) {
            assert.equal(data.option1, 500);
        }
    });

    this.testApp.controller('my-controller', function($scope) {
        $scope.option1Value = 500;

        $scope.handler = function($event) {
            assert.equal(this, $scope, 'viewmodel is context');
            assert.ok($event instanceof $.Event);
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    $markup.trigger('dxtestevent');
});
