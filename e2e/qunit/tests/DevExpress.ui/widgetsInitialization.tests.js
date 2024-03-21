import { widgetsList } from '../../helpers/widgetsList.js';

QUnit.module('Widget initialization', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
    }
}, () => {
    Object.keys(widgetsList).forEach(function(widget) {
        [true, false].forEach(function(templatesRenderAsynchronously) {
            QUnit.test(`${widget} templatesRenderAsynchronously set to ${templatesRenderAsynchronously} on init`, function(assert) {
                this.clock = sinon.useFakeTimers();
                this.instance = new widgetsList[widget](this.element, { templatesRenderAsynchronously });
                this.clock.tick();
                assert.strictEqual(this.instance.option('templatesRenderAsynchronously'), templatesRenderAsynchronously);
                this.instance.dispose();
                this.clock.restore();
            });
        });
    });
});
