import $ from 'jquery';
import devices from 'core/devices';
import browser from 'core/utils/browser';

const SCROLLABLE_CONTAINER = 'dx-scrollable-container';
const SCROLLABLE_CONTENT = 'dx-scrollable-content';

const $tempVScrollBar = $('<div id="getVScrollBarWidth" style="width: 75px; height: 100px"><div style="width: 125px; height: 150px"></div></div>');
$('#qunit').append($tempVScrollBar);
$tempVScrollBar.dxScrollable({ direction: 'both', useNative: true });
const $tempVScrollBarContainer = $tempVScrollBar.find(`.${SCROLLABLE_CONTAINER}`);

export const nativeVScrollBarWidth = $tempVScrollBarContainer[0].offsetWidth - $tempVScrollBarContainer[0].clientWidth;
export const nativeVScrollBarHeight = $tempVScrollBarContainer[0].offsetHeight - $tempVScrollBarContainer[0].clientHeight;

$tempVScrollBar.remove();

export function checkScrollableSizes(assert, $rootContainer, { id, width, height, containerWidth, containerScrollWidth, containerHeight, containerScrollHeight, nestedElementWidth, nestedElementHeight, overflowX, overflowY, useNativeScrolling, configDetails }) {
    let expectedContainerClientWidth = containerWidth;
    if(browser.msie) {
        if(useNativeScrolling && overflowY || useNativeScrolling && overflowX) {
            expectedContainerClientWidth = containerWidth - nativeVScrollBarWidth;
        }
    } else if(useNativeScrolling && overflowY) {
        expectedContainerClientWidth = containerWidth - nativeVScrollBarWidth;
    }

    let expectedContainerClientHeight = containerHeight;
    if(useNativeScrolling && overflowX) {
        expectedContainerClientHeight = containerHeight - nativeVScrollBarHeight;
    }

    let expectedContainerScrollWidth = containerScrollWidth;
    if(!overflowX && useNativeScrolling && overflowY) {
        expectedContainerScrollWidth = containerScrollWidth - nativeVScrollBarWidth;
    }

    let expectedContainerScrollHeight = containerScrollHeight;
    if(devices.real().ios) {
        if(useNativeScrolling) {
            expectedContainerScrollHeight = containerScrollHeight + (overflowY ? 2 : 3); // magic numbers for ios: padding-top: 1px; padding-bottom: 1px; min-height: 101%;
        }
    } else if(browser.msie) {
        if(useNativeScrolling && overflowX && !overflowY && configDetails !== 'insideResponsiveBox') {
            expectedContainerScrollHeight = containerScrollHeight - nativeVScrollBarHeight;
        }
    } else if(useNativeScrolling && overflowX && !overflowY) {
        expectedContainerScrollHeight = containerScrollHeight - nativeVScrollBarHeight;
    }

    const $scrollable = $rootContainer.find(`#${id}`);
    assert.equal($scrollable[0].clientWidth, width, `${id}: scrollable.clientWidth`);
    assert.equal($scrollable[0].clientHeight, height, `${id}: scrollable.clientHeight`);

    const $container = $scrollable.find(`.${SCROLLABLE_CONTAINER}`);
    assert.strictEqual($container[0].clientWidth, expectedContainerClientWidth, `${id}: container.clientWidth`);
    assert.strictEqual($container[0].scrollWidth, expectedContainerScrollWidth, `${id}: container.scrollWidth`);
    assert.strictEqual($container[0].clientHeight, expectedContainerClientHeight, `${id}: container.clientHeight`);

    if(Array.isArray(containerScrollHeight)) {
        assert.ok($container[0].scrollHeight > containerScrollHeight[0] && $container[0].scrollHeight < containerScrollHeight[1], 'container.scrollHeight(' + $container[0].scrollHeight + ')');
    } else {
        assert.strictEqual($container[0].scrollHeight, expectedContainerScrollHeight, `${id}: container.scrollHeigh`);
    }

    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT}`).children();
    assert.equal($content[0].clientWidth, nestedElementWidth, `${id}: content.clientWidth`);
    if(Array.isArray(nestedElementHeight)) {
        assert.ok($content[0].clientHeight > nestedElementHeight[0] && $content[0].clientHeight < nestedElementHeight[1], `${id}: content.clientHeight(${$content[0].clientHeight})`);
    } else {
        assert.equal($content[0].clientHeight, nestedElementHeight, `${id}: content.clientHeight`);
    }
}

export function QUnitTestIfSupported(name, isSupported, testCallback) {
    if(isSupported /* TODO: ScrollView/Tree/Tile within ResponsiveBox are incorrectly painted if placed in two columns and 'flex' strategy is active. We will review these configs in future. */) {
        QUnit.test.call(null, name, testCallback);
    } else {
        QUnit.skip.call(null, 'TODO: ' + name, testCallback);
    }
}
