import $ from "jquery";

const SCROLLABLE_CONTAINER = "dx-scrollable-container";
const SCROLLABLE_CONTENT = "dx-scrollable-content";

const $tempVScrollBar = $('<div id="getVScrollBarWidth" style="width: 50px; height: 50px"><div style="width: 25px; height: 100px"></div></div>');
$("#qunit").append($tempVScrollBar);
$tempVScrollBar.dxScrollable({ direction: "both", useNative: true });
const $tempVScrollBarContainer = $tempVScrollBar.find(`.${SCROLLABLE_CONTAINER}`);

export const nativeVScrollBarWidth = $tempVScrollBarContainer[0].offsetWidth - $tempVScrollBarContainer[0].clientWidth;

$tempVScrollBar.remove();

export function checkScrollableSizes(assert, $rootContainer, { id, width, height, containerWidth, containerScrollWidth, containerHeight, containerScrollHeight, nestedElementWidth, nestedElementHeight }) {
    const $scrollable = $rootContainer.find(`#${id}`);
    assert.equal($scrollable[0].clientWidth, width, `${id}: scrollable.clientWidth`);
    assert.equal($scrollable[0].clientHeight, height, `${id}: scrollable.clientHeight`);

    const $container = $scrollable.find(`.${SCROLLABLE_CONTAINER}`);
    assert.roughEqual($container[0].clientWidth, containerWidth, 1.1, `${id}: container.clientWidth`);
    assert.roughEqual($container[0].scrollWidth, containerScrollWidth, 1.1, `${id}: container.scrollWidth`);
    assert.roughEqual($container[0].clientHeight, containerHeight, 1.1, `${id}: container.clientHeight`);
    if(Array.isArray(containerScrollHeight)) {
        assert.ok($container[0].scrollHeight > containerScrollHeight[0] && $container[0].scrollHeight < containerScrollHeight[1], "container.scrollHeight(" + $container[0].scrollHeight + ")");
    } else {
        assert.roughEqual($container[0].scrollHeight, containerScrollHeight, 1.1, `${id}: container.scrollHeigh`);
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
    if(isSupported /* TODO: Chrome/FF/Opera paints some ResponsiveBox configs in unexpected way. We will include these configs when improve our code for these browsers. */) {
        QUnit.test.call(null, name, testCallback);
    } else {
        QUnit.skip.call(null, "TODO: " + name, testCallback);
    }
}
