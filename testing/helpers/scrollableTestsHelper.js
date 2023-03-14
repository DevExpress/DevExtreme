import devices from 'core/devices';
import { calculateScrollbarWidth } from '__internal/grids/pivot_grid/widget_utils';

const SCROLLABLE_CONTAINER = 'dx-scrollable-container';
const SCROLLABLE_CONTENT = 'dx-scrollable-content';

export function checkScrollableSizes(assert, $rootContainer, { id, width, height, containerWidth, containerScrollWidth, containerHeight, containerScrollHeight, nestedElementWidth, nestedElementHeight, overflowX, overflowY, useNativeScrolling, configDetails }) {
    const nativeScrollbarWidth = calculateScrollbarWidth();

    let expectedContainerClientWidth = containerWidth;

    if(useNativeScrolling && overflowY) {
        expectedContainerClientWidth = containerWidth - nativeScrollbarWidth;
    }

    let expectedContainerClientHeight = containerHeight;
    if(useNativeScrolling && overflowX) {
        expectedContainerClientHeight = containerHeight - nativeScrollbarWidth;
    }

    let expectedContainerScrollWidth = containerScrollWidth;
    if(!overflowX && useNativeScrolling && overflowY) {
        expectedContainerScrollWidth = containerScrollWidth - nativeScrollbarWidth;
    }

    let expectedContainerScrollHeight = containerScrollHeight;
    if(devices.real().ios) {
        if(useNativeScrolling) {
            expectedContainerScrollHeight = containerScrollHeight + (overflowY ? 0 : 1); // magic numbers for ios: min-height: 101%;
        }
    } else if(useNativeScrolling && overflowX && !overflowY) {
        expectedContainerScrollHeight = containerScrollHeight - nativeScrollbarWidth;
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
