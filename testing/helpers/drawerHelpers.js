function checkBoundingClientRect(assert, element, expectedRect, elementName) {
    assert.ok(!!element, elementName + ' is defined');
    if(element) {
        const rect = element.getBoundingClientRect();
        let isCorrect = true;
        let message = `${elementName} rect is incorrect`;
        for(const memberName in expectedRect) {
            message += `, ${memberName}:[${rect[memberName]}/${expectedRect[memberName]}]`;
            if(rect[memberName] !== expectedRect[memberName]) {
                isCorrect = false;
            }
        }
        assert.strictEqual(isCorrect, true, message + ', [actual/expected]');
    }
}

function checkMargin(assert, element, top, right, bottom, left, message) {
    assert.strictEqual(window.getComputedStyle(element).marginLeft, left + 'px', 'marginLeft, ' + message);
    assert.strictEqual(window.getComputedStyle(element).marginTop, top + 'px', 'marginTop, ' + message);
    assert.strictEqual(window.getComputedStyle(element).marginRight, right + 'px', 'marginRight, ' + message);
    assert.strictEqual(window.getComputedStyle(element).marginBottom, bottom + 'px', 'marginBottom, ' + message);
}

function checkWhenPanelContentRendered(assert, drawer, drawerElement, panelTemplateElement, expectedPanelRect, expectedViewRect) {
    const drawerRect = drawerElement.getBoundingClientRect();

    // Check Panel element rect

    if(!drawer.option('minSize') && drawer.option('openedStateMode') !== 'overlap') {
        const panelRect = panelTemplateElement.parentElement.getBoundingClientRect();
        assert.strictEqual(
            panelRect.right < drawerRect.left
            || panelRect.left > drawerRect.right
            || panelRect.bottom < drawerRect.top
            || panelRect.top > drawerRect.bottom,
            true,
            'panel should be out of drawerRect, ' +
            `left:[${panelRect.left}/${drawerRect.left}], top:[${panelRect.top}/${drawerRect.top}], ` +
            `right:[${panelRect.right}/${drawerRect.right}], bottom:[${panelRect.bottom}/${drawerRect.bottom}], [panel/drawer]`);
    } else {
        if(drawer.option('minSize') && (drawer.option('openedStateMode') === 'overlap')) {
            checkBoundingClientRect(assert, panelTemplateElement.parentElement, expectedPanelRect, 'panel');
        }
    }

    // Check View element rect

    if(!drawer.option('minSize') || (drawer.option('openedStateMode') === 'overlap')) {
        checkBoundingClientRect(assert, document.getElementById('view'), expectedViewRect, 'view');
    }
}

