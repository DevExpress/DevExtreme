import eventsEngine from 'common/core/events/core/events_engine';
import { removeEvent } from 'common/core/events/remove';
import {
    subscribeNodesDisposing,
    unsubscribeNodesDisposing,
} from '__internal/events/utils/m_event_nodes_disposing';

QUnit.testStart(function() {
    const markup = '<button id="test-element">Test</button>';
    const fixture = document.getElementById('qunit-fixture');
    if(fixture) {
        fixture.innerHTML = markup;
    }
});

QUnit.module('event nodes disposing');

QUnit.test('should clean elementDataMap when using subscribeNodesDisposing and unsubscribeNodesDisposing for click', function(assert) {
    const testElement = document.getElementById('test-element');

    const clickEvent = eventsEngine.Event('click', {
        target: testElement,
        currentTarget: document,
        delegateTarget: document
    });

    const subscriptionData = subscribeNodesDisposing(clickEvent, function() {});

    const afterSubscribeElementData = eventsEngine.elementDataMap.get(document);
    const afterSubscribeHandleObjectsCount = afterSubscribeElementData && afterSubscribeElementData[removeEvent]
        ? afterSubscribeElementData[removeEvent].handleObjects.length
        : 0;

    unsubscribeNodesDisposing(clickEvent, subscriptionData.callback, subscriptionData.nodes);

    const finalElementData = eventsEngine.elementDataMap.get(document);
    const afterUnsubscribeHandleObjectsCount = finalElementData && finalElementData[removeEvent]
        ? finalElementData[removeEvent].handleObjects.length
        : 0;

    assert.ok(
        afterSubscribeHandleObjectsCount <= 1,
        `HandleObjects should be added for "${removeEvent}" event after subscribe. HandleObjects count: ${afterSubscribeHandleObjectsCount};`
    );

    assert.equal(
        afterUnsubscribeHandleObjectsCount,
        0,
        `HandleObjects should be removed for "${removeEvent}" event after unsubscribe. HandleObjects count: ${afterUnsubscribeHandleObjectsCount};`
    );
});
