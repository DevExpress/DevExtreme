"use strict";

var $ = require("jquery"),
    TransitionExecutorModule = require("animation/transition_executor/transition_executor"),
    dataUtils = require("core/element_data").getDataStrategy();

require("common.css!");
require("ui/defer_rendering");

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
        </div>\
        <div id="animation">\
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

    $("#qunit-fixture").html(markup);
});

var savedTransitionExecutor;

QUnit.module("dxDeferRendering", {
    beforeEach: function() {
        savedTransitionExecutor = TransitionExecutorModule.TransitionExecutor;
    },
    afterEach: function() {
        TransitionExecutorModule.TransitionExecutor = savedTransitionExecutor;
    }
});

QUnit.test("dxDeferRendering warps content transparently (doesn't affect css styles)", function(assert) {
    var $deferRendering = $("#renderContent")
            .find(".defer-rendering")
            .dxDeferRendering();

    assert.ok(!$deferRendering.is(".dx-widget"));
});

QUnit.test("renderContent", function(assert) {
    var done = assert.async(),
        $test = $("#renderContent");

    var deferRendering = $test
        .find(".defer-rendering")
        .dxDeferRendering()
        .dxDeferRendering("instance");

    assert.ok(!$test.find(".item").is(":visible"));
    assert.equal($test.find(".dx-pending-rendering").length, 1);
    assert.ok($test.find(".dx-pending-rendering").is(".dx-pending-rendering-manual"));

    deferRendering.renderContent().done(function() {
        assert.ok($test.find(".item").is(":visible"));
        assert.equal($test.find(".dx-pending-rendering").length, 0);
        assert.equal($test.find(".dx-pending-rendering-manual").length, 0);

        done();
    });
});

QUnit.test("render delegate", function(assert) {
    var done = assert.async(),
        $test = $("#renderDelegate");

    $test
        .find(".defer-rendering")
        .dxDeferRendering()
        .dxDeferRendering("instance");

    assert.ok(!$test.find(".item").is(":visible"));
    assert.equal($test.find(".dx-pending-rendering").length, 1);
    assert.ok($test.find(".dx-pending-rendering").is(".dx-pending-rendering-manual"));

    var render = dataUtils.data($test.find(".dx-pending-rendering").get(0), "dx-render-delegate");
    render().done(function() {
        assert.ok($test.find(".item").is(":visible"));
        assert.equal($test.find(".dx-pending-rendering").length, 0);
        assert.equal($test.find(".dx-pending-rendering-manual").length, 0);

        done();
    });
});

QUnit.test("rendering state is set properly", function(assert) {
    var done = assert.async(),
        $test = $("#renderDelegate");

    $test.find(".defer-rendering").dxDeferRendering();

    var $deferRendering = $test.find(".dx-pending-rendering"),
        deferRendering = $deferRendering.dxDeferRendering("instance");

    assert.equal($deferRendering.length, 1);
    assert.ok($deferRendering.is(".dx-pending-rendering-manual"));

    $deferRendering.data("dx-render-delegate");

    deferRendering.renderContent().done(done);
    assert.ok($deferRendering.is(":not(.dx-pending-rendering-manual)"));
    assert.ok($deferRendering.is(".dx-pending-rendering"));
    assert.ok($deferRendering.is(".dx-pending-rendering-active"));
});

QUnit.test("renderWhen option (deferred)", function(assert) {
    var done = assert.async(),
        options = {
            renderWhen: $.Deferred(),
            onShown: function() {
                assert.ok(!$test.find(".item").is(".dx-invisible-while-pending-rendering"));
                assert.equal($test.find(".dx-pending-rendering").length, 0);
                assert.equal($test.find(".dx-pending-rendering-manual").length, 0);

                done();
            }
        },
        $test = $("#renderWhen");

    $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.ok(!$test.find(".item").is(":visible"));
    assert.ok($test.find(".item").is(".dx-invisible-while-pending-rendering"));
    assert.equal($test.find(".dx-pending-rendering").length, 1);
    assert.ok(!$test.find(".dx-pending-rendering").is(".dx-invisible-while-pending-rendering"));
    assert.ok(!$test.find(".dx-pending-rendering").is(".dx-pending-rendering-manual"));

    options.renderWhen.resolve();
});