const leftTemplateSize = 150;
const LeftDrawerTester = {
    templateSize: leftTemplateSize,
    template: () => `<div id="template" style="width: ${leftTemplateSize}px; height: 100%; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + leftTemplateSize, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + leftTemplateSize, top: env.drawerRect.top, width: env.drawerRect.width - leftTemplateSize, height: env.drawerRect.height }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position');
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template.parentElement size should not cut template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + env.minSize, top: env.drawerRect.top, width: 200 - env.minSize, height: 100 }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view');
        }
        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            shading: drawer.option('shading'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkHidden: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + env.minSize, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');

            assert.ok(
                window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible');
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
                checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.minSize, height: env.drawerRect.height }, 'template.parentElement');
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left - leftTemplateSize + env.minSize, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
                checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, -leftTemplateSize + env.minSize, 'template should not be visible by position');
            }
            assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + env.minSize, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.minSize) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.minSize, height: env.drawerRect.height }, 'template.parentElement');
                } else if(env.templateElement === null) {
                    assert.strictEqual(env.templateElement, null); // Scenarios (overlap, left, expand): opened: false, visible: false -> visible: true
                } else {
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.minSize, height: env.drawerRect.height }, 'template.parentElement');
                }
            } else {
                if(env.templateElement) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left - leftTemplateSize + env.minSize, top: env.drawerRect.top, width: leftTemplateSize, height: env.drawerRect.height }, 'template');
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowX, 'hidden', 'template is shown out of bounds and not visible because of overflowX is hidden');
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + env.minSize, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkWhenPanelContentRendered: function(assert, drawer, drawerElement, panelTemplateElement) {
        const { top, left, width, height } = drawerElement.getBoundingClientRect();
        const expectedPanelRect = { top, left, width, height };
        const expectedViewRect = { top, left, width, height };
        if(drawer.option('minSize')) {
            expectedPanelRect.width = drawer.option('minSize');
            expectedViewRect.left += drawer.option('minSize');
            expectedViewRect.width -= drawer.option('minSize');
        }
        checkWhenPanelContentRendered(assert, drawer, drawerElement, panelTemplateElement, expectedPanelRect, expectedViewRect);
    }
};

const rightTemplateSize = 150;
const RightDrawerTester = {
    templateSize: rightTemplateSize,
    template: () => `<div id="template" style="width: ${rightTemplateSize}px; height: 100%; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.right - rightTemplateSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left - rightTemplateSize + env.minSize, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.right - rightTemplateSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width - rightTemplateSize, height: env.drawerRect.height }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position');
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template.parentElement size should not cut template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200 - env.minSize, height: 100 }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            shading: drawer.option('shading'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkHidden: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.minSize) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.right - rightTemplateSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template');
                }
                assert.ok( // Scenarios (push, right, expand): opened: false
                    window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                    window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                    'template element should be hidden, view element should be visible');
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.right - rightTemplateSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template');
                assert.ok(
                    window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                    window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                    'template element should be hidden, view element should be visible');
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.right - env.minSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template');
                checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.right - env.minSize, top: env.drawerRect.top, width: env.minSize, height: env.drawerRect.height }, 'template.parentElement');
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.right - env.minSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template');
                checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.right - env.minSize, top: env.drawerRect.top, width: rightTemplateSize, height: env.drawerRect.height }, 'template.parentElement');
                checkMargin(assert, env.templateElement.parentElement, 0, -rightTemplateSize + env.minSize, 0, 0, 'template should not be visible by position');
            }
            assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width - env.minSize, height: env.drawerRect.height }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.minSize) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 200 - env.minSize, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left + 200 - env.minSize, top: env.drawerRect.top, width: env.minSize, height: 100 }, 'template.parentElement');
                } else if(env.templateElement === null) {
                    assert.ok(true); // Scenarios (overlap, right, expand): opened: false, visible: false -> visible: true
                } else {
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { width: 0 }, 'template.parentElement'); // Scenarios (overlap, left, expand): opened: false
                }
            } else {
                if(env.templateElement || env.minSize) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 200 - env.minSize, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowX, 'hidden', 'template is shown out of bounds and not visible because of overflowX is hidden');
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200 - env.minSize /* slide, shading: true, minSize: 25) */, height: 100 }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkWhenPanelContentRendered: function(assert, drawer, drawerElement, panelTemplateElement) {
        const { top, left, width, height } = drawerElement.getBoundingClientRect();
        const expectedPanelRect = { top, left, width, height };
        const expectedViewRect = { top, left, width, height };
        if(drawer.option('minSize')) {
            expectedPanelRect.left += expectedPanelRect.wight - drawer.option('minSize');
            expectedPanelRect.width = drawer.option('minSize');
            expectedViewRect.width -= drawer.option('minSize');
        }
        checkWhenPanelContentRendered(assert, drawer, drawerElement, panelTemplateElement, expectedPanelRect, expectedViewRect);
    }
};

