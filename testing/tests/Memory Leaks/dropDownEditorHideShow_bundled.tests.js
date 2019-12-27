const $ = require('jquery');
const DropDownEditor = require('ui/drop_down_editor/ui.drop_down_editor');
const GoogleProvider = require('ui/map/provider.dynamic.google');
const memoryLeaksHelper = require('../../helpers/memoryLeaksHelper.js');

require('bundles/modules/parts/widgets-all');

GoogleProvider.remapConstant('http://fakeUrl');

$.each(DevExpress.ui, function(componentName) {
    if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName) && DevExpress.ui[componentName].subclassOf(DropDownEditor)) {
        QUnit.test(componentName + ' should not leak memory by creating redundant event subscriptions after showing and hiding the drop down multiple times consecutively', function(assert) {
            const testNode = memoryLeaksHelper.createTestNode();
            const component = $(testNode)[componentName]()[componentName]('instance');
            let newEventSubscriptions;
            component.open();
            component.close();
            const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
            component.open();
            component.close();
            newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
            assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, 'After a dropDownEditor is shown and hidden multiple times consecutively, no additional event subscriptions must be created');
            memoryLeaksHelper.destroyTestNode(testNode);
        });
    }
});
