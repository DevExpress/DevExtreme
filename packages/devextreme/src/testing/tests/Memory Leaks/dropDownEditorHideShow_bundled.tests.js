import $ from 'jquery';
import DropDownEditor from 'ui/drop_down_editor/ui.drop_down_editor';
import GoogleProvider from 'ui/map/provider.dynamic.google';
import memoryLeaksHelper from '../../helpers/memoryLeaksHelper.js';

import 'bundles/modules/parts/widgets-web';

GoogleProvider.remapConstant('http://fakeUrl');

$.each(DevExpress.ui, function(componentName) {
    if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName) && DevExpress.ui[componentName].subclassOf(DropDownEditor)) {
        QUnit.test(componentName + ' should not leak memory by creating redundant event subscriptions after showing and hiding the drop down multiple times consecutively', function(assert) {
            const testNode = memoryLeaksHelper.createTestNode();
            const component = $(testNode)[componentName]()[componentName]('instance');
            component.open();
            component.close();
            const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
            component.open();
            component.close();
            const newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
            assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, 'After a dropDownEditor is shown and hidden multiple times consecutively, no additional event subscriptions must be created');
            memoryLeaksHelper.destroyTestNode(testNode);
        });
    }
});
