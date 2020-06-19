import { widgetsList } from '../../helpers/widgetsList.js';

QUnit.module('Widget initialization', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.tick();
        this.instance.dispose();
        this.clock.restore();
    }
});

Object.keys(widgetsList).forEach(function(widget) {
    [true, false].forEach(function(templatesRenderAsynchronously) {
        QUnit.test(`${widget} templatesRenderAsynchronously option check`, function(assert) {
            this.instance = new widgetsList[widget](this.element, { templatesRenderAsynchronously: templatesRenderAsynchronously });
            assert.strictEqual(this.instance.option('templatesRenderAsynchronously'), templatesRenderAsynchronously, `it is possible to set ${templatesRenderAsynchronously} templatesRenderAsynchronously option value for the ${widget} widget`);
        });
    });
});
