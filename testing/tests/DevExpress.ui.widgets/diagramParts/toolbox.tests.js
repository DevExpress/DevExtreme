import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

const TOOLBOX_SCROLLVIEW_SELECTOR = '.dx-diagram-toolbox-panel .dx-scrollview';
const TOOLBOX_ACCORDION_SELECTOR = '.dx-diagram-toolbox-panel .dx-accordion';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Toolbox', moduleConfig, () => {
    test('should not render if toolbox.visible is false', function(assert) {
        this.instance.option('toolbox.visible', false);
        const $accordion = $('body').find(TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
    });
    test('should fill toolbox with default items', function(assert) {
        const accordion = $('body').find(TOOLBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.ok(accordion.option('dataSource').length > 1);
    });
    test('should fill toolbox with custom items', function(assert) {
        this.instance.option('toolbox.groups', ['general']);
        const accordion = $('body').find(TOOLBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.equal(accordion.option('dataSource').length, 1);
    });
    test('call .update() after accordion item collapsing/expanding', function(assert) {
        const clock = sinon.useFakeTimers();
        const $scrollView = $('body').find(TOOLBOX_SCROLLVIEW_SELECTOR);
        const scrollView = $scrollView.dxScrollView('instance');
        const updateSpy = sinon.spy(scrollView, 'update');
        const $accordion = $('body').find(TOOLBOX_ACCORDION_SELECTOR);
        $accordion.find('.dx-accordion-item-title').first().trigger('dxclick');
        clock.tick(2000);
        assert.equal(updateSpy.callCount, 1, 'scrollView.update() called once');
        clock.restore();
    });
});