const topTemplateSize = 75;
const TopDrawerTester = {
    templateSize: topTemplateSize,
    template: () => `<div id="template" style="width: 100%; height: ${topTemplateSize}px; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: topTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + topTemplateSize, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: topTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + topTemplateSize, width: env.drawerRect.width, height: env.drawerRect.height - topTemplateSize }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position');
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: topTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: topTemplateSize }, 'template.parentElement size should not cut template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + env.minSize, width: 200, height: 100 - env.minSize }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            shading: drawer.option('shading'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkHidden: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: topTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + env.minSize, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');

            assert.ok(
                window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible');
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: topTemplateSize }, 'template');
                checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: env.minSize }, 'template.parentElement');
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top - topTemplateSize + env.minSize, width: env.drawerRect.width, height: topTemplateSize }, 'template');
                checkMargin(assert, env.templateElement.parentElement, -topTemplateSize + env.minSize, 0, 0, 0, 'template should not be visible by position');
            }
            assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + env.minSize, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.minSize) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: topTemplateSize }, 'template');
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: env.minSize }, 'template.parentElement should cut template to minSize');
                } else {
                    if(env.templateElement === null) {
                        assert.ok(true); // Scenarios (overlap, top, expand): opened: false, visible: false -> visible: true
                    } else {
                        checkBoundingClientRect(assert, env.templateElement.parentElement, { height: 0 }, 'template.parentElement'); // Scenarios (overlap, top, expand): opened: false
                    }
                }
            } else {
                if(env.templateElement) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top - topTemplateSize + env.minSize, width: 200, height: topTemplateSize }, 'template');
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowY, 'hidden', 'template is shown out of bounds and not visible because of overflowY is hidden');
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + env.minSize, width: 200, height: 100 - env.minSize }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkWhenPanelContentRendered: function(assert, drawer, drawerElement, panelTemplateElement) {
        const { top, left, width, height } = drawerElement.getBoundingClientRect();
        const expectedPanelRect = { top, left, width, height };
        const expectedViewRect = { top, left, width, height };
        if(drawer.option('minSize')) {
            expectedPanelRect.height = drawer.option('minSize');
            expectedViewRect.top += drawer.option('minSize');
            expectedViewRect.height -= drawer.option('minSize');
        }
        checkWhenPanelContentRendered(assert, drawer, drawerElement, panelTemplateElement, expectedPanelRect, expectedViewRect);
    }
};

const bottomTemplateSize = 75;
const BottomDrawerTester = {
    templateSize: bottomTemplateSize,
    template: () => `<div id="template" style="width: 100%; height: ${bottomTemplateSize}px; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - bottomTemplateSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top - bottomTemplateSize + env.minSize, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - bottomTemplateSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: env.drawerRect.height - bottomTemplateSize }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position');
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: bottomTemplateSize }, 'template.parentElement size should not cut template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + env.minSize, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            shading: drawer.option('shading'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkHidden: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - bottomTemplateSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');

            assert.ok(
                window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible');
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
                checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: env.minSize }, 'template.parentElement');
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
                checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template.parentElement');
                checkMargin(assert, env.templateElement.parentElement, 0, 0, -bottomTemplateSize + env.minSize, 0, 'template should not be visible by position');
            }
            assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.minSize) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: bottomTemplateSize }, 'template');
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: env.minSize }, 'template.parentElement should cut template to minSize');
                } else {
                    if(env.templateElement === null) {
                        assert.ok(true); // Scenarios (overlap, top, expand): opened: false, visible: false -> visible: true
                    } else {
                        checkBoundingClientRect(assert, env.templateElement.parentElement, { height: 0 }, 'template.parentElement'); // Scenarios (overlap, top, expand): opened: false
                    }
                }
            } else {
                if(env.templateElement) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.bottom - env.minSize, width: env.drawerRect.width, height: env.minSize }, 'template');
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowY, 'hidden', 'template is shown out of bounds and not visible because of overflowY is hidden');
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: env.drawerRect.width, height: env.drawerRect.height - env.minSize }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawer,
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode'),
            minSize: drawer.option('minSize') || 0
        };

        if(drawer.option('openedStateMode') === 'overlap') {
            checkOverlap(assert, env);
        } else if(drawer.option('openedStateMode') === 'push') {
            checkPush(assert, env);
        } else if(drawer.option('openedStateMode') === 'shrink') {
            checkShrink(assert, env);
        } else {
            assert.notOk('configuration is not tested');
        }
    },

    checkWhenPanelContentRendered: function(assert, drawer, drawerElement, panelTemplateElement) {
        const { top, left, width, height } = drawerElement.getBoundingClientRect();
        const expectedPanelRect = { top, left, width, height };
        const expectedViewRect = { top, left, width, height };
        if(drawer.option('minSize')) {
            expectedPanelRect.top = expectedPanelRect.height + drawer.option('minSize');
            expectedPanelRect.height = drawer.option('minSize');
            expectedViewRect.height -= drawer.option('minSize');
        }
        checkWhenPanelContentRendered(assert, drawer, drawerElement, panelTemplateElement, expectedPanelRect, expectedViewRect);
    }
};

const drawerElementId = 'drawer1';
export const drawerTesters = {
    drawerElementId: drawerElementId,
    markup: `
        <div id="${drawerElementId}" style="background-color: blue; width: 200px; height: 100px">
            <div id="view" style="width: 100%; height: 100%; background-color: yellow">view</div>
        </div>`,
    left: LeftDrawerTester,
    top: TopDrawerTester,
    right: RightDrawerTester,
    bottom: BottomDrawerTester
};
