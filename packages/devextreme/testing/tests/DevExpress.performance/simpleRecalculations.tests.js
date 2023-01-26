const $ = require('jquery');

require('../../helpers/qunitPerformanceExtension.js');
require('../../helpers/widgetsIterator.js');


QUnit.testStart(function() {
    $('#qunit-fixture').addClass('qunit-fixture-visible');
});

QUnit.skip('Animation performance test', function(assert) {
    const $div = $('<div>').appendTo($('body'));
    $div.css({
        'transitionProperty': 'none'
    });

    $div.css('zIndex', 1);
    $div.css('left', 0);
    $div.css('opacity', 1);
    $div.css('transform', 'translate(1000px,0px)');

    const $div2 = $('<div>').appendTo($('body'));
    $div2.css({
        'transitionProperty': 'none'
    });

    $div2.css('zIndex', 1);
    $div2.css('left', 0);
    $div2.css('opacity', 1);
    $div2.css('transform', 'translate(1000px,0px)');

    $div2.css({
        'transitionProperty': 'all',
        'transitionDelay': 100 + 'ms',
        'transitionDuration': 1000 + 'ms',
        'transitionTimingFunction': 'ease'
    });


    const measureFunction = function() {
        const deferred = $.Deferred();
        $div.on('transitionend', function() {
            deferred.resolve();
        });

        $div.css('transform');

        $div.css('left', 0);
        $div.css('opacity', 1);
        $div.css('transform', 'translate(100px,0)');

        $div2.on('transitionend', function() {
            deferred.resolve();
        });

        $div2.css('transform');

        $div2.css('left', 0);
        $div2.css('opacity', 1);
        $div2.css('transform', 'translate(100px,0)');


        // $div.css("left", 0);
        // $div.css("opacity", 1);
        // $div.css("transform", "translate3d(200px,0,0)");

        // $div.css("left", 0);
        // $div.css("opacity", 1);
        // $div.css("transform", "translate3d(300px,0,0)");

        return deferred;
    };

    assert.measureStyleRecalculation(measureFunction, 1);
});
