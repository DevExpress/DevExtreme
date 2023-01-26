import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { Consts, findViewToolbarItem, findContextMenuItem } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram({
            toolbox: {
                visibility: 'visible'
            }
        });
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Toolbox', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should render if toolbox.visibility is "visible"', function(assert) {
        this.instance.option('toolbox.visibility', 'visible');
        const $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), true);
    });
    test('should not render if toolbox.visibility is "disabled"', function(assert) {
        this.instance.option('toolbox.visibility', 'disabled');
        const $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
    });
    test('should render invisible if toolbox.visibility is "collapsed"', function(assert) {
        this.instance.option('toolbox.visibility', 'collapsed');
        let $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
        const optionsButton = findViewToolbarItem(this.$element, 'settings');
        optionsButton.trigger('dxclick');
        const showToolboxButton = findContextMenuItem(this.$element, 'show toolbox');
        showToolboxButton.trigger('dxclick');
        $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), true);
        showToolboxButton.trigger('dxclick');
        this.clock.tick(2000);
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), false);
    });
    test('should fill toolbox with default items', function(assert) {
        const accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.ok(accordion.option('dataSource').length > 1);
    });
    test('should fill toolbox with custom items', function(assert) {
        this.instance.option('toolbox.groups', ['general']);
        const accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.equal(accordion.option('dataSource').length, 1);
    });
    test('should expanded first group be default', function(assert) {
        const accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.equal(accordion.option('selectedItems').length, 1);
        assert.equal(accordion.option('selectedItems')[0], accordion.option('dataSource')[0]);

        this.instance.option('toolbox.groups', ['general', { category: 'containers', title: 'Containers', expanded: true }]);
        assert.equal(accordion.option('selectedItems').length, 2);
        assert.equal(accordion.option('selectedItems')[0], accordion.option('dataSource')[0]);
        assert.equal(accordion.option('selectedItems')[1], accordion.option('dataSource')[1]);

        this.instance.option('toolbox.groups', ['containers', 'orgChart']);
        assert.equal(accordion.option('selectedItems').length, 1);
        assert.equal(accordion.option('selectedItems')[0], accordion.option('dataSource')[0]);
    });
    test('should hide toolbox search input', function(assert) {
        let $input = $('#qunit-fixture').find(Consts.TOOLBOX_INPUT_CONTAINER_SELECTOR);
        assert.equal($input.length, 1);
        assert.equal($input.is(':visible'), true);
        this.instance.option('toolbox.showSearch', false);
        $input = $('#qunit-fixture').find(Consts.TOOLBOX_INPUT_CONTAINER_SELECTOR);
        assert.equal($input.length, 0);
    });
    test('should set toolbox width', function(assert) {
        let $input = $('#qunit-fixture').find(Consts.TOOLBOX_INPUT_CONTAINER_SELECTOR);
        let $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($input.length, 1);
        assert.notEqual($input.width(), 300);
        assert.equal($accordion.length, 1);
        assert.notEqual($accordion.width(), 300);
        this.instance.option('toolbox.width', 300);
        $input = $('#qunit-fixture').find(Consts.TOOLBOX_INPUT_CONTAINER_SELECTOR);
        $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($input.length, 1);
        assert.equal($input.width(), 300);
        assert.equal($accordion.length, 1);
        assert.equal($accordion.width(), 300);
    });
    test('call .update() after accordion item collapsing/expanding', function(assert) {
        const clock = sinon.useFakeTimers();
        const $scrollView = $('#qunit-fixture').find(Consts.TOOLBOX_SCROLLVIEW_SELECTOR);
        const scrollView = $scrollView.dxScrollView('instance');
        const updateSpy = sinon.spy(scrollView, 'update');
        const $accordion = $('#qunit-fixture').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        $accordion.find('.dx-accordion-item-title').first().trigger('dxclick');
        clock.tick(2000);
        assert.equal(updateSpy.callCount, 1, 'scrollView.update() called once');
        clock.restore();
    });
});
