const $ = require('jquery');
const TransitionExecutorModule = require('animation/transition_executor/transition_executor');

require('common.css!');
require('ui/defer_rendering');

QUnit.testStart(function() {
    const markup =
        '<div id="animation">\
            <div class="defer-rendering"></div>\
        </div>\
        <style>\
            .test-staggering-item,\
            test-no-staggering-item {\
                    height: 10px;\
                    width: 10px;\
            }\
        </style>\
        <div id="staggering-animation" style="position: absolute; width: 100px; height: 100px; top: 0; left: 0">\
            <div class="defer-rendering" style="position: absolute; width: 100%; height: 100%">\
                <div class="item1 test-staggering-item"></div>\
                <div class="item2 test-staggering-item"></div>\
                <div class="item3 test-no-staggering-item"></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

let savedTransitionExecutor;

QUnit.module('dxDeferRendering', {
    beforeEach: function() {
        savedTransitionExecutor = TransitionExecutorModule.TransitionExecutor;
    },
    afterEach: function() {
        TransitionExecutorModule.TransitionExecutor = savedTransitionExecutor;
    }
}, () => {
    QUnit.test('animation option', function(assert) {
        assert.expect(5);

        const done = assert.async(),
              animation = {
                  type: 'test'
              },
              options = {
                  animation: animation,
                  renderWhen: $.Deferred(),
                  onRendered: function() {
                      assert.equal(enterLog.length, 0);
                      assert.equal(startLog.length, 0);
                  },
                  onShown: function() {
                      assert.equal(enterLog.length, 1);
                      assert.equal(enterLog[0].$element[0], $test.find('.dx-deferrendering')[0]);
                      assert.equal(enterLog[0].config.type, 'test');

                      done();
                  }
              },
              enterLog = [],
              startLog = [],
              $test = $('#animation');

        TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
            enter: function($el, config) {
                enterLog.push({
                    $element: $el,
                    config: config
                });
            },
            start: function(config) {
                startLog.push(config);
                return $.Deferred().resolve().promise();
            }
        });


        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        options.renderWhen.resolve();
    });

    QUnit.test('staggering animation options', function(assert) {
        assert.expect(7);

        const done = assert.async(),
              animation = {
                  type: 'test'
              },
              options = {
                  animation: animation,
                  staggerItemSelector: '.test-staggering-item',
                  renderWhen: $.Deferred(),
                  onShown: function() {
                      assert.equal(enterLog.length, 2);
                      assert.ok(enterLog[0].$element.is('.item1'));
                      assert.ok(enterLog[0].config.type, 'test');
                      assert.ok(enterLog[1].$element.is('.item2'));
                      assert.ok(enterLog[1].config.type, 'test');

                      assert.equal(startLog.length, 1);
                      assert.equal(startLog[0], undefined);

                      done();
                  }
              },
              enterLog = [],
              startLog = [],
              $test = $('#staggering-animation')
                  .clone()
                  .appendTo($('body'));

        TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
            enter: function($el, config) {
                enterLog.push({
                    $element: $el,
                    config: config
                });
            },
            start: function(config) {
                startLog.push(config);
                return $.Deferred().resolve().promise();
            }
        });

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        options.renderWhen.resolve();
    });

    QUnit.test('staggering animation with items that are outside the screen', function(assert) {
        assert.expect(5);

        const done = assert.async(),
              animation = {
                  type: 'test'
              },
              options = {
                  animation: animation,
                  staggerItemSelector: '.test-staggering-item',
                  renderWhen: $.Deferred(),
                  onShown: function() {
                      assert.equal(enterLog.length, 1, 'the top item is not visible');
                      assert.ok(enterLog[0].$element.is('.item2'));
                      assert.ok(enterLog[0].config.type, 'test');

                      assert.equal(startLog.length, 1);
                      assert.equal(startLog[0], undefined);

                      done();
                  }
              },
              enterLog = [],
              startLog = [],
              $test = $('#staggering-animation')
                  .clone()
                  .appendTo($('body'))
                  .css('top', '-15px');// Hide the top item. It's of 10px height

        TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
            enter: function($el, config) {
                enterLog.push({
                    $element: $el,
                    config: config
                });
            },
            start: function(config) {
                startLog.push(config);
                return $.Deferred().resolve().promise();
            }
        });

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        options.renderWhen.resolve();
    });

    QUnit.test('stops on dispose (T315643)', function(assert) {
        const animation = {
                      type: 'test'
                  },
              options = {
                  animation: animation,
                  renderWhen: $.Deferred()
              },
              stopLog = [],
              $test = $('#animation');

        TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
            enter: function($el, config) {
            },
            start: function(config) {
                return $.Deferred().resolve().promise();
            },
            stop: function() {
                stopLog.push(arguments);
                return $.Deferred().resolve().promise();
            }
        });


        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.equal(stopLog.length, 0);

        options.renderWhen.resolve();
        assert.equal(stopLog.length, 0);

        $test.remove();
        assert.equal(stopLog.length, 1, 'T315643');
        assert.equal(stopLog[0][0], true, 'T370098');
    });

    QUnit.test('stops animation on the \'renderWhen\' option toggling (T574848)', function(assert) {
        const options = {
                      animation: {
                          type: 'test'
                      },
                      renderWhen: false
                  },
              stopLog = [],
              $test = $('#animation');

        TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
            enter: $.noop,
            leave: $.noop,
            start: function(config) {
                return $.Deferred().resolve().promise();
            },
            stop: function() {
                stopLog.push(arguments);
                return $.Deferred().resolve().promise();
            }
        });

        const deferRendering = $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.equal(stopLog.length, 0);

        deferRendering.option('renderWhen', true);
        assert.equal(stopLog.length, 0);

        deferRendering.option('renderWhen', false);
        deferRendering.option('renderWhen', true);
        assert.equal(stopLog.length, 1, 'T574848');
    });
});

