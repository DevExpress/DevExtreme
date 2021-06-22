import $ from 'jquery';
import 'ui/gantt';
import { Consts } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Root Value', moduleConfig, () => {
    test('Default value with parentId as 0', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks }
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Default value with parentId as undefined', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': undefined, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks }
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Root Value is 0', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            rootValue: 0
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Root Value is undefined', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': undefined, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            rootValue: undefined
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Root Value is null', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': null, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            rootValue: null
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
});