QUnit.test("renderWhen option (boolean)", function(assert) {
    var done = assert.async(),
        options = {
            renderWhen: false,
            onShown: function() {
                assert.ok($test.find(".item").is(":visible"));
                assert.ok(!$test.find(".item").is(".dx-invisible-while-pending-rendering"));
                assert.equal($test.find(".dx-pending-rendering").length, 0);
                assert.equal($test.find(".dx-pending-rendering-manual").length, 0);

                done();
            }
        },
        $test = $("#renderWhen");

    var deferRendering = $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.ok(!$test.find(".item").is(":visible"));
    assert.ok($test.find(".item").is(".dx-invisible-while-pending-rendering"));
    assert.equal($test.find(".dx-pending-rendering").length, 1);
    assert.ok(!$test.find(".dx-pending-rendering").is(".dx-invisible-while-pending-rendering"));
    assert.ok(!$test.find(".dx-pending-rendering").is(".dx-pending-rendering-manual"));

    deferRendering.option("renderWhen", true);
});

QUnit.test("children are hidden while pending rendering", function(assert) {
    var done = assert.async(),
        options = {
            renderWhen: $.Deferred(),
            onShown: function() {
                assert.equal($test.find(".item1").length, 1);
                assert.ok(!$test.find(".item1").is(".dx-invisible-while-pending-rendering"));
                assert.equal($test.find(".item2").length, 1);
                assert.ok(!$test.find(".item2").is(".dx-invisible-while-pending-rendering"));
                assert.equal($test.find(".dx-deferrendering").length, 1);
                assert.ok(!$test.find(".dx-deferrendering").is(".dx-hidden"));

                done();
            }
        },
        $test = $("#hiddenUntilRendered");

    $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.equal($test.find(".item1").length, 1);
    assert.ok($test.find(".item1").is(".dx-invisible-while-pending-rendering"));
    assert.equal($test.find(".item2").length, 1);
    assert.ok($test.find(".item2").is(".dx-invisible-while-pending-rendering"));
    assert.equal($test.find(".dx-deferrendering").length, 1);
    assert.ok(!$test.find(".dx-deferrendering").is(".dx-hidden"));

    options.renderWhen.resolve();
});

QUnit.test("showLoadIndicator:false option", function(assert) {
    var done = assert.async(),
        options = {
            renderWhen: $.Deferred()
        },
        enterLog = [],
        startLog = [],
        $test = $("#showLoadIndicator");

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
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.equal($test.find(".dx-loadindicator").length, 0);

    options.renderWhen.resolve();
    assert.equal(enterLog.length, 0);
    assert.equal(startLog.length, 0);

    done();
});

QUnit.test("showLoadIndicator:true option", function(assert) {
    var options = {
            showLoadIndicator: true,
            renderWhen: $.Deferred()
        },
        $test = $("#showLoadIndicator");

    $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.equal($test.find(".dx-loadindicator").length, 1, "load indicator is rendered");
});

QUnit.test("Custom LoadIndicator (T392031)", function(assert) {
    var options = {
            showLoadIndicator: false,
            renderWhen: $.Deferred()
        },
        done = assert.async(),
        $test = $("#custom");

    var deferRendering = $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.ok($test.find(".indicator").is(":visible"), "load indicator is visible before rendering content");
    assert.ok(!$test.find(".content").is(":visible"), "content is not visible before rendering content");

    deferRendering.renderContent().done(function() {
        assert.ok(!$test.find(".indicator").is(":visible"), "load indicator is not visible after rendering content");
        assert.ok($test.find(".content").is(":visible"), "load indicator is not visible after rendering content");

        done();
    });
});

QUnit.test("Custom LoadIndicator with wrapper (T392031)", function(assert) {
    var options = {
            showLoadIndicator: false,
            renderWhen: $.Deferred()
        },
        done = assert.async(),
        $test = $("#customWithWrap");

    var deferRendering = $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.ok($test.find(".indicator").is(":visible"), "load indicator is visible before rendering content");
    assert.ok(!$test.find(".content").is(":visible"), "content is not visible before rendering content");

    deferRendering.renderContent().done(function() {
        assert.ok(!$test.find(".indicator").is(":visible"), "load indicator is not visible after rendering content");
        assert.ok($test.find(".content").is(":visible"), "load indicator is not visible after rendering content");

        done();
    });
});

