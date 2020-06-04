import $ from 'jquery';
import registerComponent from 'core/component_registrator';
import PreactWrapper from 'renovation/preact-wrapper/component';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="components">
            <div id="component"></div>
        </div>
    `);
});

import * as Preact from 'preact';
import { useEffect } from 'preact/hooks';
const PreactTestWidget = (props) => {
    useEffect(function() {
        props.subscribeEffect && props.subscribeEffect();

        return () => props.unsubscribeEffect && props.unsubscribeEffect();
    }, [props.subscribeEffect, props.unsubscribeEffect]);
    return Preact.h('div', Object.assign({}, props));
};

class TestWidget extends PreactWrapper {
    get _viewComponent() {
        return PreactTestWidget;
    }
}
registerComponent('dxRenovatedJQueryWidget', TestWidget);

const config = {
    beforeEach: function(module) {
        // it needs for Preact timers https://github.com/preactjs/preact/blob/master/hooks/src/index.js#L273
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.tick(100);
        this.clock.restore();
    }
};

QUnit.module('Lifecycle', config);

QUnit.test('should overwrite predefined dimensions', function(assert) {
    const subscribeEffect = sinon.spy();
    const unsubscribeEffect = sinon.spy();
    $('#component').dxRenovatedJQueryWidget({
        subscribeEffect,
        unsubscribeEffect
    });

    this.clock.tick(100);
    assert.equal(subscribeEffect.callCount, 1);
    assert.equal(unsubscribeEffect.callCount, 0);

    $('#components').empty();

    this.clock.tick(100);
    assert.equal(subscribeEffect.callCount, 1);
    assert.equal(unsubscribeEffect.callCount, 1);
});
