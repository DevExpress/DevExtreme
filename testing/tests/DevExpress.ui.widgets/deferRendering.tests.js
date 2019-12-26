var $ = require('jquery'),
    TransitionExecutorModule = require('animation/transition_executor/transition_executor'),
    dataUtils = require('core/element_data');

require('common.css!');
require('ui/defer_rendering');

QUnit.testStart(function() {
    var markup =
        '<div id="renderContent">\
            <div class="defer-rendering">\
                <div class="item">content</div>\
            </div>\
        </div>\
        <div id="renderDelegate">\
            <div class="defer-rendering">\
                <div class="item">content</div>\
            </div>\
        </div>\
        <div id="renderWhen">\
            <div class="defer-rendering">\
                <div class="item">content</div>\
            </div>\
        </div>\
        <div id="hiddenUntilRendered">\
            <div class="defer-rendering">\
                <div class="item1"></div>\
                <div class="item2"></div>\
            </div>\
        </div>\
        <div id="showLoadIndicator">\
            <div class="defer-rendering"></div>\
        </div>\
        <div id="custom">\
            <div class="defer-rendering">\
                <div class="indicator dx-visible-while-pending-rendering">indicator</div>\
                <div class="content dx-invisible-while-pending-rendering">content</div>\
            </div>\
        </div>\
        <div id="customWithWrap">\
            <div>\
                <div class="defer-rendering">\
                    <div class="indicator dx-visible-while-pending-rendering">indicator</div>\
                    <div class="content dx-invisible-while-pending-rendering">content</div>\
                </div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});


QUnit.module('dxDeferRendering', () => {
    QUnit.test('dxDeferRendering warps content transparently (doesn\'t affect css styles)', function(assert) {
        var $deferRendering = $('#renderContent')
            .find('.defer-rendering')
            .dxDeferRendering();

        assert.ok(!$deferRendering.is('.dx-widget'));
    });

    QUnit.test('renderContent', function(assert) {
        var done = assert.async(),
            $test = $('#renderContent');

        var deferRendering = $test
            .find('.defer-rendering')
            .dxDeferRendering()
            .dxDeferRendering('instance');

        assert.equal($test.find('.dx-pending-rendering').length, 1);
        assert.ok($test.find('.dx-pending-rendering').is('.dx-pending-rendering-manual'));

        deferRendering.renderContent().done(function() {
            assert.equal($test.find('.dx-pending-rendering').length, 0);
            assert.equal($test.find('.dx-pending-rendering-manual').length, 0);

            done();
        });
    });

    QUnit.test('render delegate', function(assert) {
        var done = assert.async(),
            $test = $('#renderDelegate');

        $test
            .find('.defer-rendering')
            .dxDeferRendering()
            .dxDeferRendering('instance');

        assert.equal($test.find('.dx-pending-rendering').length, 1);
        assert.ok($test.find('.dx-pending-rendering').is('.dx-pending-rendering-manual'));

        var render = dataUtils.data($test.find('.dx-pending-rendering').get(0), 'dx-render-delegate');
        render().done(function() {
            assert.equal($test.find('.dx-pending-rendering').length, 0);
            assert.equal($test.find('.dx-pending-rendering-manual').length, 0);

            done();
        });
    });

    QUnit.test('rendering state is set properly', function(assert) {
        var done = assert.async(),
            $test = $('#renderDelegate');

        $test.find('.defer-rendering').dxDeferRendering();

        var $deferRendering = $test.find('.dx-pending-rendering'),
            deferRendering = $deferRendering.dxDeferRendering('instance');

        assert.equal($deferRendering.length, 1);
        assert.ok($deferRendering.is('.dx-pending-rendering-manual'));

        $deferRendering.data('dx-render-delegate');

        deferRendering.renderContent().done(done);
        assert.ok($deferRendering.is(':not(.dx-pending-rendering-manual)'));
        assert.ok($deferRendering.is('.dx-pending-rendering'));
        assert.ok($deferRendering.is('.dx-pending-rendering-active'));
    });

    QUnit.test('renderWhen option (deferred)', function(assert) {
        var done = assert.async(),
            options = {
                renderWhen: $.Deferred(),
                onShown: function() {
                    assert.ok(!$test.find('.item').hasClass('dx-invisible-while-pending-rendering'));
                    assert.equal($test.find('.dx-pending-rendering').length, 0);
                    assert.equal($test.find('.dx-pending-rendering-manual').length, 0);

                    done();
                }
            },
            $test = $('#renderWhen');

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.ok($test.find('.item').hasClass('dx-invisible-while-pending-rendering'));
        assert.equal($test.find('.dx-pending-rendering').length, 1);
        assert.ok(!$test.find('.dx-pending-rendering').is('.dx-invisible-while-pending-rendering'));
        assert.ok(!$test.find('.dx-pending-rendering').is('.dx-pending-rendering-manual'));

        options.renderWhen.resolve();
    });

    QUnit.test('renderWhen option (boolean)', function(assert) {
        var done = assert.async(),
            options = {
                renderWhen: false,
                onShown: function() {
                    assert.ok(!$test.find('.item').hasClass('dx-invisible-while-pending-rendering'));
                    assert.equal($test.find('.dx-pending-rendering').length, 0);
                    assert.equal($test.find('.dx-pending-rendering-manual').length, 0);

                    done();
                }
            },
            $test = $('#renderWhen');

        var deferRendering = $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.ok($test.find('.item').hasClass('dx-invisible-while-pending-rendering'));
        assert.equal($test.find('.dx-pending-rendering').length, 1);
        assert.ok(!$test.find('.dx-pending-rendering').hasClass('dx-invisible-while-pending-rendering'));
        assert.ok(!$test.find('.dx-pending-rendering').hasClass('dx-pending-rendering-manual'));

        deferRendering.option('renderWhen', true);
    });

    QUnit.test('children are hidden while pending rendering', function(assert) {
        var done = assert.async(),
            options = {
                renderWhen: $.Deferred(),
                onShown: function() {
                    assert.equal($test.find('.item1').length, 1);
                    assert.ok(!$test.find('.item1').hasClass('dx-invisible-while-pending-rendering'));
                    assert.equal($test.find('.item2').length, 1);
                    assert.ok(!$test.find('.item2').hasClass('dx-invisible-while-pending-rendering'));
                    assert.equal($test.find('.dx-deferrendering').length, 1);
                    assert.ok(!$test.find('.dx-deferrendering').hasClass('dx-hidden'));

                    done();
                }
            },
            $test = $('#hiddenUntilRendered');

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.equal($test.find('.item1').length, 1);
        assert.ok($test.find('.item1').hasClass('dx-invisible-while-pending-rendering'));
        assert.equal($test.find('.item2').length, 1);
        assert.ok($test.find('.item2').hasClass('dx-invisible-while-pending-rendering'));
        assert.equal($test.find('.dx-deferrendering').length, 1);
        assert.ok(!$test.find('.dx-deferrendering').hasClass('dx-hidden'));

        options.renderWhen.resolve();
    });

    QUnit.test('showLoadIndicator:false option', function(assert) {
        var done = assert.async(),
            options = {
                renderWhen: $.Deferred()
            },
            enterLog = [],
            startLog = [],
            $test = $('#showLoadIndicator');

        TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
            enter: function($el, config) {
                enterLog.push({
                    $element: $el,
                    config: config
                });
            },
            start: function(config) {
                startLog.push(config);
            }
        });

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.equal($test.find('.dx-loadindicator').length, 0);

        options.renderWhen.resolve();
        assert.equal(enterLog.length, 0);
        assert.equal(startLog.length, 0);

        done();
    });

    QUnit.test('showLoadIndicator:true option', function(assert) {
        var options = {
                showLoadIndicator: true,
                renderWhen: $.Deferred()
            },
            $test = $('#showLoadIndicator');

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.equal($test.find('.dx-loadindicator').length, 1, 'load indicator is rendered');
    });

    QUnit.test('Custom LoadIndicator (T392031)', function(assert) {
        var options = {
                showLoadIndicator: false,
                renderWhen: $.Deferred()
            },
            done = assert.async(),
            $test = $('#custom');

        var deferRendering = $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.ok($(deferRendering.element()).hasClass('dx-pending-rendering'));
        assert.ok($test.find('.indicator').hasClass('dx-visible-while-pending-rendering'), 'load indicator is visible before rendering content');
        assert.ok($test.find('.content').hasClass('dx-invisible-while-pending-rendering'), 'content is not visible before rendering content');

        deferRendering.renderContent().done(function() {
            assert.ok(!$(deferRendering.element()).hasClass('dx-pending-rendering'));

            done();
        });
    });

    QUnit.test('Custom LoadIndicator with wrapper (T392031)', function(assert) {
        var options = {
                showLoadIndicator: false,
                renderWhen: $.Deferred()
            },
            done = assert.async(),
            $test = $('#customWithWrap');

        var deferRendering = $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.ok($(deferRendering.element()).hasClass('dx-pending-rendering'));
        assert.ok($test.find('.indicator').hasClass('dx-visible-while-pending-rendering'), 'load indicator is visible before rendering content');
        assert.ok($test.find('.content').hasClass('dx-invisible-while-pending-rendering'), 'content is not visible before rendering content');

        deferRendering.renderContent().done(function() {
            assert.ok(!$(deferRendering.element()).hasClass('dx-pending-rendering'));
            done();
        });
    });

    QUnit.test('loading state with rendered content', function(assert) {
        assert.expect(4);

        var done = assert.async(),
            renderCount = 0,
            options = {
                showLoadIndicator: true,
                renderWhen: false,
                onRendered: function() {
                    if(renderCount === 0) {
                        assert.equal($test.find('.dx-loadindicator').length, 0, 'load indicator is removed after render');

                        deferRendering.option('renderWhen', false);
                        assert.equal($test.find('.dx-loadindicator').length, 1, 'load indicator is shown again');

                        deferRendering.option('renderWhen', true);
                    }
                    if(renderCount === 1) {
                        assert.equal($test.find('.dx-loadindicator').length, 0, 'load indicator is removed when rendered');
                        done();
                    }
                    renderCount++;
                }
            },
            $test = $('#showLoadIndicator');

        var deferRendering = $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        assert.equal($test.find('.dx-loadindicator').length, 1, 'load indicator is rendered');

        deferRendering.option('renderWhen', true);
    });

    QUnit.test('should support Promise/A+ standard', function(assert) {
        var resolve;
        var promise = new Promise(function(onResolve) {
            resolve = onResolve;
        });

        var options = {
                renderWhen: promise,
                onShown: function() {
                    assert.ok(!$test.find('.item').hasClass('dx-invisible-while-pending-rendering'));
                    assert.equal($test.find('.dx-pending-rendering').length, 0);
                    assert.equal($test.find('.dx-pending-rendering-manual').length, 0);
                }
            },
            $test = $('#renderWhen');

        $test
            .find('.defer-rendering')
            .dxDeferRendering(options)
            .dxDeferRendering('instance');

        // assert.ok(!$test.find(".item").is(":visible"));
        assert.ok($test.find('.item').hasClass('dx-invisible-while-pending-rendering'));
        assert.equal($test.find('.dx-pending-rendering').length, 1);
        assert.ok(!$test.find('.dx-pending-rendering').hasClass('dx-invisible-while-pending-rendering'));
        assert.ok(!$test.find('.dx-pending-rendering').hasClass('dx-pending-rendering-manual'));

        resolve();

        return promise;
    });
});

