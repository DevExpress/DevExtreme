function checkBoundingClientRect(assert, element, expectedRect, elementName) {
    assert.ok(!!element, elementName + ' is defined');
    if(element) {
        const rect = element.getBoundingClientRect();
        for(const memberName in expectedRect) {
            assert.strictEqual(rect[memberName], expectedRect[memberName], elementName + '.' + memberName);
        }
    }
}

function checkMargin(assert, element, top, right, bottom, left, message) {
    assert.strictEqual(window.getComputedStyle(element).marginLeft, left + 'px', 'marginLeft, ' + message);
    assert.strictEqual(window.getComputedStyle(element).marginTop, top + 'px', 'marginTop, ' + message);
    assert.strictEqual(window.getComputedStyle(element).marginRight, right + 'px', 'marginRight, ' + message);
    assert.strictEqual(window.getComputedStyle(element).marginBottom, bottom + 'px', 'marginBottom, ' + message);
}

const leftTemplateSize = 150;
const LeftDrawerTester = { // TODO: convert to class with abstract methods
    templateSize: leftTemplateSize,
    template: () => `<div id="template" style="width: ${leftTemplateSize}px; height: 100%; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + 150, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + 150, top: env.drawerRect.top, width: 50, height: 100 }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position');
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template.parentElement size should not cut template'); // or screenshot?
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view')
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
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');

            assert.ok(
                window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible'); // or screenshot?
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement.parentElement, { width: 0 }, 'template.parentElement'); // or screenshot?
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left - 150, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
                checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, -150, 'template should not be visible by position'); // or screenshot?
                assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow'); // or screenshot?
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.templateElement === null) {
                    assert.strictEqual(env.templateElement, null); // Scenarios (overlap, left, expand): opened: false, visible: false -> visible: true
                } else {
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { width: 0 }, 'template.parentElement'); // Scenarios (overlap, left, expand): opened: false
                }
            } else {
                if(env.templateElement) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left - 150, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowX, 'hidden', 'template is shown out of bounds and not visible because of overflowX is hidden'); // or screenshot?
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode')
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
    }
};

const rightTemplateSize = 150;
const RightDrawerTester = { // TODO: convert to class with abstract methods
    templateSize: rightTemplateSize,
    template: () => `<div id="template" style="width: ${rightTemplateSize}px; height: 100%; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left - rightTemplateSize, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 50, height: 100 }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position');
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template.parentElement size should not cut template'); // or screenshot?
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view')
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
                assert.ok( // Scenarios (push, right, expand): opened: false
                    window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                    window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                    'template element should be hidden, view element should be visible'); // or screenshot?
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 50, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');

                assert.ok(
                    window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                    window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                    'template element should be hidden, view element should be visible'); // or screenshot?
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement.parentElement, { width: 0 }, 'template.parentElement'); // or screenshot?
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 200, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
                checkMargin(assert, env.templateElement.parentElement, 0, -rightTemplateSize, 0, 0, 'template should not be visible by position'); // or screenshot?
                assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow'); // or screenshot?
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.templateElement === null) {
                    assert.ok(true); // Scenarios (overlap, right, expand): opened: false, visible: false -> visible: true
                } else {
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { width: 0 }, 'template.parentElement'); // Scenarios (overlap, left, expand): opened: false
                }
            } else {
                if(env.templateElement) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left + 200, top: env.drawerRect.top, width: rightTemplateSize, height: 100 }, 'template');
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowX, 'hidden', 'template is shown out of bounds and not visible because of overflowX is hidden'); // or screenshot?
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode')
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
    }
};

const topTemplateSize = 75;
const TopDrawerTester = { // TODO: convert to class with abstract methods
    templateSize: topTemplateSize,
    template: () => `<div id="template" style="width: 100%; height: ${topTemplateSize}px; background-color: green">template</div>`,

    checkOpened: function(assert, drawer, drawerElement) {
        function checkPush(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left + 150, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkShrink(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 75 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top + 75, width: 200, height: 25 }, 'view');
            checkMargin(assert, env.templateElement.parentElement, 0, 0, 0, 0, 'template should be visible by position'); // or screenshot?
        }
        function checkOverlap(assert, env) {
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 75 }, 'template');
            checkBoundingClientRect(assert, env.templateElement.parentElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 75 }, 'template.parentElement size should not cut template'); // or screenshot?
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
            assert.equal(window.getComputedStyle(env.templateElement.parentElement).zIndex, '1501', 'template should be shown over view'); // or screenshot?
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), true, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view')
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
            checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 150, height: 100 }, 'template');
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');

            assert.ok(
                window.getComputedStyle(env.templateElement.parentElement).position === 'absolute' &&
                window.getComputedStyle(env.viewElement.parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible'); // or screenshot?
        }
        function checkShrink(assert, env) {
            if(env.revealMode === 'expand') {
                checkBoundingClientRect(assert, env.templateElement.parentElement, { height: 0 }, 'template.parentElement'); // or screenshot?
            } else {
                checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top - 75, width: 200, height: 75 }, 'template');

                checkMargin(assert, env.templateElement.parentElement, -75, 0, 0, 0, 'template should not be visible by position'); // or screenshot?
                assert.strictEqual(window.getComputedStyle(env.templateElement.parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow'); // or screenshot?
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }
        function checkOverlap(assert, env) {
            if(env.revealMode === 'expand') {
                if(env.templateElement === null) {
                    assert.ok(true); // Scenarios (overlap, top, expand): opened: false, visible: false -> visible: true
                } else {
                    checkBoundingClientRect(assert, env.templateElement.parentElement, { height: 0 }, 'template.parentElement'); // Scenarios (overlap, top, expand): opened: false
                }
            } else {
                if(env.templateElement) {
                    checkBoundingClientRect(assert, env.templateElement, { left: env.drawerRect.left, top: env.drawerRect.top - 75, width: 200, height: 75 }, 'template'); // or screenshot?
                    assert.strictEqual(window.getComputedStyle(env.drawerElement.firstElementChild).overflowY, 'hidden', 'template is shown out of bounds and not visible because of overflowY is hidden'); // or screenshot?
                } else {
                    assert.notOk(env.templateElement, 'template should not be visible because it was not created');
                }
            }
            checkBoundingClientRect(assert, env.viewElement, { left: env.drawerRect.left, top: env.drawerRect.top, width: 200, height: 100 }, 'view');
        }

        checkBoundingClientRect(assert, drawerElement, { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(drawer.option('visible'), true, 'option(visible)');
        assert.strictEqual(drawer.option('opened'), false, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(drawerElement).display, 'block', 'drawerElement.display');

        const env = {
            drawerElement,
            drawerRect: drawerElement.getBoundingClientRect(),
            templateElement: drawerElement.querySelector('#template'),
            viewElement: drawerElement.querySelector('#view'),
            revealMode: drawer.option('revealMode')
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
    right: RightDrawerTester
};