QUnit.test("loading state with rendered content", function(assert) {
    assert.expect(4);

    var done = assert.async(),
        renderCount = 0,
        options = {
            showLoadIndicator: true,
            renderWhen: false,
            onRendered: function() {
                if(renderCount === 0) {
                    assert.equal($test.find(".dx-loadindicator").length, 0, "load indicator is removed after render");

                    deferRendering.option("renderWhen", false);
                    assert.equal($test.find(".dx-loadindicator").length, 1, "load indicator is shown again");

                    deferRendering.option("renderWhen", true);
                }
                if(renderCount === 1) {
                    assert.equal($test.find(".dx-loadindicator").length, 0, "load indicator is removed when rendered");
                    done();
                }
                renderCount++;
            }
        },
        $test = $("#showLoadIndicator");

    var deferRendering = $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.equal($test.find(".dx-loadindicator").length, 1, "load indicator is rendered");

    deferRendering.option("renderWhen", true);
});

QUnit.test("animation option", function(assert) {
    assert.expect(5);

    var done = assert.async(),
        animation = {
            type: "test"
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
                assert.equal(enterLog[0].$element[0], $test.find(".dx-deferrendering")[0]);
                assert.equal(enterLog[0].config.type, "test");

                done();
            }
        },
        enterLog = [],
        startLog = [],
        $test = $("#animation");

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
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    options.renderWhen.resolve();
});

QUnit.test("staggering animation options", function(assert) {
    assert.expect(7);

    var done = assert.async(),
        animation = {
            type: "test"
        },
        options = {
            animation: animation,
            staggerItemSelector: ".test-staggering-item",
            renderWhen: $.Deferred(),
            onShown: function() {
                assert.equal(enterLog.length, 2);
                assert.ok(enterLog[0].$element.is(".item1"));
                assert.ok(enterLog[0].config.type, "test");
                assert.ok(enterLog[1].$element.is(".item2"));
                assert.ok(enterLog[1].config.type, "test");

                assert.equal(startLog.length, 1);
                assert.equal(startLog[0], undefined);

                done();
            }
        },
        enterLog = [],
        startLog = [],
        $test = $("#staggering-animation")
        .clone()
        .appendTo($("body"));

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
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    options.renderWhen.resolve();
});

QUnit.test("staggering animation with items that are outside the screen", function(assert) {
    assert.expect(5);

    var done = assert.async(),
        animation = {
            type: "test"
        },
        options = {
            animation: animation,
            staggerItemSelector: ".test-staggering-item",
            renderWhen: $.Deferred(),
            onShown: function() {
                assert.equal(enterLog.length, 1, "the top item is not visible");
                assert.ok(enterLog[0].$element.is(".item2"));
                assert.ok(enterLog[0].config.type, "test");

                assert.equal(startLog.length, 1);
                assert.equal(startLog[0], undefined);

                done();
            }
        },
        enterLog = [],
        startLog = [],
        $test = $("#staggering-animation")
        .clone()
        .appendTo($("body"))
        .css("top", "-15px");//Hide the top item. It's of 10px height

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
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    options.renderWhen.resolve();
});

QUnit.test("stops on dispose (T315643)", function(assert) {
    var animation = {
            type: "test"
        },
        options = {
            animation: animation,
            renderWhen: $.Deferred()
        },
        stopLog = [],
        $test = $("#animation");

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
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.equal(stopLog.length, 0);

    options.renderWhen.resolve();
    assert.equal(stopLog.length, 0);

    $test.remove();
    assert.equal(stopLog.length, 1, "T315643");
    assert.equal(stopLog[0][0], true, "T370098");
});

QUnit.test("should support Promise/A+ standard", function(assert) {
    var resolve;
    var promise = new Promise(function(onResolve) {
        resolve = onResolve;
    });

    var options = {
            renderWhen: promise,
            onShown: function() {
                assert.ok(!$test.find(".item").is(".dx-invisible-while-pending-rendering"));
                assert.equal($test.find(".dx-pending-rendering").length, 0);
                assert.equal($test.find(".dx-pending-rendering-manual").length, 0);
            }
        },
        $test = $("#renderWhen");

    $test
        .find(".defer-rendering")
        .dxDeferRendering(options)
        .dxDeferRendering("instance");

    assert.ok(!$test.find(".item").is(":visible"));
    assert.ok($test.find(".item").is(".dx-invisible-while-pending-rendering"));
    assert.equal($test.find(".dx-pending-rendering").length, 1);
    assert.ok(!$test.find(".dx-pending-rendering").is(".dx-invisible-while-pending-rendering"));
    assert.ok(!$test.find(".dx-pending-rendering").is(".dx-pending-rendering-manual"));

    resolve();

    return promise;
});
